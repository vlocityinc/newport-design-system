import { LightningElement, api, track } from 'lwc';
import { LABELS } from './sortOptionItemLabels';
import { UpdateSortOptionItemEvent } from 'builder_platform_interaction/events';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { SORT_ORDER } from 'builder_platform_interaction/sortEditorLib';
import { format } from 'builder_platform_interaction/commonUtils';

const SORT_ORDER_OPTIONS = [
    {
        label: LABELS.sortOrderAscending,
        value: SORT_ORDER.ASC
    },
    {
        label: LABELS.sortOrderDescending,
        value: SORT_ORDER.DESC
    }
];
/**
 * a combobox to retrieve a list of fields.
 */
export default class SortOptionItem extends LightningElement {
    @api
    isSobject = false;

    @api
    optionIndex = 0;

    @api
    errorMessage = '';

    @api
    sortField = '';

    @api
    nullsLast = false;

    @api
    showDelete = false;

    /**
     * the value of the sort order dropdown.
     */
    @api
    sortOrder = '';

    @track
    loadingFields = false;

    @track
    menuDataFields;

    _recordEntityName;
    _entityFields;

    labels = LABELS;
    /**
     * @param name the record entity name
     */
    set recordEntityName(name: string) {
        if (!this._entityFields && this._recordEntityName !== name) {
            this._recordEntityName = name;
            this._entityFields = {};
            this.setupFields();
            this.loadingFields = true;
            sobjectLib
                .fetchFieldsForEntity(name)
                .then((fields) => {
                    this.loadingFields = false;
                    this._entityFields = fields;
                    this.setupFields();
                })
                .catch(() => {
                    this.loadingFields = false;
                });
        }
    }

    @api
    get recordEntityName() {
        return this._recordEntityName;
    }

    /**
     * get the sortable fields of the selected entity
     */
    setupFields() {
        if (!this._entityFields) {
            return;
        }
        this.menuDataFields = Object.keys(this._entityFields)
            .filter((field) => {
                return this._entityFields[field].sortable;
            })
            .reduce((menuData, fieldName) => {
                menuData[fieldName] = this._entityFields[fieldName];
                return menuData;
            }, {});
    }

    get sortOrderOptions() {
        return SORT_ORDER_OPTIONS;
    }

    get nullsFirst() {
        return !this.nullsLast;
    }

    get itemPrefix() {
        return format(this.labels.sortPrefix, this.optionIndex + 1);
    }

    /**
     * handle field changed
     * @param event the comboboxstatechanged event
     */
    handleFieldChanged(event: CustomEvent) {
        event.stopPropagation();
        // dispatch event with the selected field
        this.dispatchUpdateSortOptionEvent('sortField', this.optionIndex, event.detail.displayText, event.detail.error);
    }

    /**
     * handle sort order changed
     * @param event the combobox changed event
     */
    handleSortOrderChanged(event: CustomEvent) {
        event.stopPropagation();
        this.dispatchUpdateSortOptionEvent('sortOrder', this.optionIndex, event.detail.value, event.detail.error);
    }

    /**
     * handle allow null values on top checkbox
     * @param event the checkbox event
     */
    handleNullsFirstPropertyChange(event: CustomEvent) {
        event.stopPropagation();
        this.dispatchUpdateSortOptionEvent('nullsLast', this.optionIndex, !event.detail.checked, event.detail.error);
    }

    dispatchUpdateSortOptionEvent(propertyName: string, optionIndex: number, value: any, error: string) {
        this.dispatchEvent(new UpdateSortOptionItemEvent(propertyName, optionIndex, value, error ? error : null));
    }
}
