import { assignmentValidation } from './assignment-validation';
import { updateProperties, set, deleteItem } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/**
 * assignment reducer function runs validation rules and returns back the updated element assignment
 * @param {object} assignment - element / node assignment
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} assignment - updated assignment
 */
export const assignmentReducer = (assignment, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.ADD_ASSIGNMENT_ITEM: {
            const emptyAssignmentItem = {rowIndex: generateGuid(SUB_ELEMENT_TYPE.ASSIGNMENT_ITEM) };

            // TODO do validation for if we should not add in case the length is upto certain limit
            const path = ['assignmentItems', assignment.assignmentItems.length];
            return set(assignment, path, emptyAssignmentItem);
        }
        case PROPERTY_EDITOR_ACTION.DELETE_ASSIGNMENT_ITEM: {
            // TODO do validation for if we need at least one row
            const updatedItems = deleteItem(assignment.assignmentItems, action.payload.index);
            return set(assignment, 'assignmentItems', updatedItems);
        }
        case PROPERTY_EDITOR_ACTION.UPDATE_ASSIGNMENT_ITEM: {
            const path = `assignmentItems[${action.payload.index}].${action.payload.propertyName}`;

            // TODO check for errors and handle validation accordingly
            const item = {value: action.payload.value, error: action.payload.error};
            return set(assignment, path, item);
        }
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            action.payload.error = action.payload.error === null ? assignmentValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
            return updateProperties(assignment, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
        default: return assignment;
    }
};
