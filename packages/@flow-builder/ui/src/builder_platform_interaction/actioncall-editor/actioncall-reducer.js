import { actionCallValidation } from './actioncall-validation';
import { updateProperties, omit } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

const changeActionType = (state, action) => {
    let newState = omit(state, ['actionName', 'actionType', 'flowName', 'apexClass', 'inputParameters', 'outputParameters', 'inputAssignments', 'outputAssignments']);
    const payload = action.payload;
    const elementType = payload.elementType;
    switch (elementType) {
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
            newState = updateProperties(newState, { elementType, apexClass : { value : payload.apexClass }});
            break;
        case ELEMENT_TYPE.SUBFLOW:
            newState = updateProperties(newState, { elementType, flowName : { value : payload.flowName }});
            newState = omit(newState, 'faultConnector');
            break;
        default:
            newState = updateProperties(newState, { elementType,  actionType : { value : payload.actionType }, actionName : { value : payload.actionName }});
            break;
    }
    return newState;
};

const actionCallPropertyChanged = (state, action) => {
    action.payload.error = action.payload.error === null ? actionCallValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
    return updateProperties(state, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
};

/**
 * actionCall reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} state - updated state
 */
export const actionCallReducer = (state, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return actionCallPropertyChanged(state, action);
        case PROPERTY_EDITOR_ACTION.CHANGE_ACTION_TYPE:
            return changeActionType(state, action);
        default: return state;
    }
};