import { LightningElement, api, track } from 'lwc';
import { recordCreateReducer } from './record-create-reducer';
import { LABELS } from './record-create-editor-labels';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction-expression-utils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction-record-editor-lib';

export default class RecordCreateEditor extends LightningElement {
    labels = LABELS;

    _numberRecordsToStore = NUMBER_RECORDS_TO_STORE.FIRST_RECORD;

    /**
     * Internal state for the editor
     */
    @track
    recordCreateElement = {};

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.node;
    }

    @api
    get node() {
        return this.recordCreateElement;
    }

    set node(newValue) {
        this.recordCreateElement = newValue;
    }

    /**
     * public api function to run the rules from record create validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.recordCreateElement = recordCreateReducer(this.recordCreateElement, event);
        return getErrorsFromHydratedElement(this.recordCreateElement);
    }

    /**
     * Returns the number of result stored.
     * If firstRecord then the user will be able to select a sObject variable
     * If allRecord then the user will be able to select a sObject Collection variable
     * @returns {String} This value can be 'firstRecord' or 'allRecords'
     */
    get numberRecordsToStore() {
        if (this.recordCreateElement.inputReference && this.recordCreateElement.inputReference.value) {
            const variable = getResourceByUniqueIdentifier(this.recordCreateElement.inputReference.value);
            if (variable) {
                this._numberRecordsToStore = variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
            }
        }
        // TODO : Modify it when implementing : W-4961821
        return this._numberRecordsToStore;
    }

    get isSObjectVersion() {
        return this.recordCreateElement.inputReference;
    }

    get isCollection() {
        return this.numberRecordsToStore === NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
    }

    get inputReference() {
        if (this.recordCreateElement.inputReference && this.recordCreateElement.inputReference.value) {
            return this.recordCreateElement.inputReference.value;
        }
        return '';
    }

    get assignNullValuesIfNoRecordsFound() {
        return this.recordCreateElement.assignNullValuesIfNoRecordsFound;
    }

    get sObjectVariablePickerPlaceholder() {
        return !this.isCollection ? this.labels.sObjectVariablePlaceholder : this.labels.sObjectCollectionVariablePlaceholder;
    }

    get sObjectVariablePickerLabel() {
        return !this.isCollection ? this.labels.recordVariable : this.labels.recordCollectionVariable;
    }

    handleRecordStoreOptionChangedEvent(event) {
        event.stopPropagation();
        this._numberRecordsToStore = event.detail.numberRecordsToStore;
        // The inputReference value is cleared when the user change the record store option
        this.updateProperty('inputReference', '', null, true);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty(event.detail.propertyName, event.detail.value, event.detail.error, false);
    }

    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error, false);
    }

    updateProperty(propertyName, value, error, ignoreValidate) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error, ignoreValidate });
        this.recordCreateElement = recordCreateReducer(this.recordCreateElement, action);
    }
}