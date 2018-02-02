import { UPDATE_FLOW, ADD_CANVAS_ELEMENT, DELETE_CANVAS_ELEMENT } from 'builder_platform_interaction-actions';
import { addItem, deleteItem } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for canvas element
 * @param {Array} state canvas element array in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function canvasElementsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.canvasElements];
        case ADD_CANVAS_ELEMENT: return addItem(state, action.payload.guid);
        case DELETE_CANVAS_ELEMENT: return deleteItem(state, state.indexOf(action.payload.guid));
        default: return state;
    }
}