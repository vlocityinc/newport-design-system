import { Element, api, track } from "engine";
import { RECORD_FILTER_CRITERIA, ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { LABELS, CRITERIA_RECORDS_LABELS, WARNING_LABELS } from './record-filter-labels';
import {
    AddRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    RecordLookupFilterTypeChangedEvent
} from 'builder_platform_interaction-events';

const FILTER_TYPE_OPTIONS = [{
    label : LABELS.filterNoCriteria,
    value : RECORD_FILTER_CRITERIA.NONE
}, {
    label : LABELS.filterAllCriterias,
    value : RECORD_FILTER_CRITERIA.ALL
}];

export default class RecordFilter extends Element {
    labels = LABELS;

    @track
    selectedFilter = RECORD_FILTER_CRITERIA.NONE;

    @track items = [];

    @track entityFields = [];

    @track entityName = '';

    @api
    elementType;

    /**
     * The filter type to pass as value of the rule for finding record drop down
     * @param {String} value - it's RECORD_FILTER_CRITERIA.NONE or RECORD_FILTER_CRITERIA.ALL
     */
    @api
    set filterType(value) {
        this.selectedFilter = value;
    }

    @api
    get filterType() {
        return this.selectedFilter;
    }

    /**
     * The filter items
     * @param {Object} value - it comes from the recordNode.filters
     */
    @api
    set filterItems(value) {
        this.items = value;
    }

    @api
    get filterItems() {
        return this.items;
    }

    /**
     * @param {String} entityName the selected record object
     */
    @api
    set recordEntityName(entityName) {
        this.entityName = entityName;
    }

    @api
    get recordEntityName() {
        return this.entityName;
    }
    /**
     * @param {Object} fields - Fields of the entity
     */
    @api
    set recordFields(fields) {
        this.entityFields = fields;
    }

    @api
    get recordFields() {
        return this.entityFields;
    }

    /**
     * expression builder config to pass to expression-builder component
     */
    get expressionBuilderConfig() {
        return {elementType: this.elementType,
            lhsFields: this.entityFields,
            objectType: this.entityName};
    }

    get showDeleteFilter() {
        return this.filterItems.length > 1;
    }

    get filterOptions() {
        return FILTER_TYPE_OPTIONS;
    }

    get filterItemsClass() {
        return (this.selectedFilter === RECORD_FILTER_CRITERIA.ALL) ? '' : 'slds-hide';
    }

    get filterLabel() {
        return CRITERIA_RECORDS_LABELS[this.elementType];
    }

    get warningMessage() {
        return WARNING_LABELS[this.elementType].replace('{0}', this.entityName);
    }

    get showWarningMessage() {
        return (this.elementType === ELEMENT_TYPE.RECORD_UPDATE || this.elementType === ELEMENT_TYPE.RECORD_DELETE) && this.selectedFilter === RECORD_FILTER_CRITERIA.NONE;
    }
    /**
     * handle event when changing the filter type in the rule for finding record dropdown
     * @param {Object} event the filter type changed event
     */
    handleFilterTypeChanged(event) {
        event.stopPropagation();
        this.selectedFilter = event.detail.value;
        // fire RecordFilterTypeChangedEvent
        const recordLookupFilterTypeChangedEvent = new RecordLookupFilterTypeChangedEvent(this.selectedFilter);
        this.dispatchEvent(recordLookupFilterTypeChangedEvent);
    }

    /**
     * handle event when adding the new filter
     * @param {Object} event the add filter event
     */
    handleAddFilter(event) {
        event.stopPropagation();
        const addRecordLookupFilterEvent = new AddRecordLookupFilterEvent();
        this.dispatchEvent(addRecordLookupFilterEvent);
    }

    /**
     * handle event when updating the filter
     * @param {Object} event the update filter event
     */
    handleUpdateFilter(event) {
        event.stopPropagation();
        const updateRecordLookupFilterEvent = new UpdateRecordLookupFilterEvent(event.detail.index, event.detail.value, event.detail.error);
        this.dispatchEvent(updateRecordLookupFilterEvent);
    }

    /**
     * handle event when deleting the filter
     * @param {Object} event the delete filter event
     */
    handleDeleteFilter(event) {
        event.stopPropagation();
        const deleteRecordLookupFilterEvent = new DeleteRecordLookupFilterEvent(event.detail.index);
        this.dispatchEvent(deleteRecordLookupFilterEvent);
    }
}