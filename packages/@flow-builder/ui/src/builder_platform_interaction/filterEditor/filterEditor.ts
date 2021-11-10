import { SORTABLE_FILTER } from 'builder_platform_interaction/collectionProcessorLib';
import { LightningElement, api, track } from 'lwc';
import { addElement, deleteElements, updateElement } from 'builder_platform_interaction/actions';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { UpdateCollectionProcessorEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { filterReducer } from './filterReducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getElementByDevName, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import {
    getUniqueElementName,
    DEFAULT_CURRENT_ITEM_VARIABLE,
    DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX
} from 'builder_platform_interaction/mapEditorLib';
import { LABELS } from './filterEditorLabels';
import { Store } from 'builder_platform_interaction/storeLib';
import { SObjectOrApexReference } from 'builder_platform_interaction/sortEditorLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

const ASSIGN_NEXT_VALUE_TO_REFERENCE = 'assignNextValueToReference';
const SUBTYPE = 'subtype';
const DATA_TYPE = 'dataType';

export default class FilterEditor extends LightningElement {
    @track
    filterElement = {
        collectionReference: { value: '', error: null },
        assignNextValueToReference: { value: '', error: null },
        conditions: [],
        conditionLogic: { value: CONDITION_LOGIC.AND, error: null },
        formula: { value: '', error: null }
    };

    @track
    sObjectOrApexReference: SObjectOrApexReference = { value: null };

    @track
    inputCollectionType = {
        subtype: null,
        dataType: null
    };

    @track
    recordFields = {};

    @track
    currentItemVariable;

    @track
    shouldRestoreVariable = true;

    @track
    shouldCreateVariable = false;

    @api
    get elementInfo() {
        return this.filterElement;
    }

    set elementInfo(element) {
        if (element) {
            this.filterElement = element;
        }

        if (this.filterElement.collectionReference.value) {
            this.collectionVariable = getVariableOrField(
                this.filterElement.collectionReference.value,
                Store.getStore().getCurrentState().elements
            );
            this.setInputCollectionType();
            this.setCollectionReference();
        }

        if (this.filterElement.assignNextValueToReference.value) {
            this.getCurrentItemVariable();
        }
    }

    @api
    get inputVariables() {
        return this._inputVariables;
    }

    /**
     * Set the input variables from parent editor (collectionProcessorEditor)
     *
     */
    set inputVariables(value) {
        if (value) {
            this._inputVariables = value;
        }
    }

    /**
     * public api function to run the rules from decision validation library
     *
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.filterElement = filterReducer(this.filterElement, event);
        const error = getErrorsFromHydratedElement(this.filterElement);
        this.shouldRestoreVariable = !!error.length;
        if (!error.length) {
            const nodeName = this.getNodeName();

            if (nodeName) {
                const varName = DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX + nodeName;
                if (this.currentItemVariable !== varName) {
                    this.updateCurrentItemVariable('name', getUniqueElementName(varName));
                }
            }
        }
        return error;
    }

    get labels() {
        return LABELS;
    }

    // input collection filter is the same as in sort editor: sObject, primitive, and apex type
    get collectionProcessorFilter() {
        return SORTABLE_FILTER;
    }

    connectedCallback() {
        this.createCurrentItemVariable();
        this.fetchRecordFields();
    }

    disconnectedCallback() {
        // on cancel editing
        // if the curent item variable was created when open the editor -> delete it
        // if curent item variable was updated -> restore to its original value
        if (this.shouldRestoreVariable) {
            if (this.shouldCreateVariable) {
                // delete variable
                Store.getStore().dispatch(
                    deleteElements({
                        elementType: ELEMENT_TYPE.VARIABLE,
                        selectedElements: [getElementByDevName(this.currentItemVariable)]
                    })
                );
            } else {
                // restore to original variable
                const element = getElementByDevName(this.currentItemVariable);
                let elementInStore = getElementForStore(element);
                elementInStore = { ...elementInStore, ...this.originalVariable };
                Store.getStore().dispatch(updateElement(elementInStore));
            }
        }
    }

    /**
     * Create the current item variable
     *
     */
    createCurrentItemVariable() {
        if (!this.currentItemVariable) {
            this.currentItemVariable = getUniqueElementName(DEFAULT_CURRENT_ITEM_VARIABLE);
            let varElement: any = {};
            varElement = createVariable({
                name: this.currentItemVariable,
                dataType: FLOW_DATA_TYPE.SOBJECT.value,
                subtype: this.inputCollectionType ? this.inputCollectionType.subtype : '',
                isCollection: false,
                isInput: true,
                isOutput: false
            });

            Store.getStore().dispatch(addElement(varElement));
            const event = new PropertyChangedEvent(ASSIGN_NEXT_VALUE_TO_REFERENCE, this.currentItemVariable, null);

            this.updateFilterElement(event);
            this.shouldCreateVariable = true;
        } else if (!this.originalVariable) {
            this.originalVariable = getElementByDevName(this.currentItemVariable);
        }
    }

