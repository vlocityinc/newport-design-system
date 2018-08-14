import { LightningElement, api, track } from "lwc";
import { LABELS } from './record-query-fields-labels';
import {
    AddRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
} from 'builder_platform_interaction-events';
import { format } from 'builder_platform_interaction-common-utils';

export default class RecordQueryFields extends LightningElement {
    labels = LABELS;

    @track
    state = {
        recordEntityName: '',
        outputReference: '',
        queriedFields: [],
        isCollection: false,
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
     * @param {Boolean} isCollection true if select from sObject collection variables
     */
    set isCollection(isCollection) {
        this.state.isCollection = isCollection;
    }

    @api
    get isCollection() {
        return this.state.isCollection;
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

    get sObjectVariablePickerTitle() {
        return !this.state.isCollection ? format(this.labels.selectVariableToStore, this.resourceDisplayText) : format(this.labels.selectVariableToStoreRecords, this.resourceDisplayText);
    }

    get sObjectVariablePickerLabel() {
        return !this.isCollection ? this.labels.recordVariable : this.labels.recordCollectionVariable;
    }

    get sObjectVariablePickerPlaceholder() {
        return !this.state.isCollection ? this.labels.sObjectVariablePlaceholder : this.labels.sObjectCollectionVariablePlaceholder;
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
        return {type : 'option-inline', text: 'ID', value: 'Id', displayText: 'ID'};
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
        const updateFieldEvent = new UpdateRecordLookupFieldEvent(event.detail.index, event.detail.value, event.detail.error);
        this.dispatchEvent(updateFieldEvent);
    }

    /**
     * handle event when deleting the field
     * @param {Object} event the delete field event
     */
    handleDeleteField(event) {
        event.stopPropagation();
        const deleteFieldEvent = new DeleteRecordLookupFieldEvent(event.detail.index);
        this.dispatchEvent(deleteFieldEvent);
    }
}