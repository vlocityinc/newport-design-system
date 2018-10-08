import { UPDATE_FLOW, UPDATE_PROPERTIES } from "builder_platform_interaction/actions";
import { updateProperties } from "builder_platform_interaction/dataMutationLib";
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
        case UPDATE_FLOW:
            return updateProperties(state, action.payload.properties);
        case UPDATE_PROPERTIES:
            return updateProperties(state, action.payload);
        default: return state;
    }
}