import { ADD_END_ELEMENT, PASTE_ON_FIXED_CANVAS } from 'builder_platform_interaction/actions';
import { addItem } from 'builder_platform_interaction/dataMutationLib';

import canvasElementsReducer from './canvasElementsReducer';

/**
 * FLC Reducer for canvas element.
 *
 * @param {Array} state - canvas element array in the store
 * @param {Object} action - with type and payload
 * @return {Object} new state after reduction
 */
export default function flcCanvasElementsReducer(state = [], action) {
    state = canvasElementsReducer(state, action);

    switch (action.type) {
        case ADD_END_ELEMENT:
            return addItem(state, action.payload.guid);
        case PASTE_ON_FIXED_CANVAS:
            return [...state, ...Object.values(action.payload.canvasElementGuidMap)];
        default:
            return state;
    }
}
