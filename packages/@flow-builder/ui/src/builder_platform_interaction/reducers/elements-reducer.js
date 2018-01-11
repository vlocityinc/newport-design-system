import { UPDATE_FLOW, ADD_CANVAS_ELEMENT, UPDATE_CANVAS_ELEMENT, DELETE_CANVAS_ELEMENT, ADD_VARIABLE, UPDATE_VARIABLE, DELETE_VARIABLE } from 'builder_platform_interaction-actions';
import { deepCopy } from 'builder_platform_interaction-store-lib';

/**
 * Reducer for elements
 * @param {Object} state elements in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function elementsReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_FLOW: return deepCopy(action.payload.elements);
        case ADD_CANVAS_ELEMENT:
        case ADD_VARIABLE:
            return _addOrUpdateElement(state, action.payload.guid, action.payload);
        case UPDATE_CANVAS_ELEMENT:
        case UPDATE_VARIABLE:
            return _addOrUpdateElement(state, action.payload.guid, action.payload);
        case DELETE_CANVAS_ELEMENT:
        case DELETE_VARIABLE:
            return _deleteElement(state, action.payload.guid);
        default: return state;
    }
}

/**
 * Helper function to add or update an element
 * @param {Object} state current state of elements in the store
 * @param {String} guid guid of element to be added or updated
 * @param {Object} element information about the element to be added or updated
 * @return {Object} new state
 * @private
 */
function _addOrUpdateElement(state, guid, element) {
    return Object.assign(deepCopy(state), {[guid]: deepCopy(element)});
}

/**
 * Helper function to delete an element from store
 * @param {Object} state current state of elements in the store
 * @param {String} guid guid of element to be deleted
 * @return {Object} new state
 * @private
 */
function _deleteElement(state, guid) {
    const newState = deepCopy(state);
    delete newState[guid];
    return newState;
}