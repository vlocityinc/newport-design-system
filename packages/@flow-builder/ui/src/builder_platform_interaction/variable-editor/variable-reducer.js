import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';

/**
 * Variable reducer function runs validation rules and returns back the updated variable
 * @param {object} variable - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} variable - updated variable
 */
export const variableReducer = (variable, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            // TODO: validation W-4900878
            return updateProperties(variable, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
        default: return variable;
    }
};