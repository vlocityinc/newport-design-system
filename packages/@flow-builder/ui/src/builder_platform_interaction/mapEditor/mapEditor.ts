import { LightningElement, api, track } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { format } from 'builder_platform_interaction/commonUtils';
import {
    MapElement,
    getUniqueElementName,
    DEFAULT_CURRENT_ITEM_VARIABLE,
    DEFAULT_OUTPUT_TYPE,
    DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX,
    devNameToGuid
} from 'builder_platform_interaction/mapEditorLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { mapReducer } from './mapReducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './mapEditorLabels';
import {
    UpdateCollectionProcessorEvent,
    PrepopulateMapItemsEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { addElement, deleteElements, updateElement } from 'builder_platform_interaction/actions';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import { getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';

export default class MapEditor extends LightningElement {
    labels = LABELS;
    @track mapElement: MapElement = {
        collectionReference: { value: null, error: null },
        currentValueFromCollection: { value: null, error: null },
        mapItems: [],
        outputTable: { value: null, error: null },
        storeOutputAutomatically: true
    };

    @track
    inputObjectType;

    @track
    outputObjectType;

    @track
    helpText;

    @track
    outputHelpText = this.labels.selectCollection;

    @track
    outputFields = {};

    @track
    currentItemVariable;

    @track
    shouldRestoreVariable = true;

    @track
    shouldCreateVariable = false;

    @api
    get elementInfo() {
        return this.mapElement;
    }

    /**
     * Set the map element from parent editor (collectionProcessorEditor)
     *
     */
    set elementInfo(value) {
        if (value) {
            this.mapElement = value;
        }
        // set outputTable to 'Recommendation' by default
        if (!this.mapElement.outputTable.value) {
            const event = new PropertyChangedEvent('outputTable', DEFAULT_OUTPUT_TYPE, null);
            this.updateMapElement(event);
        }
        this.outputObjectType = this.mapElement.outputTable.value;
        // get collection variable and update help text
        if (this.mapElement.collectionReference.value) {
            const collectionVariable = getVariableOrField(
                this.mapElement.collectionReference.value,
                Store.getStore().getCurrentState().elements
            );
            if (collectionVariable && collectionVariable.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                this.inputObjectType = collectionVariable.subtype;
                this.updateHelpText();
            }
        }
        // get current item variable
        if (this.mapElement.currentValueFromCollection.value) {
            this.currentItemVariable = this.mapElement.currentValueFromCollection.value;
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

    connectedCallback() {
        // create the variable if it is not exist
        this.createCurrentItemVariable();
        // fetch output fields
        this.fetchOutputFields();
    }

    disconnectedCallback() {
        // when user click on cancel:
        // - the curent item variable was created when open the editor -> delete it
        // - the curent item variable was updated -> restore to the original variable
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
                const elementUi = getElementByDevName(this.currentItemVariable);
                let elementInStore = getElementForStore(elementUi);
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
            // create the variable
            this.currentItemVariable = getUniqueElementName(DEFAULT_CURRENT_ITEM_VARIABLE);
            let varElement: any = {};
            varElement = createVariable({
                name: this.currentItemVariable,
                dataType: FLOW_DATA_TYPE.SOBJECT.value,
                subtype: this.inputObjectType ? this.inputObjectType : '',
                isCollection: false,
                isInput: true,
                isOutput: false
            });
            Store.getStore().dispatch(addElement(varElement));
            // update currentValueFromCollection in map element
            const event = new PropertyChangedEvent('currentValueFromCollection', this.currentItemVariable, null);
            this.updateMapElement(event);
            this.shouldCreateVariable = true;
        } else if (!this.originalVariable) {
            this.originalVariable = getElementByDevName(this.currentItemVariable);
        }
    }

    /**
     * Get the map node name
     *
     * @returns {string} map node name
     */
    getNodeName() {
        if (
            this.inputVariables &&
            this.inputVariables[0] &&
            this.inputVariables[0].name === 'nodeName' &&
            this.inputVariables[0].value
        ) {
            return this.inputVariables[0].value;
        }
        return null;
    }

    /**
     * Validate the map editor. This method will be called in the upper editor
     *
     * @returns {Object[]} List of errors
     */
    @api
    validate() {
        const event = {
            type: VALIDATE_ALL
        };
        this.mapElement = mapReducer(this.mapElement, event);
        const errors = getErrorsFromHydratedElement(this.mapElement);
        this.shouldRestoreVariable = errors.length !== 0;
        if (errors.length === 0) {
            const nodeName = this.getNodeName();
            if (nodeName) {
                const varName = DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX + nodeName;
                if (this.currentItemVariable !== varName) {
                    this.updateCurrentItemVariable('name', getUniqueElementName(varName));
                }
            }
        }
        return errors;
    }

    /**
     * Fetch output's fields
     *
     */
    fetchOutputFields() {
        if (this.mapElement.outputTable.value) {
            fetchFieldsForEntity(this.mapElement.outputTable.value)
                .then((fields) => {
                    this.outputFields = Object.keys(fields)
                        .filter((key) => fields[key].creatable)
                        .reduce((obj, key) => {
                            obj[key] = fields[key];
                            return obj;
                        }, {});
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    /**
     * Update map items when the input object type changed
     *
     */
    updateMapItems() {
        if (this.inputObjectType) {
            fetchFieldsForEntity(this.inputObjectType)
                .then((fields) => {
                    const guid = devNameToGuid(this.currentItemVariable);
                    const prepopulateEvent = new PrepopulateMapItemsEvent(
                        this.outputObjectType,
                        this.outputFields,
                        guid,
                        this.inputObjectType,
                        fields
                    );
                    this.mapElement = mapReducer(this.mapElement, prepopulateEvent);
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    /**
     * Update help text when input object type changed
     *
     */
    updateHelpText() {
        if (this.inputObjectType) {
            this.helpText = format(this.labels.newCollection, this.outputObjectType);
            this.outputHelpText =
                this.inputObjectType === this.outputObjectType ? this.labels.addFields : this.labels.selectCollection;
        } else {
            // reset help text
            this.helpText = null;
            this.outputHelpText = this.labels.selectCollection;
        }
    }

    /**
     * Update current item variable (subtype, name)
     *
     * @param property variable property
     * @param value new value
     */
    updateCurrentItemVariable(property, value) {
        // update current var subtype
        if (this.currentItemVariable && value) {
            const elementUi = getElementByDevName(this.currentItemVariable);
            const currentItemInStore = getElementForStore(elementUi);
            currentItemInStore[property] = value;
            Store.getStore().dispatch(updateElement(currentItemInStore));
            if (property === 'name') {
                this.currentItemVariable = value;
                // update currentValueFromCollection in map element
                const event = new PropertyChangedEvent('currentValueFromCollection', this.currentItemVariable, null);
                this.updateMapElement(event);
            }
        }
    }

    /**
     * Update input object type
     *
     * @param collectionValue  the selected input collection
     */
    updateInputObjectType(collectionValue: string | null) {
        if (collectionValue) {
            const collectionVariable = getVariableOrField(collectionValue, Store.getStore().getCurrentState().elements);
            if (collectionVariable) {
                const newInputObjectType = collectionVariable.subtype;
                if (this.inputObjectType !== newInputObjectType) {
                    this.inputObjectType = newInputObjectType;
                    // reset map items
                    this.updateMapItems();
                    // update current item variable type
                    this.updateCurrentItemVariable('subtype', this.inputObjectType);
                }
            }
        } else {
            this.inputObjectType = null;
        }
        // update help text
        this.updateHelpText();
    }

    /**
     * Update map element and dispatch UpdateCollectionProcessorEvent to the parent editor
     *
     * @param event  the custome event
     */
    updateMapElement(event: CustomEvent) {
        this.mapElement = mapReducer(this.mapElement, event);
        // dispatch event to the parent editor
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.mapElement));
    }

    /**
     * Handle input collection changed event
     *
     * @param event  changed event
     */
    handleCollectionVariablePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
        this.mapElement = mapReducer(this.mapElement, event);
        this.updateInputObjectType(this.mapElement.collectionReference.value);
        // dispatch event to the parent editor
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.mapElement));
    }

    /**
     * Handle map item changed event
     *
     * @param event  changed event
     */
    handleMapItemChanged(event: CustomEvent) {
        event.stopPropagation();
        this.updateMapElement(event);
    }
}
