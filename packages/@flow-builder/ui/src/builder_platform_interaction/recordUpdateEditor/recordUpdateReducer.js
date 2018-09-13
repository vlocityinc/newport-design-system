import { recordUpdateValidation } from "./recordUpdateValidation";
import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";


const propertyChanged = (state, action) => {
    action.payload.error = action.payload.error === null ? recordUpdateValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
    return updateProperties(state, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
};

/**
 * Record update reducer function runs validation rules and returns back the updated element state
 * or update a property based on action type from second argument
 * @param {object} state - element / node state
 * @param {object} action - The event to be handled
 * @returns {object} state - updated state
 */
export const recordUpdateReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return propertyChanged(state, action);
        case VALIDATE_ALL:
            return recordUpdateValidation.validateAll(state);
        default:
            return state;
    }
};