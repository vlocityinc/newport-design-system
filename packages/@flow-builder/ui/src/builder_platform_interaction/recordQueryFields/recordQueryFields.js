import { LightningElement, api, track } from 'lwc';
import { LABELS } from './recordQueryFieldsLabels';
import {
    AddRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent
} from 'builder_platform_interaction/events';
import { format } from 'builder_platform_interaction/commonUtils';

export default class RecordQueryFields extends LightningElement {
    labels = LABELS;

    @track
    state = {
        recordEntityName: '',
        outputReference: '',
        queriedFields: []
    };

    /**
     * sObject variable error message if any
     */
    @api
    sobjectVariableErrorMessage;

    @api
    elementType;

    @api
    resourceDisplayText;

    @api
    globalCss =
        'slds-p-horizontal_small slds-form-element slds-size_1-of-2 slds-m-bottom_small';

    @api
    titleCss = 'slds-text-heading_small';

    /**
     * @param {String} entityName the selected entity name (from select object combobox)
     */
    set recordEntityName(entityName) {
        this.state.recordEntityName = entityName;
    }

    @api
    get recordEntityName() {
        return this.state.recordEntityName;
    }

    /**
     * @param {String} value the output reference (the selected sObject or sObject collection variable)
     */
    set outputReference(value) {
        this.state.outputReference = value;
    }

    @api
    get outputReference() {
        return this.state.outputReference;
    }

    /**
     * @param {String[]} fields the selected fields
     */
    set queriedFields(fields) {
        this.state.queriedFields = fields;
    }

    @api
    get queriedFields() {
        return this.state.queriedFields;
    }

    get selectFieldsLabel() {
        return format(this.labels.selectFields, this.resourceDisplayText);
    }
    /**
     * menu data for disabled Id combobox
     */
    get idMenuData() {
        return [this.idComboboxValue];
    }

    /**
     * Id value for Id combobox
     */
    get idComboboxValue() {
        return {
            type: 'option-inline',
            text: 'ID',
            value: 'Id',
            displayText: 'ID'
        };
    }

    /**
     * handle event when adding the new field
     * @param {Object} event the add field event
     */
    handleAddField(event) {
        event.stopPropagation();
        const addFieldEvent = new AddRecordLookupFieldEvent();
        this.dispatchEvent(addFieldEvent);
    }

    /**
     * handle event when updating the field
     * @param {Object} event the update field event
     */
    handleUpdateField(event) {
        event.stopPropagation();
        const updateFieldEvent = new UpdateRecordLookupFieldEvent(
            event.detail.index,
            event.detail.value,
            event.detail.error
        );
        this.dispatchEvent(updateFieldEvent);
    }

    /**
     * handle event when deleting the field
     * @param {Object} event the delete field event
     */
    handleDeleteField(event) {
        event.stopPropagation();
        const deleteFieldEvent = new DeleteRecordLookupFieldEvent(
            event.detail.index
        );
        this.dispatchEvent(deleteFieldEvent);
    }
}
