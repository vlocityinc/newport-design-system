import { LightningElement, api, track } from 'lwc';
import { LABELS } from './recordInputOutputAssignmentsLabels';
import {
    AddRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { sanitizeGuid } from "builder_platform_interaction/dataMutationLib";

export default class RecordInputOutputAssignments extends LightningElement {
    labels = LABELS;

    @api
    inputOutputAssignmentsItems = [];

    @track
    entityName = '';

    @api
    elementType;

    @api
    resourceDisplayText = '';

    @api
    title = '';

    @api
    recordFields;

    @api
    rhsLabel = '';

    @api
    readOnlyFields = false;

    /**
     * @param {Object[]} rules  Rules to use when fetching menudata
     */
    @api
    rules;

    /**
     * @param {String} entityName - the selected record object
     */
    set recordEntityName(entityName) {
        this.entityName = entityName;
    }

    @api
    get recordEntityName() {
        return this.entityName;
    }

    get showDelete() {
        return this.inputOutputAssignmentsItems.length > 1;
    }

    /**
     * Create an array containing the fields. Fields already selected in other input/output assignment item should not be included
     *  as well as the readOnly is the parameter this.readOnlyFields is true.
     */
    get inputOutputAssignmentItemsWithLhsFields() {
        // Exclude Fields
        const excludedFields = [];
        const _inputOutputAssignmentsItems = [];
        // In the inputOutputAssignmentsItems the left hand side value is formed like "entityName.FieldApiName"
        this.inputOutputAssignmentsItems.forEach(item => {
            if (item.leftHandSide.value && item.leftHandSide.value !== '') {
                excludedFields.push(sanitizeGuid(item.leftHandSide.value).fieldName);
            }
        });

        this.inputOutputAssignmentsItems.forEach((item) => {
            const itemApiName = sanitizeGuid(item.leftHandSide.value).fieldName;
            const fields = this.recordFields && Object.values(this.recordFields);
            const entityFilteredFields = [];
            fields.forEach(field => {
                // The field list Should not contains the already selected field
                if (this.includeField(excludedFields, field.apiName, itemApiName, field.sobjectName, field.readOnly)) {
                    entityFilteredFields[field.apiName] = field;
                }
            });

            // Copy the item
            const tmpItemWithField = {};
            tmpItemWithField.data = item;

            // add the field list related to the item
            tmpItemWithField.fields = entityFilteredFields;

            _inputOutputAssignmentsItems.push(tmpItemWithField);
        });
        return _inputOutputAssignmentsItems;
    }

    /**
     * Field to include in the list :
     * If this.readOnlyFields is true then only field editable should be added to the list.
     * if a field has already been select then it should not be possible to select it again.
     */
    includeField(excludedFields, fieldApiName, itemApiName, itemSobjectName, isFieldReadOnly) {
        const isFieldPartOfExcludedList  = !excludedFields.includes(fieldApiName) || fieldApiName === itemApiName;
        const isReadOnlyField = !this.readOnlyFields || !isFieldReadOnly;
        return isFieldPartOfExcludedList && isReadOnlyField;
    }

    /**
     * handle event when adding the new assignment
     * @param {Object} event the add assignment event
     */
    handleAddAssignment(event) {
        event.stopPropagation();
        const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
        this.dispatchEvent(addRecordFieldAssignmentEvent);
    }

    /**
     * handle event when updating the assignment
     * @param {Object} event the update assignment event
     */
    handleUpdateAssignment(event) {
        event.stopPropagation();
        const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(event.detail.index, event.detail.value, event.detail.error);
        this.dispatchEvent(updateRecordFieldAssignmentEvent);
    }

    /**
     * handle event when deleting the assignment
     * @param {Object} event the delete assignment event
     */
    handleDeleteAssignment(event) {
        event.stopPropagation();
        const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(event.detail.index);
        this.dispatchEvent(deleteRecordFieldAssignmentEvent);
    }
}