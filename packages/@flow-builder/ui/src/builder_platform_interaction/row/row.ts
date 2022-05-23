// @ts-nocheck
import deleteRowAlternativeText from '@salesforce/label/FlowBuilderRows.deleteRowAlternativeText';
import editRowAlternativeText from '@salesforce/label/FlowBuilderRows.editRowAlternativeText';
import { DeleteListItemEvent, EditListItemEvent, UpdateListItemEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';

/**
 * Assignment Item List Row component for flow builder.
 */
export default class Row extends LightningElement {
    @api itemIndex;
    @api itemPrefix;
    @api showPrefix;
    @api showDelete;
    @api isVertical;

    _isDeletable = true;
    _isEditable = false;
    _enableEdit = true;

    /**
     * @returns {boolean} Whether to show the delete button
     */
    @api
    get isDeletable() {
        return this._isDeletable;
    }

    set isDeletable(isDeletable) {
        this._isDeletable = isDeletable;
    }

    /**
     * @returns {boolean} Whether to show the edit button
     */
    @api
    get isEditable() {
        return this._isEditable;
    }

    set isEditable(isEditable) {
        this._isEditable = isEditable;
    }

    /**
     * @returns {boolean} Whether the template will show ONLY the delete button because this is not editable
     */
    get isDeletableOnly() {
        return this._isDeletable && !this._isEditable;
    }

    /**
     * @returns {boolean} Whether the template will show the delete and edit buttons
     */
    get isDeletableAndEditable() {
        return this._isDeletable && this._isEditable;
    }

    /**
     * @returns {boolean} Whether the delete button should be disabled
     */
    get isDeleteDisabled() {
        return !this.showDelete;
    }

    /**
     * @returns {boolean} Whether the edit button should be enabled
     */
    @api
    get enableEdit() {
        return this._enableEdit;
    }

    /**
     * @param enableOrData Use either the boolean flag of enable or send the required data to enable
     */
    set enableEdit(enableOrData) {
        this._enableEdit = !!enableOrData;
    }

    get isEditDisabled() {
        return !this.enableEdit;
    }

    get deleteAlternativeText() {
        return deleteRowAlternativeText;
    }

    get editRowAlternativeText() {
        return editRowAlternativeText;
    }

    get rowContentsClass() {
        let contentsClass =
            'slds-grid slds-grid_horizontal slds-grid_vertical-align-start slds-gutters slds-gutters_xx-small';
        if (this.showPrefix) {
            contentsClass = 'slds-m-left_x-large ' + contentsClass;
        }
        return contentsClass;
    }

    get rowClass() {
        return this.isVertical
            ? 'slds-is-absolute row-vertical'
            : 'slds-is-absolute slds-p-top_large slds-m-top_xx-small';
    }

    handleRowContentsChanged(event) {
        const index = this.itemIndex;
        const value = event.detail.newValue;
        const itemUpdatedEvent = new UpdateListItemEvent(index, value);
        this.dispatchEvent(itemUpdatedEvent);
    }

    handleDelete(event) {
        event.stopPropagation();
        const itemDeletedEvent = new DeleteListItemEvent(this.itemIndex);
        this.dispatchEvent(itemDeletedEvent);
    }

    handleEdit(event) {
        event.stopPropagation();
        const itemEditedEvent = new EditListItemEvent(this.itemIndex);
        this.dispatchEvent(itemEditedEvent);
    }
}
