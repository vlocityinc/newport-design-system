import { LightningElement, api, track } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { MapElement, DEFAULT_OUTPUT_TYPE } from 'builder_platform_interaction/mapEditorLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { mapReducer } from './mapReducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from './mapEditorLabels';
import {
    UpdateCollectionProcessorEvent,
    PrepopulateMapItemsEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getElementByDevName, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import {
    DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX,
    ASSIGN_NEXT_VALUE_TO_REFERENCE,
    generateVariable,
    getNodeName,
    devNameToGuid,
    deleteOrRestoreVariable,
    updateVariable
} from 'builder_platform_interaction/collectionProcessorLib';
import { getUniqueDuplicateElementName } from 'builder_platform_interaction/storeUtils';

const { format } = commonUtils;

export default class MapEditor extends LightningElement {
    labels = LABELS;
    @track mapElement: MapElement = {
        collectionReference: { value: null, error: null },
        assignNextValueToReference: { value: null, error: null },
        mapItems: [],
        outputSObjectType: { value: null, error: null }
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
    shouldDeleteVariable = false;

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
        // set outputSObjectType to 'Recommendation' by default
        if (!this.mapElement.outputSObjectType.value) {
            const event = new PropertyChangedEvent('outputSObjectType', DEFAULT_OUTPUT_TYPE, null);
            this.updateMapElement(event);
        }
        this.outputObjectType = this.mapElement.outputSObjectType.value;
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
        if (this.mapElement.assignNextValueToReference.value) {
            const currentVar = getElementByGuid(this.mapElement.assignNextValueToReference.value);
            if (currentVar) {
                this.currentItemVariable = currentVar.name;
            }
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
        this.createCurrentItemVariableAndUpdateMapElement();
        // fetch output fields
        this.fetchOutputFields();
    }

    disconnectedCallback() {
        // when user click on cancel:
        // - the curent item variable was created when open the editor -> delete it
        // - the curent item variable was updated -> restore to the original variable
        deleteOrRestoreVariable(
            this.currentItemVariable,
            this.originalVariable,
            this.shouldRestoreVariable,
            this.shouldDeleteVariable
        );
    }

    /**
     * Create the current item variable
     *
     */
    createCurrentItemVariableAndUpdateMapElement() {
        if (!this.currentItemVariable) {
            this.currentItemVariable = generateVariable(FLOW_DATA_TYPE.SOBJECT.value, this.inputObjectType);
            // update assignNextValueToReference in map element
            const event = new PropertyChangedEvent(ASSIGN_NEXT_VALUE_TO_REFERENCE, this.currentItemVariable, null);
            this.updateMapElement(event);
            this.shouldDeleteVariable = true;
        } else if (!this.originalVariable) {
            this.originalVariable = getElementByDevName(this.currentItemVariable);
        }
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
            const nodeName = getNodeName(this.inputVariables);
            if (nodeName) {
                const varName = DEFAULT_CURRENT_ITEM_VARIABLE_PREFIX + nodeName;
                if (this.currentItemVariable !== varName) {
                    this.updateCurrentItemVariable('name', getUniqueDuplicateElementName(varName));
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
        if (this.mapElement.outputSObjectType.value) {
            fetchFieldsForEntity(this.mapElement.outputSObjectType.value)
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
        const updated = updateVariable(this.currentItemVariable, property, value);
        if (updated && property === 'name') {
            this.currentItemVariable = value;
            const event = new PropertyChangedEvent(ASSIGN_NEXT_VALUE_TO_REFERENCE, this.currentItemVariable, null);
            this.updateMapElement(event);
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
                    // update current item variable type
                    this.updateCurrentItemVariable('subtype', this.inputObjectType);
                    // reset map items
                    this.updateMapItems();
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
