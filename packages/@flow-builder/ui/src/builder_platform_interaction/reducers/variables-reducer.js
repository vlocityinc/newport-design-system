import { UPDATE_FLOW, ADD_VARIABLE, DELETE_VARIABLE } from 'builder_platform_interaction-actions';

/**
 * Reducer for variables
 * @param {Array} state variables array in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function variablesReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.variables];
        case ADD_VARIABLE: return [...state, action.payload.guid];
        case DELETE_VARIABLE: return deleteVariable(state, action.payload.guid);
        default: return state;
    }
}

/**
 * Delete a variable from the store
 * @param {Array} state current state of variables in the store
 * @param {String} guid to be deleted
 * @return {Array} newState new state after deleting the guid
 */
function deleteVariable(state, guid) {
    const index = state.indexOf(guid);
    return [...state.slice(0, index), ...state.slice(index + 1)];
}