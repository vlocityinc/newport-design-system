import { LightningElement, api, track } from 'lwc';
import { LABELS } from './recordInputOutputAssignmentsLabels';
import {
    AddRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { sanitizeGuid } from "builder_platform_interaction/dataMutationLib";
import { getOutputRules, getRulesForElementType, RULE_TYPES } from "builder_platform_interaction/ruleLib";

export default class RecordInputOutputAssignments extends LightningElement {
    labels = LABELS;

    @api
    titleCss = 'slds-text-heading_small slds-p-around_small';

    @api
    topDivCss = 'slds-m-bottom_small slds-border_top';

    @api
    listCss = 'slds-p-horizontal_small';

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
    subtitle = '';

    @api
    recordFields;

    @api
    rhsLabel = '';

    @api
    isOutput = false;

    @api
    hideNewResource = false;

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

    get rules() {
        if (this.isOutput) {
            return getOutputRules();
        }
        return getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementType);
    }

    get operatorIconName() {
        return this.isOutput ? 'utility:forward' : 'utility:back';
    }

    get showDelete() {
        return this.inputOutputAssignmentsItems.length > 1;
    }

    /**
     * Create an array containing the fields. Fields already selected in other input/output assignment item should not be included.
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
                if (this.includeField(excludedFields, field.apiName, itemApiName)) {
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
     * if a field has already been select then it should not be possible to select it again.
     */
    includeField(excludedFields, fieldApiName, itemApiName) {
        return !excludedFields.includes(fieldApiName) || fieldApiName === itemApiName;
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