import { Element, api, track } from 'engine';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { LABELS, NUMBER_RECORDS_OPTIONS,
    NUMBER_RECORDS_LABELS,
    WAY_TO_STORE_FIELDS_LABELS,
    WAY_TO_STORE_FIELDS_OPTIONS } from './record-store-options-labels';
import { RecordStoreOptionChangedEvent } from 'builder_platform_interaction-events';

export default class RecordStoreFieldsSelection extends Element {
    wayToStoreFieldsOption = WAY_TO_STORE_FIELDS_OPTIONS;
    labels = LABELS;

    @track
    state = {
        showWayToStoreFieldSelector : false, // TODO : should be true when implementing : W-4961821
        numberOfRecordsToStore : 'firstRecord',
        wayToStoreFields : 'sObjectVariable',
        assignNullValuesIfNoRecordsFound : false,
        resourceApiName : '',
    };

    @api
    elementType;

    @api
    set resourceApiName(value) {
        this.state.resourceApiName = value;
    }

    @api
    get resourceApiName() {
        return this.state.resourceApiName;
    }

    /**
     * Returns the number of result stored
     * @returns {String} This value can be 'firstRecord' or 'allRecord'
     */
    @api
    get numberOfRecordsToStore() {
        return this.state.numberOfRecordsToStore;
    }

    /**
     * @param {String} value - This value can be 'firstRecord' or 'allRecord'
     */
    @api
    set numberOfRecordsToStore(value) {
        this.state.numberOfRecordsToStore = value;
    }

    /**
     * Returns the way the result is stored
     * @returns {String} This value can be 'sObjectVariable' or 'separateVariables'
     */
    @api
    get wayToStoreFields() {
        return this.state.wayToStoreFields;
    }

    /**
     * @param {Boolean} value - true : assign null to value if no records are found
     */
    @api
    set assignNullValuesIfNoRecordsFound(value) {
        this.state.assignNullValuesIfNoRecordsFound = value;
    }

    @api
    get assignNullValuesIfNoRecordsFound() {
        return this.state.assignNullValuesIfNoRecordsFound;
    }

    /**
     * @param {String} value - This value can be 'sObjectVariable' or 'separateVariables'
     */
    @api
    set wayToStoreFields(value) {
        this.state.wayToStoreFields = value;
    }

    get title() {
        return this.labels.storeFieldsSelectionLabel.replace('{0}', this.state.resourceApiName);
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

    get numberRecordsToStoreLabel() {
        return NUMBER_RECORDS_LABELS[this.elementType];
    }

    get wayToStoreRecordLabel() {
        return WAY_TO_STORE_FIELDS_LABELS[this.elementType];
    }

    handleNumberRecordsToStoreChange(event) {
        event.stopPropagation();
        this.state.numberOfRecordsToStore = event.detail.value;
        // The second radio button group is displayed only if the 2 radio button is selected.
        // TODO : Uncomment when implementing : W-4961821
        /* this.state.showWayToStoreFieldSelector = (this.elementType === ELEMENT_TYPE.RECORD_LOOKUP
                                                || this.elementType === ELEMENT_TYPE.RECORD_CREATE)
                                                && this.state.numberOfRecordsToStore === NUMBER_RECORDS_OPTIONS.get(this.elementType)[0].value; */
        this.dispatchEvent(new RecordStoreOptionChangedEvent(this.state.numberOfRecordsToStore,
            this.state.wayToStoreFields,
            this.state.assignNullValuesIfNoRecordsFound));
    }

    handleWayToStoreFieldsChange(event) {
        event.stopPropagation();
        this.state.wayToStoreFields = event.detail.value;
        this.dispatchEvent(new RecordStoreOptionChangedEvent(this.state.numberOfRecordsToStore,
            this.state.wayToStoreFields,
            this.state.assignNullValuesIfNoRecordsFound));
    }

    handleAssignNullValuesIfNoRecordsFoundChange(event) {
        event.stopPropagation();
        this.state.assignNullValuesIfNoRecordsFound = event.detail.value;
        this.dispatchEvent(new RecordStoreOptionChangedEvent(this.state.numberOfRecordsToStore,
            this.state.wayToStoreFields,
            this.state.assignNullValuesIfNoRecordsFound));
    }
}