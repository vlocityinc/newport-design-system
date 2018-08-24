import { LightningElement, api, track } from 'lwc';
import { LABELS } from './record-sort-labels';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { SORT_ORDER } from 'builder_platform_interaction-record-editor-lib';
import { format } from 'builder_platform_interaction-common-utils';

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
    state = {
        showFieldSelector : false,
        selectedSortOrder : '',
        selectedField : '',
        fieldsOptions : [],
        sortFieldErrorMessage: ''
    };

    @api
    resourceDisplayText = '';

    /**
     * Fields of the SObject
     * This object should come form sobject-lib#getFieldsForEntity
     * @param {Object} value fields
     */
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
     * @param {string} value    This value can be : "NotSorted", "Asc", "Desc"
     */
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

    @api
    get sortFieldError() {
        return this.state.sortFieldErrorMessage;
    }

    set sortFieldError(errorMessage) {
        this.state.sortFieldErrorMessage = errorMessage;
        const lightningCombobox = this.template.querySelector('.sortField');
        if (lightningCombobox) {
            lightningCombobox.setCustomValidity(this.state.sortFieldErrorMessage);
            lightningCombobox.showHelpMessageIfInvalid();
        }
    }

    @api
    get headerText() {
        return format(this.labels.sortTabHeader, this.resourceDisplayText);
    }

    getFields(resourceApiName) {
        getFieldsForEntity(resourceApiName, (fields) => {
            if (fields) {
                this.state.fieldsOptions = Object.values(fields).filter(field => field.sortable).map((field) => {
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