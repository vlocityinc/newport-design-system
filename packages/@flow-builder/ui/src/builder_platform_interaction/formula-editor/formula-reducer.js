import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { formulaValidation } from './formula-validation';

const formulaPropertyChanged = (state, action) => {
    action.payload.error = action.payload.error === null ? formulaValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
    return updateProperties(state, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
};

const formulaDataTypeChanged = (state, action) => {
    action.payload.error = formulaValidation.validateProperty('dataType', action.payload.value.dataType);
    if (typeof action.payload.value.scale !== 'number') {
        action.payload.value.scale = 2;
    }
    return updateProperties(state, { dataType : { error: action.payload.error, value: action.payload.value.dataType }, scale: action.payload.value.scale });
};

/**
 * Formula reducer function runs validation rules and returns back the updated variable
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} state - updated state
 */
export const formulaReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return formulaPropertyChanged(state, action);
        case PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE:
            return formulaDataTypeChanged(state, action);
        default: return state;
    }
};