// @ts-nocheck
import {
    ADD_RESOURCE,
    ADD_START_ELEMENT,
    DESELECT_ON_CANVAS,
    REMOVE_LAST_CREATED_INLINE_RESOURCE,
    SELECT_ON_CANVAS,
    UPDATE_INLINE_RESOURCE_PROPERTIES,
    TOGGLE_ON_CANVAS,
    SELECTION_ON_FIXED_CANVAS,
    UPDATE_FLOW,
    UPDATE_PROPERTIES,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
    UPDATE_PROPERTIES_AFTER_SAVE_FAILED,
    UPDATE_PROPERTIES_AFTER_SAVING,
    UPDATE_PROPERTIES_AFTER_ACTIVATING,
    UPDATE_APEX_CLASSES,
    UPDATE_ENTITIES,
    UPDATE_CANVAS_ELEMENT,
    DECORATE_CANVAS,
    CLEAR_CANVAS_DECORATION,
    UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE
} from 'builder_platform_interaction/actions';
import { createFlowProperties } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isRunInModeSupported } from 'builder_platform_interaction/triggerTypeLib';

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
/* eslint-disable-next-line complexity */
export default function flowPropertiesReducer(state = flowProperties, { payload, type }) {
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
                lastInlineResourceGuid: null,
                lastInlineResourcePosition: null
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
        case UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE:
            return {
                ...state,
                ...payload.properties,
                hasUnsavedChanges: true
            };
        case UPDATE_PROPERTIES_AFTER_ACTIVATING:
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
        case SELECTION_ON_FIXED_CANVAS:
        case UPDATE_APEX_CLASSES:
        case UPDATE_ENTITIES:
        case DECORATE_CANVAS:
        case CLEAR_CANVAS_DECORATION:
            return state;
        case UPDATE_CANVAS_ELEMENT:
            // If the start element is updated with a trigger type that does not support
            // the run-in system mode, then set the run-in mode property to undefined
            return payload.elementType === ELEMENT_TYPE.START_ELEMENT && !isRunInModeSupported(payload.triggerType)
                ? {
                      ...state,
                      runInMode: undefined,
                      hasUnsavedChanges: true
                  }
                : {
                      ...state,
                      hasUnsavedChanges: true
                  };
        default:
            return {
                ...state,
                hasUnsavedChanges: true
            };
    }
}
