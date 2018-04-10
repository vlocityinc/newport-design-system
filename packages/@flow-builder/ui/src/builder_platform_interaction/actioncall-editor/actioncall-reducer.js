import { actionCallValidation } from './actioncall-validation';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
/**
 * actionCall reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} state - updated state
 */
export const actionCallReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            action.payload.error = action.payload.error === null ? actionCallValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
            return updateProperties(state, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
        default: return state;
    }
};