import { UPDATE_FLOW, UPDATE_PROPERTIES } from 'builder_platform_interaction-actions';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for properties
 * @param {Object} state properties object in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function propertiesReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_FLOW:
        case UPDATE_PROPERTIES:
            return updateProperties(state, action.payload);
        default: return state;
    }
}