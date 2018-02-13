import { UPDATE_FLOW } from 'builder_platform_interaction-actions';

/**
 * Reducer for startElement
 * @param {Object} state startElement in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function startElementReducer(state = null, action) {
    switch (action.type) {
        case UPDATE_FLOW:
            return action.payload.startElement;
        default: return state;
    }
}