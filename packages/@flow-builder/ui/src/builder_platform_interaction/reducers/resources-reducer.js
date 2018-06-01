import { UPDATE_FLOW, ADD_RESOURCE, DELETE_RESOURCE } from 'builder_platform_interaction-actions';
import { addItem, deleteItem } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for resources
 * @param {Array} state resources array in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function resourcesReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.resources];
        case ADD_RESOURCE: return addItem(state, action.payload.guid);
        case DELETE_RESOURCE: return deleteItem(state, state.indexOf(action.payload.guid));
        default: return state;
    }
}