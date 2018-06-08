import { updateProperties, isItemHydratedWithErrors } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';

const dataTypeChanged = (state, action) => {
    if (typeof action.payload.value.scale !== 'number') {
        action.payload.value.scale = 2;
    }
    return updateProperties(state, { dataType : { error: null, value: action.payload.value.dataType }, scale: action.payload.value.scale, isCollection: action.payload.value.isCollection });
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
            // TODO: validation W-4900878
            const propertyValue = isItemHydratedWithErrors(variable[action.payload.propertyName]) ?
                {error: action.payload.error, value: action.payload.value} : action.payload.value;
            return updateProperties(variable, {[action.payload.propertyName]: propertyValue});
        }
        case PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE:
            return dataTypeChanged(variable, action);
        default: return variable;
    }
};