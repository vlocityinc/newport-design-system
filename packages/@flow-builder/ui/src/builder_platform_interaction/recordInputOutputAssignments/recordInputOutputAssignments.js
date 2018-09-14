import { LightningElement, api, track } from 'lwc';
import { LABELS } from './recordInputOutputAssignmentsLabels';
import {
    AddRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';

export default class RecordInputOutputAssignments extends LightningElement {
    labels = LABELS;

    @api
    inputOutputAssignmentsItems = [];

    @track entityFields = [];

    @track entityName = '';

    @api
    elementType;

    @api
    resourceDisplayText = '';

    @api
    title = '';

    @api
    rhsLabel = '';

    /**
     * The assignment items
     * @param {Object} value - it comes from the recordNode.inputAssignments or recordNode.outputAssignments
     */
    set assignmentItems(value) {
        this.items = value;
    }

    @api
    get assignmentItems() {
        return this.items;
    }

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

    /**
     * @param {Object} fields - fields will be displayed on the Left hand Side
     */
    set recordFields(fields) {
        if (fields) {
            this.entityFields = fields;
        }
    }

    @api
    get recordFields() {
        return this.entityFields;
    }

    get showDelete() {
        return this.inputOutputAssignmentsItems.length > 1;
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