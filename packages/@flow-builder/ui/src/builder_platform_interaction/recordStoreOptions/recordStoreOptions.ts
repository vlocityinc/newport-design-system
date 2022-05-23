// @ts-nocheck
import { RecordStoreOptionChangedEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import { api, LightningElement, track } from 'lwc';
import {
    LABELS,
    NUMBER_RECORDS_LABELS,
    NUMBER_RECORDS_OPTIONS,
    WAY_TO_STORE_FIELDS_LABELS,
    WAY_TO_STORE_FIELDS_OPTIONS
} from './recordStoreOptionsLabels';

export default class RecordStoreFieldsSelection extends LightningElement {
    labels = LABELS;

    @track
    state = {
        numberOfRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
        wayToStoreFields: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
        assignNullValuesIfNoRecordsFound: false,
        resourceDisplayText: '',
        isAutomaticOutputEnabled: true,
        displayNumberRecordsToStore: true,
        displayWayToStoreFields: true
    };

    @api
    elementType;

    set resourceDisplayText(value) {
        this.state.resourceDisplayText = value;
    }

    @api
    get resourceDisplayText() {
        return this.state.resourceDisplayText;
    }

    /**
     * Returns the number of result stored
     *
     * @returns {string} This value can be 'firstRecord' or 'allRecords'
     */
    @api
    get numberOfRecordsToStore() {
        return this.state.numberOfRecordsToStore;
    }

    /**
     * @param {string} value - This value can be 'firstRecord' or 'allRecords'
     */
    set numberOfRecordsToStore(value) {
        this.state.numberOfRecordsToStore = value;
    }

    /**
     * Returns the way the result is stored
     *
     * @returns {string} This value can be 'sObjectVariable' or 'separateVariables'
     */
    @api
    get wayToStoreFields() {
        return this.state.wayToStoreFields;
    }

    /**
     * @param {boolean} value - true : assign null to value if no records are found
     */
    set assignNullValuesIfNoRecordsFound(value) {
        this.state.assignNullValuesIfNoRecordsFound = value;
    }

    @api
    get assignNullValuesIfNoRecordsFound() {
        return this.state.assignNullValuesIfNoRecordsFound;
    }

    @api
    get displayNumberRecordsToStore() {
        return this.state.displayNumberRecordsToStore;
    }

    set displayNumberRecordsToStore(value) {
        this.state.displayNumberRecordsToStore = value;
    }

    @api
    get displayWayToStoreFields() {
        return this.state.displayWayToStoreFields;
    }

    set displayWayToStoreFields(value) {
        this.state.displayWayToStoreFields = value;
    }

    /**
     * @param {string} value - This value can be 'sObjectVariable' or 'separateVariables'
     */
    set wayToStoreFields(value) {
        this.state.wayToStoreFields = value;
    }

    /**
     * @returns {boolean} true if the element is a lookup element false otherwise
     */
    get isLookupElement() {
        return this.elementType === ELEMENT_TYPE.RECORD_LOOKUP;
    }

    get recordStoreOptions() {
        return NUMBER_RECORDS_OPTIONS[this.elementType];
    }

    get wayToStoreFieldsOptions() {
        return WAY_TO_STORE_FIELDS_OPTIONS[this.elementType];
    }

    get numberRecordsToStoreLabel() {
        return NUMBER_RECORDS_LABELS[this.elementType];
    }

    get wayToStoreRecordLabel() {
        return WAY_TO_STORE_FIELDS_LABELS[this.elementType];
    }

    get isGetFirstRecord() {
        return this.state.numberOfRecordsToStore === NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
    }

    /**
     * @returns {boolean} true if the element type is Record lookup or Record create
     * and the user has selected "First Record" in the first radio button group
     */
    get showWayToStoreFieldSelector() {
        return (
            (this.elementType === ELEMENT_TYPE.RECORD_LOOKUP || this.elementType === ELEMENT_TYPE.RECORD_CREATE) &&
            this.state.numberOfRecordsToStore === NUMBER_RECORDS_OPTIONS[this.elementType][0].value
        );
    }

    handleNumberRecordsToStoreChange(event) {
        event.stopPropagation();
        this.state.numberOfRecordsToStore = event.detail.value;
        this.dispatchEvent(
            new RecordStoreOptionChangedEvent(
                this.isGetFirstRecord,
                this.state.wayToStoreFields,
                this.state.assignNullValuesIfNoRecordsFound
            )
        );
    }

    handleWayToStoreFieldsChange(event) {
        event.stopPropagation();
        this.state.wayToStoreFields = event.detail.value;
        this.dispatchEvent(
            new RecordStoreOptionChangedEvent(
                this.isGetFirstRecord,
                this.state.wayToStoreFields,
                this.state.assignNullValuesIfNoRecordsFound
            )
        );
    }

    handleAssignNullValuesIfNoRecordsFoundChange(event) {
        event.stopPropagation();
        this.state.assignNullValuesIfNoRecordsFound = event.detail.checked;
        this.dispatchEvent(
            new RecordStoreOptionChangedEvent(
                this.isGetFirstRecord,
                this.state.wayToStoreFields,
                this.state.assignNullValuesIfNoRecordsFound
            )
        );
    }
}
