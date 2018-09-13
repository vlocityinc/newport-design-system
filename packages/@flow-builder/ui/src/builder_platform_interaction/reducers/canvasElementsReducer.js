import { UPDATE_FLOW, ADD_CANVAS_ELEMENT, DELETE_ELEMENT, ADD_DECISION_WITH_OUTCOMES } from "builder_platform_interaction/actions";
import { addItem } from "builder_platform_interaction/dataMutationLib";

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
        case ADD_DECISION_WITH_OUTCOMES:
            return addItem(state, action.payload.decision.guid);
        case ADD_CANVAS_ELEMENT:
            return addItem(state, action.payload.guid);
        case DELETE_ELEMENT: return _deleteCanvasElements(state, action.payload.selectedElementGUIDs);
        default: return state;
    }
}

/**
 * Deletes the given canvas element GUIDs from canvasElements.
 *
 * @param {Array} canvasElements - canvas element array in the store
 * @param {Array} selectedCanvasElementGUIDs - Array containing GUIDs of all the canvas elements that are being deleted
 * @returns {Array} new state of canvas element array
 * @private
 */
function _deleteCanvasElements(canvasElements, selectedCanvasElementGUIDs) {
    if (selectedCanvasElementGUIDs && selectedCanvasElementGUIDs.length > 0) {
        return selectedCanvasElementGUIDs.reduce((newCanvasElements, guid) => {
            return newCanvasElements.filter(canvasElement => (canvasElement !== guid));
        }, [...canvasElements]);
    }
    return canvasElements;
}