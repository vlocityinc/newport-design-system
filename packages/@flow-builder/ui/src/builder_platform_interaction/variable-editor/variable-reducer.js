import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { variableValidation } from './variable-validation';

const dataTypeChanged = (state, action) => {
    if (typeof action.payload.value.scale !== 'number') {
        action.payload.value.scale = 2;
    }
    const value = action.payload.value;
    const dataType = value.dataType;
    const updatedValues = {
        dataType : { error: null, value: dataType },
        scale: value.scale,
        isCollection: value.isCollection
    };
    return updateProperties(state, updatedValues);
};

/**
 * Variable reducer function runs validation rules and returns back the updated variable
 * @param {object} variable - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} variable - updated variable
 */
export const variableReducer = (variable, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY: {
            const propertyValue = {error: action.payload.error, value: action.payload.value};
            return updateProperties(variable, {[action.payload.propertyName]: propertyValue});
        }
        case PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE:
            return dataTypeChanged(variable, action);
        case VALIDATE_ALL:
            return variableValidation.validateAll(variable);
        default: return variable;
    }
};