    fetchRecordFields() {
        this.recordFields = {};
        if (
            this.collectionVariable &&
            this.collectionVariable.subtype &&
            this.collectionVariable.dataType === FLOW_DATA_TYPE.SOBJECT.value
        ) {
            fetchFieldsForEntity(this.collectionVariable.subtype)
                .then((fields) => {
                    this.recordFields = fields;
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    getCurrentItemVariable() {
        const currentVar = getElementByGuid(this.filterElement.assignNextValueToReference.value);
        if (currentVar) {
            this.currentItemVariable = currentVar.name;
        }
    }

    /**
     * Get the filter node name
     *
     * @returns {string} filter node name
     */
    getNodeName() {
        if (
            this.inputVariables &&
            this.inputVariables[0] &&
            this.inputVariables[0].value &&
            this.inputVariables[0].name === 'nodeName'
        ) {
            return this.inputVariables[0].value;
        }
        return null;
    }

    setInputCollectionType() {
        if (this.collectionVariable) {
            this.inputCollectionType = this.collectionVariable;
        }
    }

    setCollectionReference() {
        if (!this.collectionVariable) {
            return;
        }
        const isSObject = this.collectionVariable.dataType === FLOW_DATA_TYPE.SOBJECT.value;
        const isApexClass = this.collectionVariable.dataType === FLOW_DATA_TYPE.APEX.value;
        const value = this.collectionVariable.subtype;
        this.sObjectOrApexReference = { value, isSObject, isApexClass };
    }

    /**
     * Update input object type
     *
     * @param collectionReferenceValue  the selected input collection
     */
    updateInputCollectionType(collectionReferenceValue: string | null) {
        if (collectionReferenceValue) {
            this.collectionVariable = getVariableOrField(
                collectionReferenceValue,
                Store.getStore().getCurrentState().elements
            );

            if (this.collectionVariable) {
                // primitive doesn't have suubtype
                const newInputSubtype = this.collectionVariable.subtype;
                const newInputDataType = this.collectionVariable.dataType;

                if (this.inputCollectionType.subtype !== newInputSubtype) {
                    this.updateCurrentItemVariable(SUBTYPE, this.inputCollectionType.subtype);
                }

                if (this.inputCollectionType.dataType !== newInputDataType) {
                    this.updateCurrentItemVariable(DATA_TYPE, this.inputCollectionType.dataType);
                }
            }
        } else {
            this.inputCollectionType = { subtype: null, dataType: null };
        }
    }

    /**
     * Update filter element state
     * dispatch UpdateCollectionProcessorEvent to the parent collection processor editor
     *
     * @param event  the custome event
     */
    updateFilterElement(event: CustomEvent) {
        this.filterElement = filterReducer(this.filterElement, event);
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.filterElement));
    }

    /**
     * Update current item variable (subtype, name)
     *
     * @param property variable property
     * @param value new value
     */
    updateCurrentItemVariable(property, value) {
        if (this.currentItemVariable && value) {
            const element = getElementByDevName(this.currentItemVariable);
            const elementInStore = getElementForStore(element);

            elementInStore[property] = value;
            Store.getStore().dispatch(updateElement(elementInStore));

            if (property === 'name') {
                this.currentItemVariable = value;
                const event = new PropertyChangedEvent(ASSIGN_NEXT_VALUE_TO_REFERENCE, this.currentItemVariable, null);
                this.updateFilterElement(event);
            }
        }
    }

    // on input collection property change
    // update input collection type, collection reference, and entity fields
    handleCollectionVariablePropertyChange(event: CustomEvent) {
        event.stopPropagation();
        this.filterElement = filterReducer(this.filterElement, event);
        this.updateInputCollectionType(this.filterElement.collectionReference.value);
        this.setCollectionReference();
        this.fetchRecordFields();
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.filterElement));
    }

    handleFilterConditionChange(event: CustomEvent) {
        event.stopPropagation();
        this.updateFilterElement(event);
    }
}
