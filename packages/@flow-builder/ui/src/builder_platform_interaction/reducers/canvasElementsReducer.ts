// @ts-nocheck
import {
    UPDATE_FLOW,
    DO_DUPLICATE,
    ADD_CANVAS_ELEMENT,
    ADD_WAIT_WITH_WAIT_EVENTS,
    DELETE_ELEMENT,
    ADD_DECISION_WITH_OUTCOMES,
    ADD_SCREEN_WITH_FIELDS,
    ADD_START_ELEMENT,
    UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE,
    ADD_STEPPED_STAGE_WITH_STEPS
} from 'builder_platform_interaction/actions';
import { addItem } from 'builder_platform_interaction/dataMutationLib';

/**
 * Reducer for canvas element.
 *
 * @param {Array} state - canvas element array in the store
 * @param {Object} action - with type and payload
 * @return {Array} new state after reduction
 */
export default function canvasElementsReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW:
        case UPDATE_FLOW_ON_CANVAS_MODE_TOGGLE:
            return [...action.payload.canvasElements];
        case DO_DUPLICATE:
            return [...state, ...Object.values(action.payload.canvasElementGuidMap)];
        case ADD_DECISION_WITH_OUTCOMES:
        case ADD_WAIT_WITH_WAIT_EVENTS:
        case ADD_STEPPED_STAGE_WITH_STEPS:
            return addItem(state, action.payload.canvasElement.guid);
        case ADD_START_ELEMENT:
        case ADD_CANVAS_ELEMENT:
            return addItem(state, action.payload.guid);
        case ADD_SCREEN_WITH_FIELDS:
            return addItem(state, action.payload.screen.guid);
        case DELETE_ELEMENT:
            return _deleteCanvasElements(state, action.payload.selectedElements);
        default:
            return state;
    }
}

/**
 * Deletes the given canvas element GUIDs from canvasElements.
 *
 * @param {Array} canvasElements - canvas element array in the store
 * @param {Array} selectedCanvasElements - Array containing all the canvas elements that are being deleted
 * @returns {Array} new state of canvas element array
 * @private
 */
function _deleteCanvasElements(canvasElements, selectedCanvasElements) {
    if (selectedCanvasElements && selectedCanvasElements.length > 0) {
        return selectedCanvasElements.reduce(
            (newCanvasElements, element) => {
                return newCanvasElements.filter((canvasElement) => canvasElement !== element.guid);
            },
            [...canvasElements]
        );
    }
    return canvasElements;
}
