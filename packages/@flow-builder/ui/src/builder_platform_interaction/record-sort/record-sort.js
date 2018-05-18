import { Element, api, track } from 'engine';
import { LABELS } from './record-sort-labels';

const DEFAULT_VALUE = 'Default';

const SORT_ORDER_OPTIONS = [{
    label : LABELS.sortOrderDefaultLabel,
    value : DEFAULT_VALUE
}, {
    label : LABELS.sortOrderAscendingLabel,
    value : 'Asc'
}, {
    label : LABELS.sortOrderDescendingLabel,
    value : 'Desc'
}];

export default class RecordSort extends Element {
    labels = LABELS;

    fields = [];

    @track
    state = {
        showFieldSelector : false,
        selectedSortOrder : DEFAULT_VALUE,
        selectedField : '',
        fieldsOptions : []
    };

    /**
     * Fields of the SObject
     * This object should come form sobject-lib#getFieldsForEntity
     * @param {Object} value fields
     */
    @api
    set recordFields(value) {
        this.fields = value;
        this.state.fieldsOptions = value ? Object.values(value).map((field) => {
            return { label: field.apiName, value: field.apiName };
        }) : [];
    }

    @api
    get recordFields() {
        return this.fields;
    }

    /**
     * the value of the order sort dropdown.
     * @param {string} value    This value can be : "Default", "Asc", "Desc"
     */
    @api
    set sortOrder(value) {
        this.state.selectedSortOrder = value;
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

    handleSortOrderChanged(event) {
        event.stopPropagation();
        this.state.selectedSortOrder = event.detail.value;
        this.state.showFieldSelector = event.detail.value !== DEFAULT_VALUE;
        this.dispatchEvent(new CustomEvent('change', {detail: {sortOrder: this.state.selectedSortOrder, fieldApiName : this.state.selectedField}}));
    }

    handleSelectedFieldChanged(event) {
        event.stopPropagation();
        this.state.selectedField = event.detail.value;
        this.dispatchEvent(new CustomEvent('change', {detail: {sortOrder: this.state.selectedSortOrder, fieldApiName : this.state.selectedField}}));
    }
}