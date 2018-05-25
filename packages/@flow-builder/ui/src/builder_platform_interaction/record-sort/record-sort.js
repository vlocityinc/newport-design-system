import { Element, api, track } from 'engine';
import { LABELS } from './record-sort-labels';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';

const NOT_SORTED_VALUE = 'NotSorted';
const FIELD_NAME_VALUE = 'Name';

const SORT_ORDER_OPTIONS = [{
    label : LABELS.sortOrderAscendingLabel,
    value : 'Asc'
}, {
    label : LABELS.sortOrderDescendingLabel,
    value : 'Desc'
}, {
    label : LABELS.sortOrderNotSortedLabel,
    value : NOT_SORTED_VALUE
}];

export default class RecordSort extends Element {
    labels = LABELS;

    _resourceApiName;

    @track
    state = {
        showFieldSelector : true,
        selectedSortOrder : 'Asc',
        selectedField : FIELD_NAME_VALUE,
        fieldsOptions : []
    };

    /**
     * Fields of the SObject
     * This object should come form sobject-lib#getFieldsForEntity
     * @param {Object} value fields
     */
    @api
    set resourceApiName(value) {
        this._resourceApiName = value;
        if (value && value !== '') {
            this.getFields(value);
        }
    }

    @api
    get resourceApiName() {
        return this._resourceApiName;
    }

    /**
     * the value of the order sort dropdown.
     * @param {string} value    This value can be : "Default", "Asc", "Desc"
     */
    @api
    set sortOrder(value) {
        this.state.selectedSortOrder = value;
        this.state.showFieldSelector = value !== NOT_SORTED_VALUE;
    }

    @api
    get sortOrder() {
        return this.state.selectedSortOrder;
    }

    /**
     * the apiName of the selected field
     * @param {string} value    ex: Id
     */
    @api
    set selectedField(value) {
        this.state.selectedField = value;
    }

    @api
    get selectedField() {
        return this.state.selectedField;
    }

    @api
    get sortOrderOptions() {
        return SORT_ORDER_OPTIONS;
    }

    getFields(resourceApiName) {
        getFieldsForEntity(resourceApiName, (fields) => {
            if (fields) {
                this.state.fieldsOptions = Object.values(fields).map((field) => {
                    return { label: field.apiName, value: field.apiName };
                });
            } else {
                this.state.fieldsOptions = [];
            }
        });
    }

    handleSortOrderChanged(event) {
        event.stopPropagation();
        this.state.selectedSortOrder = event.detail.value;
        this.state.showFieldSelector = event.detail.value !== NOT_SORTED_VALUE;
        this.dispatchEvent(new CustomEvent('change', {detail: {sortOrder: this.state.selectedSortOrder, fieldApiName : this.state.selectedField}}));
    }

    handleSelectedFieldChanged(event) {
        event.stopPropagation();
        this.state.selectedField = event.detail.value;
        this.dispatchEvent(new CustomEvent('change', {detail: {sortOrder: this.state.selectedSortOrder, fieldApiName : this.state.selectedField}}));
    }
}