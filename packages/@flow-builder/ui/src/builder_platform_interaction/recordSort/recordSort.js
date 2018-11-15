import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./recordSortLabels";
import { fetchFieldsForEntity } from "builder_platform_interaction/sobjectLib";
import { SORT_ORDER } from "builder_platform_interaction/recordEditorLib";
import { format } from "builder_platform_interaction/commonUtils";

const NOT_SORTED_VALUE = SORT_ORDER.NOT_SORTED;

const SORT_ORDER_OPTIONS = [{
    label : LABELS.sortOrderAscendingLabel,
    value : SORT_ORDER.ASC
}, {
    label : LABELS.sortOrderDescendingLabel,
    value : SORT_ORDER.DESC
}, {
    label : LABELS.sortOrderNotSortedLabel,
    value : NOT_SORTED_VALUE
}];

export default class RecordSort extends LightningElement {
    labels = LABELS;

    _resourceApiName;

    @track
    fields = {};

    @track
    loadingFields = false;

    @api
    resourceDisplayText = '';

    /**
     * Fields of the SObject
     * This object should come form sobject-lib#getFieldsForEntity
     * @param {Object} value fields
     */
    set resourceApiName(value) {
        this._resourceApiName = value;
        if (value) {
            this.getFields(value);
        }
    }

    @api
    get resourceApiName() {
        return this._resourceApiName;
    }

    /**
     * the value of the order sort dropdown.
     * @param {string} value    This value can be : "NotSorted", "Asc", "Desc"
     */
    @api
    sortOrder;

    /**
     * the apiName of the selected field
     * @param {string} value    ex: Id
     */
    @api
    selectedField;

    get sortOrderOptions() {
        return SORT_ORDER_OPTIONS;
    }

    @api
    sortFieldError;

    get headerText() {
        return format(this.labels.sortTabHeader, this.resourceDisplayText);
    }

    get showFieldSelector() {
        return this.sortOrder !== NOT_SORTED_VALUE;
    }

    getFields(resourceApiName) {
        this.loadingFields = true;
        this.fields = {};
        fetchFieldsForEntity(resourceApiName).then((fields) => {
            this.loadingFields = false;
            this.fields = this.getSortableFields(fields);
        }).catch(() => {
            this.loadingFields = false;
        });
    }

    getSortableFields(fields) {
        return Object.values(fields)
            .filter((field) => field.sortable)
            .reduce((options, field) => {
                options[field.apiName] = field;
                return options;
            }, {});
    }

    handleSortOrderChanged(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('change', {detail: {sortOrder: event.detail.value, fieldApiName : this.selectedField}}));
    }

    handleSelectedFieldChanged(event) {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent('change', {detail: {sortOrder: this.sortOrder, fieldApiName : event.detail.displayText, error: event.detail.error}}));
    }
}