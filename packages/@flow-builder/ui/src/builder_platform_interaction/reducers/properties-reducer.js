import { UPDATE_FLOW, UPDATE_PROPERTIES } from 'builder_platform_interaction-actions';

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
            return _updateProperties(state, action.payload);
        default: return state;
    }
}

/**
 * Update properties in store and create new properties object
 * @param {Object} currentState current values of the property
 * @param {Object} newValue new values to be updated
 * @returns {Object} if new value is defined, then returns a new object with update values. Else returns current state.
 * @private
 */
function _updateProperties(currentState, newValue) {
    return newValue ? Object.assign({}, currentState, newValue) : currentState;
}