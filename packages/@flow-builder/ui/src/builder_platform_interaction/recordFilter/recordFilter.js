import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS, CRITERIA_RECORDS_LABELS, WARNING_LABELS, NO_CRITERIA_LABELS } from "./recordFilterLabels";
import { RECORD_FILTER_CRITERIA } from "builder_platform_interaction/recordEditorLib";
import { format } from "builder_platform_interaction/commonUtils";
import { getRulesForElementType, RULE_TYPES } from "builder_platform_interaction/ruleLib";
import {
    AddRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    RecordLookupFilterTypeChangedEvent
} from "builder_platform_interaction/events";

export default class RecordFilter extends LightningElement {
    labels = LABELS;

    @track
    selectedFilter = RECORD_FILTER_CRITERIA.NONE;

    @track items = [];

    @track entityFields = [];

    @track entityName = '';

    @api
    elementType;

    @track
    rules = getRulesForElementType(RULE_TYPES.COMPARISON, this.elementType);

    @api
    resourceDisplayText = '';
    /**
     * The filter type to pass as value of the rule for finding record drop down
     * @param {String} value - it's RECORD_FILTER_CRITERIA.NONE or RECORD_FILTER_CRITERIA.ALL
     */
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
    set recordFields(fields) {
        if (fields) {
            this.entityFields = {};
            const filterableFields = Object.values(fields).filter(field => field.filterable);
            filterableFields.forEach(filterableField => {
                this.entityFields[filterableField.apiName] = filterableField;
            });
        }
    }

    @api
    get recordFields() {
        return this.entityFields;
    }

    get showDeleteFilter() {
        return this.filterItems.length > 1;
    }

    get filterOptions() {
        const FILTER_TYPE_OPTIONS = [{
            label : format(NO_CRITERIA_LABELS[this.elementType], this.resourceDisplayText),
            value : RECORD_FILTER_CRITERIA.NONE
        }, {
            label : LABELS.filterAllCriterias,
            value : RECORD_FILTER_CRITERIA.ALL
        }];
        return FILTER_TYPE_OPTIONS;
    }

    get showFilterList() {
        return this.selectedFilter === RECORD_FILTER_CRITERIA.ALL;
    }

    get filterLabel() {
        return CRITERIA_RECORDS_LABELS[this.elementType];
    }

    get warningLabel() {
        return WARNING_LABELS[this.elementType];
    }

    get showWarningMessage() {
        return (this.elementType === ELEMENT_TYPE.RECORD_UPDATE || this.elementType === ELEMENT_TYPE.RECORD_DELETE) && this.selectedFilter === RECORD_FILTER_CRITERIA.NONE;
    }

    get filterRecordsTitle() {
        return format(this.labels.findRecords, this.resourceDisplayText);
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
