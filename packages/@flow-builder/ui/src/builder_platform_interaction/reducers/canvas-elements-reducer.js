import { UPDATE_FLOW, ADD_CANVAS_ELEMENT, DELETE_CANVAS_ELEMENT } from 'builder_platform_interaction-actions';
import { addItem } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for canvas element.
 *
 * @param {Array} state - canvas element array in the store
 * @param {Object} action - with type and payload
 * @return {Array} new state after reduction
 */
export default function canvasElementsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.canvasElements];
        case ADD_CANVAS_ELEMENT: return addItem(state, action.payload.guid);
        case DELETE_CANVAS_ELEMENT: return _deleteCanvasElements(state, action.payload.canvasElementGUIDs);
        default: return state;
    }
}

/**
 * Deletes the given canvas element GUIDs from canvasElements.
 *
 * @param {Array} canvasElements - canvas element array in the store
 * @param {Array} canvasElementGUIDs - Array containing GUIDs of all the canvas elements that are being deleted
 * @returns {Array} new state of canvas element array
 * @private
 */
function _deleteCanvasElements(canvasElements, canvasElementGUIDs) {
    if (canvasElementGUIDs && canvasElementGUIDs.length > 0) {
        return canvasElementGUIDs.reduce((newCanvasElements, guid) => {
            return newCanvasElements.filter(canvasElement => (canvasElement !== guid));
        }, [...canvasElements]);
    }
    return canvasElements;
}