import { UPDATE_FLOW, ADD_FORMULA, DELETE_FORMULA } from 'builder_platform_interaction-actions';
import { addItem, deleteItem } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Reducer for formulas
 * @param {Array} state formulas array in the store
 * @param {Object} action with type and payload
 * @return {Object} new state after reduction
 */
export default function formulasReducer(state = [], action) {
    switch (action.type) {
        case UPDATE_FLOW: return [...action.payload.formulas];
        case ADD_FORMULA: return addItem(state, action.payload.guid);
        case DELETE_FORMULA: return deleteItem(state, state.indexOf(action.payload.guid));
        default: return state;
    }
}