import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { subflowValidation } from "./subflowValidation";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";

const subflowPropertyChanged = (state, action) => {
    action.payload.error = action.payload.error === null ? subflowValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
    return updateProperties(state, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
};

/**
 * Subflow reducer function runs validation rules and returns back the updated variable
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} state - updated state
 */
export const subflowReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return subflowPropertyChanged(state, action);
        case VALIDATE_ALL:
            return subflowValidation.validateAll(state);
        default: return state;
    }
};