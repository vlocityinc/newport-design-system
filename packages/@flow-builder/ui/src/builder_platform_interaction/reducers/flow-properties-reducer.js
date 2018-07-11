import { UPDATE_FLOW, UPDATE_PROPERTIES } from 'builder_platform_interaction-actions';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for properties
 * @param {Object} state properties object in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */

// TODO: Replace this with user selected process type in 218. Hard coded to AutoLaunchedFlow for 216
const flowProperties = {processType: 'AutoLaunchedFlow', elementType: 'FLOW_PROPERTIES'};

export default function flowPropertiesReducer(state = flowProperties, action) {
    switch (action.type) {
        case UPDATE_FLOW:
            return updateProperties(state, action.payload.properties);
        case UPDATE_PROPERTIES:
            return updateProperties(state, action.payload);
        default: return state;
    }
}