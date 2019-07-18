import {
    ADD_RESOURCE,
    ADD_START_ELEMENT,
    DESELECT_ON_CANVAS,
    REMOVE_LAST_CREATED_INLINE_RESOURCE,
    SELECT_ON_CANVAS,
    UPDATE_INLINE_RESOURCE_PROPERTIES,
    TOGGLE_ON_CANVAS,
    UPDATE_FLOW,
    UPDATE_PROPERTIES,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
    UPDATE_PROPERTIES_AFTER_SAVE_FAILED,
    UPDATE_PROPERTIES_AFTER_SAVING,
    UPDATE_PROPERTIES_AFTER_ACTIVATION
} from 'builder_platform_interaction/actions';
import { createFlowProperties } from 'builder_platform_interaction/elementFactory';

/**
 * Reducer for properties
 * @param {Object} state properties object in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */

const INIT = 'INIT';
const flowProperties = createFlowProperties();

/**
 * Case Notes (Moved due to eslint errors)
 * UPDATE_PROPERTIES_AFTER_SAVING: This action is dispatched after flow is saved.
 * After flow is saved, hasUnsavedChanges is set to false.
 * UPDATE_FLOW: Default value of hasUnsavedChanges is false in factory, so in this case it will be set to false.
 * UPDATE_PROPERTIES_AFTER_SAVE_FAILED: This action is dispatched after flow save call is failed.
 * hasUnsavedChanges is set to true, so that the user can press save button again.
 * UPDATE_PROPERTIES: This action is dispatch when after flow properties are updated
 * In first case, hasUnsavedChanges is set to true.
 *
 */

export default function flowPropertiesReducer(
    state = flowProperties,
    { payload, type }
) {
    switch (type) {
        case ADD_RESOURCE:
            return {
                ...state,
                lastInlineResourceGuid: payload.guid,
                hasUnsavedChanges: true
            };
        case REMOVE_LAST_CREATED_INLINE_RESOURCE:
            return {
                ...state,
                lastInlineResourceGuid: null
            };
        case UPDATE_INLINE_RESOURCE_PROPERTIES:
            return {
                ...state,
                lastInlineResourcePosition: payload.lastInlineResourcePosition,
                lastInlineResourceRowIndex: payload.lastInlineResourceRowIndex
            };
        case UPDATE_FLOW:
            return {
                ...state,
                ...payload.properties,
                hasUnsavedChanges: false
            };
        case UPDATE_PROPERTIES_AFTER_ACTIVATION:
        case UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE:
        case UPDATE_PROPERTIES_AFTER_SAVING:
            return {
                ...state,
                ...payload,
                hasUnsavedChanges: false
            };
        case UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE:
        case UPDATE_PROPERTIES_AFTER_SAVE_FAILED:
        case UPDATE_PROPERTIES:
            return {
                ...state,
                ...payload,
                hasUnsavedChanges: true
            };
        case ADD_START_ELEMENT:
        case DESELECT_ON_CANVAS:
        case INIT:
        case SELECT_ON_CANVAS:
        case TOGGLE_ON_CANVAS:
            return state;
        default:
            return {
                ...state,
                hasUnsavedChanges: true
            };
    }
}
