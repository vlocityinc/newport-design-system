import { UPDATE_FLOW, ADD_CANVAS_ELEMENT, DELETE_CANVAS_ELEMENT } from 'builder_platform_interaction-actions';

/**
 * Reducer for canvas element
 * @param {Array} state canvas element array in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function canvasElementsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.canvasElements];
        case ADD_CANVAS_ELEMENT: return [...state, action.payload.guid];
        case DELETE_CANVAS_ELEMENT: return deleteCanvasElement(state, action.payload.guid);
        default: return state;
    }
}

/**
 * Delete an assignment from the store
 * @param {Array} state current state of assignments in the store
 * @param {String} guid to be deleted
 * @return {Array} newState new state after deleting the guid
 */
function deleteCanvasElement(state, guid) {
    const index = state.indexOf(guid);
    return [...state.slice(0, index), ...state.slice(index + 1)];
}