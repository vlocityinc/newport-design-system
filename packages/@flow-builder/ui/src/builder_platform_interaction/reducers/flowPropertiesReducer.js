import { UPDATE_FLOW, UPDATE_PROPERTIES, UPDATE_PROPERTIES_AFTER_SAVING, ADD_START_ELEMENT } from "builder_platform_interaction/actions";
import { createFlowProperties } from "builder_platform_interaction/elementFactory";
/**
 * Reducer for properties
 * @param {Object} state properties object in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */

// TODO: Replace this with user selected process type in 218. Hard coded to AutoLaunchedFlow for 216
const flowProperties = createFlowProperties();

export default function flowPropertiesReducer(state = flowProperties, action) {
    switch (action.type) {
        // Default value of hasUnsavedChanges is false in factory, so in this case it will be set to false.
        case UPDATE_FLOW: return Object.assign({}, state, action.payload.properties, {
            hasUnsavedChanges: false
        });
        // This action is dispatch when after flow properties are updated
        // In first case, hasUnsavedChanges is set to true.
        case UPDATE_PROPERTIES: return Object.assign({}, state, action.payload, {
            hasUnsavedChanges: true
        });
        // This action is dispatched after flow is saved
        // After flow is saved, hasUnsavedChanges is set to false.
        case UPDATE_PROPERTIES_AFTER_SAVING: return Object.assign({}, state, action.payload, {
            hasUnsavedChanges: false
        });

        // These actions are dispatched when new flow is created
        case ADD_START_ELEMENT:
        case 'INIT': return state;

        // hasUnsavedChanges is set to true, if any other action is dispatch
        default: return Object.assign({}, state, {
            hasUnsavedChanges: true
        });
    }
}