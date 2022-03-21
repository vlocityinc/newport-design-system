import { LIGHTNING_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import {
    FlowTestClearRecordFormEvent,
    FlowTestRecordSelectedEvent,
    UpdateTestRecordDataEvent
} from 'builder_platform_interaction/events';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, track, wire } from 'lwc';
import { LABELS } from './flowTestTriggerRecordEditFormLabels';

const { format } = commonUtils;

// This is a hard coded string because it's never actually visualized to customers
export const RECORD_DATA_ERROR = 'Test record data has error(s)';

export default class FlowTestTriggerRecordEditForm extends LightningElement {
    @api
    objectApiName;
    @api
    isUpdatedRecord = false;

    _selectedSampleRecordId?: string;
    @api
    get selectedSampleRecordId() {
        return this._selectedSampleRecordId;
    }
    set selectedSampleRecordId(id) {
        this._selectedSampleRecordId = id;
        Promise.resolve().then(() => {
            this.sampleRecordIds = this.selectedSampleRecordId ? [{ id: this.selectedSampleRecordId }] : [];
        });
    }

    _recordData;
    @api
    get recordData() {
        return this._recordData;
    }
    set recordData(data) {
        this._recordData = data;
        if (this.modifiableFields.length > 0) {
            this.objectFieldAndValues = this.getValuesForKeyArray(this.modifiableFields, this._recordData);
        }
    }

    labels = LABELS;

    /**
     * Switch for controlling if we should load a selected sample record into our record data.
     * Prevents reloading overwritten field values when navigating between tabs
     */
    processSampleRecord = false;

    // For populating the Record Picker when returning to the tab. RecordPicker requires this format instead of just a string
    @track
    sampleRecordIds: { id: string }[] | undefined;
    sampleRecordErrorMessage = '';

    modifiableFields: string[] = [];

    // Needed as input to getRecord when determining fields to load, field names need to be normalized to [Object API Name].[Field Name]
    normalizedFields;

    @track
    objectFieldAndValues: object[] = [];

    get sampleRecordPickerAttributes() {
        return {
            label: format(this.labels.flowTestInitialRecordRecordPickerLabel, this.objectApiName),
            entities: [
                {
                    name: this.objectApiName,
                    label: this.objectApiName
                }
            ],
            placeholder: format(this.labels.flowTestInitialRecordRecordPickerPlaceholder, this.objectApiName)
        };
    }

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo({ data }) {
        if (data) {
            const { fields = {} } = data;
            this.modifiableFields = Object.keys(fields).filter((key) => {
                return fields[key].updateable && fields[key].createable;
            });
            this.normalizedFields = this.modifiableFields.map((value) => {
                return this.objectApiName + '.' + value;
            });
            this.objectFieldAndValues = this.getValuesForKeyArray(this.modifiableFields, this.recordData);
        }
    }

    @wire(getRecord, { recordId: '$selectedSampleRecordId', fields: '$normalizedFields' })
    loadRecordInfo({ data }) {
        if (data && this.processSampleRecord) {
            const objectFieldValuesObject = {};
            const keys = Object.keys(data.fields);
            keys.forEach((fieldName) => {
                const fieldValue = data.fields[fieldName].value;
                objectFieldValuesObject[fieldName] = {
                    value: fieldValue,
                    error: null
                };
            });
            const updateTestRecordDataEvent = new UpdateTestRecordDataEvent(objectFieldValuesObject, false, false);
            this.dispatchEvent(updateTestRecordDataEvent);
            this.processSampleRecord = false;
        }
    }

    /**
     * Push name-value object to target array
     *
     * @param keyArray - Array of field names to extract from data
     * @param data - Hydrated object where value contains an object { [fieldName]: [fieldValue]...}
     * @returns Array with objects shaped with a name and value property
     */
    getValuesForKeyArray(keyArray: string[], data): object[] {
        const mergedKeyValueArray: object[] = [];
        keyArray.forEach((key) => {
            mergedKeyValueArray.push({
                name: key,
                value: this.getValue(data, key)
            });
        });
        return mergedKeyValueArray;
    }

    getValue(data, key) {
        if (data.hasOwnProperty('value') && data.value.hasOwnProperty(key)) {
            return data.value[key].value;
        } else if (data[key] && data[key].hasOwnProperty('value')) {
            return data[key].value;
        }
        return undefined;
    }

    onFieldChange(event) {
        event.preventDefault();
        this.extractAndDispatchFieldValues();
    }

    /**
     * Queries all lightning input fields in this form to extract the value into UpdateTestRecordDataEvent to update store in FlowTestEditor
     */
    extractAndDispatchFieldValues() {
        const inputFields = this.template.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT_FIELD);
        const objectFieldValues = {};
        let hasError = false;
        inputFields.forEach((fieldComponent) => {
            if (fieldComponent.reportValidity() === false) {
                hasError = true;
            }
            objectFieldValues[fieldComponent.fieldName] = {
                value: fieldComponent.value,
                error: hasError ? RECORD_DATA_ERROR : null
            };
        });
        const updateTestRecordDataEvent = new UpdateTestRecordDataEvent(
            objectFieldValues,
            hasError,
            this.isUpdatedRecord
        );
        this.dispatchEvent(updateTestRecordDataEvent);
    }

    handleSampleRecordSelected = async (recordId: string) => {
        const id = recordId === '' ? null : recordId;
        this.processSampleRecord = true;
        const recordSelectedEvent = new FlowTestRecordSelectedEvent(id);
        this.dispatchEvent(recordSelectedEvent);
    };

    handleClearForm() {
        const inputFields = this.template.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT_FIELD);
        inputFields.forEach((fieldComponent) => {
            fieldComponent.reset();
        });
        if (!this.isUpdatedRecord) {
            const recordSelectedEvent = new FlowTestRecordSelectedEvent(null);
            this.dispatchEvent(recordSelectedEvent);
        }
        const clearFormEvent = new FlowTestClearRecordFormEvent(this.isUpdatedRecord);
        this.dispatchEvent(clearFormEvent);
    }
}
