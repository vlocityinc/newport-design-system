import { Element, api, track } from 'engine';
import { LABELS } from './record-store-options-labels';
import { RecordStoreOptionChangedEvent } from 'builder_platform_interaction-events';

const NUMBER_RECORDS_TO_STORE_OPTIONS = [{
    label : LABELS.firstRecord,
    value : 'firstRecord'
}, {
    label : LABELS.allRecords,
    value : 'allRecord'
}];

const WAY_TO_STORE_FIELDS_OPTIONS = [{
    label : LABELS.togetherInsObjectVariable,
    value : 'sObjectVariable'
}, {
    label : LABELS.separateVariable,
    value : 'separateVariables'
}];

export default class RecordStoreFieldsSelection extends Element {
    numberRecordsToStoreOption = NUMBER_RECORDS_TO_STORE_OPTIONS;
    wayToStoreFieldsOption = WAY_TO_STORE_FIELDS_OPTIONS;
    labels = LABELS;

    @track
    state = {
        showWayToStoreFieldSelector : false,
        numberOfRecordsToStore : 'firstRecord',
        wayToStoreFields : 'sObjectVariable',
        assignNullValuesIfNoRecordsFound : false,
        resourceApiName : '',
    };

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
    handleNumberRecordsToStoreChange(event) {
        event.stopPropagation();
        this.state.numberOfRecordsToStore = event.detail.value;
        // The second radio button group is displayed only if the 2 radio button is selected.
        // TODO : Uncomment when implementing : W-4961821
        // this.state.showWayToStoreFieldSelector = this.state.numberOfRecordsToStore === NUMBER_RECORDS_TO_STORE_OPTIONS[0].value;
        this.dispatchEvent(new RecordStoreOptionChangedEvent(this.state.numberOfRecordsToStore,
            this.state.wayToStoreFields,
            this.state.selectedAssignNullToVariableNoRecord));
    }

    handleWayToStoreFieldsChange(event) {
        event.stopPropagation();
        this.state.wayToStoreFields = event.detail.value;
        this.dispatchEvent(new RecordStoreOptionChangedEvent(this.state.numberOfRecordsToStore,
            this.state.wayToStoreFields,
            this.state.selectedAssignNullToVariableNoRecord));
    }

    handleAssignNullToVariableNoRecordChange(event) {
        event.stopPropagation();
        this.state.selectedAssignNullToVariableNoRecord = event.detail.value;
        this.dispatchEvent(new RecordStoreOptionChangedEvent(this.state.numberOfRecordsToStore,
            this.state.wayToStoreFields,
            this.state.selectedAssignNullToVariableNoRecord));
    }
}