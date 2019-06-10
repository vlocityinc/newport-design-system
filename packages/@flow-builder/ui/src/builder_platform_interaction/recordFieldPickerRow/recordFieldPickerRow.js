import { LightningElement, api, track } from 'lwc';
import { LABELS } from './recordFieldPickerRowLabels';
import { UpdateRecordLookupFieldEvent } from 'builder_platform_interaction/events';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';

const ID_FIELD = 'Id';

/**
 * a combobox to retrieve a list of deduped fields to prevent selection of the same field twice.
 */
export default class RecordFieldPickerRow extends LightningElement {
    labels = LABELS;

    @api
    fieldIndex;

    @api
    errorMessage;

    @api
    value;

    _recordEntityName;
    _queriedFields = [ID_FIELD];
    _entityFields;

    /**
     * @param {String} value the record entity name
     */
    set recordEntityName(name) {
        if (!this._entityFields && this._recordEntityName !== name) {
            this._recordEntityName = name;
            this._entityFields = {};
            this.setupMenuDataFields();
            sobjectLib
                .fetchFieldsForEntity(name)
                .then(fields => {
                    this._entityFields = fields;
                    this.setupMenuDataFields();
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    @api
    get recordEntityName() {
        return this._recordEntityName;
    }

    /**
     * @param {String[]} fields the queriedFields from recordNode.queriedFields
     */
    set queriedFields(fields) {
        if (!fields) {
            return;
        }
        this._queriedFields = fields.map(field => {
            return field.field.value;
        });

        if (!this._queriedFields.includes(ID_FIELD)) {
            this._queriedFields.push(ID_FIELD);
        }

        this.setupMenuDataFields();
    }

    @api
    get queriedFields() {
        return this._queriedFields;
    }

    setupMenuDataFields() {
        if (!this._entityFields) {
            return;
        }

        this.menuDataFields = Object.keys(this._entityFields)
            .filter(field => {
                return (
                    field === this.value || !this.queriedFields.includes(field)
                );
            })
            .reduce((menuData, fieldName) => {
                menuData[fieldName] = this._entityFields[fieldName];
                return menuData;
            }, {});
    }

    @track
    menuDataFields;

    get isIdField() {
        return this.value === ID_FIELD;
    }

    /**
     * TODO: should be always true when W-4822361 is implemented
     */
    get showDelete() {
        return this._queriedFields && this._queriedFields.length > 2;
    }

    /**
     * handle field changed
     * @param {Object} event the comboboxstatechanged event
     */
    handleFieldChanged(event) {
        event.stopPropagation();
        const updateFieldEvent = new UpdateRecordLookupFieldEvent(
            this.fieldIndex,
            event.detail.item
                ? event.detail.item.value
                : event.detail.displayText,
            event.detail.error
        );
        this.dispatchEvent(updateFieldEvent);
    }
}
