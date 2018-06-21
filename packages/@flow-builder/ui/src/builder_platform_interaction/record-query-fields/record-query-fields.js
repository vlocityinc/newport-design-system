import { Element, api, track } from "engine";
import { LABELS } from './record-query-fields-labels';
import {
    AddRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
} from 'builder_platform_interaction-events';

export default class RecordQueryFields extends Element {
    labels = LABELS;

    @track
    state = {
        recordEntityName: '',
        outputReference: '',
        queriedFields: [],
        isCollection: false,
    };

    @api
    elementType;

    /**
     * @param {String} entityName the selected entity name (from select object combobox)
     */
    @api
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
    @api
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
    @api
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
    @api
    set queriedFields(fields) {
        this.state.queriedFields = fields;
    }

    @api
    get queriedFields() {
        return this.state.queriedFields;
    }

    get sObjectVariablePickerLabel() {
        return !this.state.isCollection ? this.labels.sObjectVariable : this.labels.sObjectCollectionVariable;
    }

    get sObjectVariablePickerPlaceholder() {
        return !this.state.isCollection ? this.labels.sObjectVariablePlaceholder : this.labels.sObjectCollectionVariablePlaceholder;
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