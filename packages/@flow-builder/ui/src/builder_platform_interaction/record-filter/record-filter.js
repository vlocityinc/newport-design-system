import { Element, api, track } from "engine";
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { LABELS, CRITERIA_RECORDS_LABELS, WARNING_LABELS } from './record-filter-labels';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction-record-editor-lib';
import { format } from 'builder_platform_interaction-common-utils';
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

    @api
    resourceDisplayText;
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
     * @param {Object} fields - Filterable fields of the entity
     */
    @api
    set recordFields(fields) {
        this.entityFields = {};
        const filterableFields = Object.values(fields).filter(field => field.filterable);
        filterableFields.forEach(filterableField => {
            this.entityFields[filterableField.apiName] = filterableField;
        });
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

    get showFilterList() {
        return this.selectedFilter === RECORD_FILTER_CRITERIA.ALL;
    }

    get filterLabel() {
        return CRITERIA_RECORDS_LABELS[this.elementType];
    }

    get warningMessage() {
        return format(WARNING_LABELS[this.elementType], this.resourceDisplayText);
    }

    get showWarningMessage() {
        return (this.elementType === ELEMENT_TYPE.RECORD_UPDATE || this.elementType === ELEMENT_TYPE.RECORD_DELETE) && this.selectedFilter === RECORD_FILTER_CRITERIA.NONE;
    }

    get filterRecordsTitle() {
        return format(this.labels.findRecords, this.resourceDisplayText);
    }

    get filterItemsWithPrefixes() {
        return this.filterItems.map((filter, i) => {
            return {
                prefix: this.getPrefix(i),
                filter
            };
        });
    }

    getPrefix(index) {
        return index > 0 ? this.labels.conditionAnd : '';
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