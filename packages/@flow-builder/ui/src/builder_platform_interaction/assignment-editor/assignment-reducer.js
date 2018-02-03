import { assignmentValidation } from './assignment-validation';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';

/**
 * assignment reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propNmae, value , error}}
 * @returns {object} state - updated state
 */
export const assignmentReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_PROPERTY":
            action.payload.error = action.payload.error === null ? assignmentValidation.validateProperty(action.payload.propName, action.payload.value) : null;
            return updateProperties(state, {[action.payload.propName]: {error: action.payload.error, value: action.payload.newValue}});
        default: return state;
    }
};