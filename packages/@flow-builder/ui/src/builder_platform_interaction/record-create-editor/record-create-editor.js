import { Element, api, track, unwrap } from 'engine';
import { recordCreateReducer } from './record-create-reducer';
import { LABELS } from './record-create-editor-labels';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction-record-editor-lib';

export default class RecordCreateEditor extends Element {
    labels = LABELS;

    _numberRecordsToStore = NUMBER_RECORDS_TO_STORE.FIRST_RECORD;

    /**
     * Internal state for the editor
     */
    @track
    recordCreateElement = {};

    /**
     * public api function to return the unwrapped node
     *
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.node);
    }

    @api
    get node() {
        return this.recordCreateElement;
    }

    @api
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
            const variable = getElementByGuid(this.recordCreateElement.inputReference.value);
            return variable && variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
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
        return !this.isCollection ? this.labels.sObjectVariable : this.labels.sObjectCollectionVariable;
    }

    handleRecordStoreOptionChangedEvent(event) {
        event.stopPropagation();
        this._numberRecordsToStore = event.detail.numberRecordsToStore;
        // The inputReference value is cleared when the user change the record store option
        this.updateProperty('inputReference', null, null);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty(event.detail.propertyName, event.detail.value, event.detail.error);
    }

    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error);
    }

    updateProperty(propertyName, value, error) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.recordCreateElement = recordCreateReducer(this.recordCreateElement, action);
    }
}