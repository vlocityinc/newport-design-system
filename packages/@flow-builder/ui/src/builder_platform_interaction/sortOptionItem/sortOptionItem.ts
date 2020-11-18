import { LightningElement, api, track } from 'lwc';
import { LABELS } from './sortOptionItemLabels';
import { UpdateSortOptionItemEvent } from 'builder_platform_interaction/events';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import {
    SORT_ORDER,
    SObjectOrApexReference,
    isSObjectOrApexClass,
    APEX_SORT_COMPATIBLE_TYPES
} from 'builder_platform_interaction/sortEditorLib';
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
    optionIndex = 0;

    @api
    errorMessage = '';

    @api
    sortField = '';

    @api
    doesPutEmptyStringAndNullFirst = false;

    @api
    showDelete = false;

    @api
    queriedFields;

    /**
     * the value of the sort order dropdown.
     */
    @api
    sortOrder = '';

    @track
    loadingFields = false;

    @track
    menuDataFields = {};

    /**
     * list of the selected fields, to avoid duplicated fields.
     */
    @track
    _selectedFields: string[] = [];

    _sObjectOrApexReference: SObjectOrApexReference = { value: null };
    _fields;

    labels = LABELS;

    /**
     * @param ref sobject or apex class reference
     */
    set sobjectOrApexReference(ref: SObjectOrApexReference) {
        this._sObjectOrApexReference = ref;
    }

    @api
    get sobjectOrApexReference(): SObjectOrApexReference {
        return this._sObjectOrApexReference;
    }

    /**
     * @param ref sobject or apex class reference
     */
    set selectedFields(fields: string[]) {
        this._selectedFields = fields || [];
        this.setupFields();
    }

    @api
    get selectedFields() {
        return this._selectedFields;
    }

    connectedCallback() {
        if (this._sObjectOrApexReference && this._sObjectOrApexReference.value) {
            this._fields = {};
            this.loadingFields = true;
            if (this._sObjectOrApexReference.isSObject) {
                // load sobject's fields
                sobjectLib
                    .fetchFieldsForEntity(this._sObjectOrApexReference.value)
                    .then((fields) => {
                        this.loadingFields = false;
                        this._fields = fields;
                        this.setupFields();
                    })
                    .catch(() => {
                        this.loadingFields = false;
                    });
            } else if (this._sObjectOrApexReference.isApexClass) {
                // load apex attributes that can be sortable
                this._fields = apexTypeLib.getPropertiesForClass(this._sObjectOrApexReference.value);
                this.setupFields();
                this.loadingFields = false;
            }
        }
    }

    get isSObjectOrApexClass() {
        return isSObjectOrApexClass(this._sObjectOrApexReference);
    }

    /**
     * get the sortable fields of the selected entity
     */
    setupFields() {
        if (!this._fields) {
            return;
        }
        this.menuDataFields = Object.keys(this._fields)
            .filter((field) => this.isSortableField(field))
            .reduce((menuData, fieldName) => {
                menuData[fieldName] = this._fields[fieldName];
                return menuData;
            }, {});
    }

    isSortableField(field) {
        // check if field is duplicated
        if (field !== this.sortField && this._selectedFields.includes(field)) {
            return false;
        }
        let isSortable = false;
        if (this._sObjectOrApexReference.isSObject) {
            // entity's fields
            isSortable = this._fields[field].sortable;
            isSortable = this.queriedFields
                ? isSortable && this.queriedFields.findIndex((queriedField) => queriedField.field === field) !== -1
                : isSortable;
        } else if (this._sObjectOrApexReference.isApexClass) {
            // apex properties
            isSortable =
                !this._fields[field].isCollection && APEX_SORT_COMPATIBLE_TYPES.includes(this._fields[field].dataType);
        }
        return isSortable;
    }

    get sortOrderOptions() {
        return SORT_ORDER_OPTIONS;
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
        this.dispatchUpdateSortOptionEvent(
            'doesPutEmptyStringAndNullFirst',
            this.optionIndex,
            event.detail.checked,
            event.detail.error
        );
    }

    dispatchUpdateSortOptionEvent(propertyName: string, optionIndex: number, value: any, error: string) {
        this.dispatchEvent(new UpdateSortOptionItemEvent(propertyName, optionIndex, value, error ? error : null));
    }
}
