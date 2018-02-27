import { assignmentValidation } from './assignment-validation';
import { updateProperties, set, deleteItem } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-constant';
/**
 * assignment reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} state - updated state
 */
export const assignmentReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            action.payload.error = action.payload.error === null ? assignmentValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
            return updateProperties(state, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
        case PROPERTY_EDITOR_ACTION.ADD_LIST_ITEM: {
            // TODO do validation for if we should not add in case the length is upto certain limit
            const path = `[${action.payload.index}]`;
            return set(state, path, action.payload.item);
        }
        case PROPERTY_EDITOR_ACTION.DELETE_LIST_ITEM:
            // TODO do validation for if we need at least one row
            return deleteItem(state, action.payload.index);
        case PROPERTY_EDITOR_ACTION.UPDATE_LIST_ITEM: {
            const path = `[${action.payload.index}].${action.payload.propertyName}`;
            // TODO check for errors and handle validation accordingly
            const item = {value: action.payload.value, error: action.payload.error};
            return set(state, path, item);
        }
        default: return state;
    }
};