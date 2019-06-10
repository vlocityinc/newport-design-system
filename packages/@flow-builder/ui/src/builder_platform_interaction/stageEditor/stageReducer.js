import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { stageValidation } from './stageValidation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

const stagePropertyChanged = (state, action) => {
    action.payload.error =
        action.payload.error === null
            ? stageValidation.validateProperty(
                  action.payload.propertyName,
                  action.payload.value
              )
            : action.payload.error;
    return updateProperties(state, {
        [action.payload.propertyName]: {
            error: action.payload.error,
            value: action.payload.value
        }
    });
};

const stageValueChanged = (state, action) => {
    return updateProperties(state, {
        [action.payload.propertyName]: action.payload.value
    });
};

/**
 * Stage reducer function runs validation rules and returns back the updated stage
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} state - updated state
 */
export const stageReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return stagePropertyChanged(state, action);
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_VALUE:
            return stageValueChanged(state, action);
        case VALIDATE_ALL:
            return stageValidation.validateAll(state);
        default:
            return state;
    }
};
