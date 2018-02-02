import { UPDATE_FLOW, ADD_VARIABLE, DELETE_VARIABLE } from 'builder_platform_interaction-actions';
import { addItem, deleteItem } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for variables
 * @param {Array} state variables array in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function variablesReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.variables];
        case ADD_VARIABLE: return addItem(state, action.payload.guid);
        case DELETE_VARIABLE: return deleteItem(state, state.indexOf(action.payload.guid));
        default: return state;
    }
}