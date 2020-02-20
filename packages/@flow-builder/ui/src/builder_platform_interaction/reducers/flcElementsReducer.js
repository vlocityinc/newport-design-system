import {
    ADD_DECISION_WITH_OUTCOMES,
    ADD_SCREEN_WITH_FIELDS,
    ADD_END_ELEMENT,
    SELECTION_ON_FIXED_CANVAS,
    ADD_WAIT_WITH_WAIT_EVENTS,
    MODIFY_WAIT_WITH_WAIT_EVENTS
} from 'builder_platform_interaction/actions';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { deepCopy } from 'builder_platform_interaction/storeLib';

import ffcElementsReducer from './elementsReducer';

/**
 * FLC Reducer for elements
 *
 * @param {Object} state - elements in the store
 * @param {Object} action - with type and payload
 * @return {Object} new state after reduction
 */

/**
 * Helper function to handle select mode in the Fixed Layout Canvas. Iterates over all the elements
 * and marks them as selected, deselected or disables the checkbox based on the data received
 *
 * @param {Object} elements - current state of elements in the store
 * @param {String[]} canvasElementGuidsToSelect - Array of canvas elements to be selected
 * @param {String[]} canvasElementGuidsToDeselect - Array of canvas elements to be deselected
 * @param {String[]} selectableGuids - Array of canvas element guids that are selectable next
 */
function _selectionOnFixedCanvas(elements, canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;

    Object.keys(elements).map(guid => {
        if (newState[guid].config) {
            let updatedIsSelected = newState[guid].config.isSelected;
            let updatedCanSelect = newState[guid].config.canSelect;

            // Set isSelected to true for the elements associated with the guids present canvasElementGuidsToSelect
            if (canvasElementGuidsToSelect.includes(guid) && !newState[guid].config.isSelected) {
                updatedIsSelected = true;
            }

            // Set isSelected to false for the elements associated with the guids present canvasElementGuidsToDeselect
            if (canvasElementGuidsToDeselect.includes(guid) && newState[guid].config.isSelected) {
                updatedIsSelected = false;
            }

            // When selectableGuids is an empty array, it means that everything is selectable
            if (selectableGuids.length === 0) {
                // Setting canSelect as true only if it was originally set to false
                if (newState[guid].config && !newState[guid].config.canSelect) {
                    updatedCanSelect = true;
                }
            } else if (selectableGuids.includes(guid)) {
                // Setting canSelect as true only if it was originally set to false
                if (newState[guid].config && !newState[guid].config.canSelect) {
                    updatedCanSelect = true;
                }
            } else if (newState[guid].config && newState[guid].config.canSelect) {
                // Setting canSelect as false only if it was originally set to true
                updatedCanSelect = false;
            }

            if (
                updatedIsSelected !== newState[guid].config.isSelected ||
                updatedCanSelect !== newState[guid].config.canSelect
            ) {
                newState[guid] = updateProperties(newState[guid], {
                    config: {
                        isSelected: updatedIsSelected,
                        isHighlighted: newState[guid].config.isHighlighted,
                        canSelect: updatedCanSelect
                    }
                });

                hasStateChanged = true;
            }
        }

        return guid;
    });

    return hasStateChanged ? newState : elements;
}

function linkElement(state, element) {
    const { prev, next, guid } = element;

    if (prev) {
        state[prev] = { ...state[prev], next: guid };
    }

    if (next) {
        state[next] = { ...state[next], prev: guid };
    }

    state[element.guid] = element;
}

export default function elementsReducer(state = {}, action) {
    state = deepCopy(ffcElementsReducer(state, action));

    let element, parent, childIndex, guid;

    switch (action.type) {
        case ADD_SCREEN_WITH_FIELDS:
        case ADD_DECISION_WITH_OUTCOMES:
        case ADD_END_ELEMENT:
        case ADD_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
            element = action.payload.screen || action.payload.canvasElement || action.payload;
            linkElement(state, element);

            ({ parent, childIndex, guid } = element);

            if (parent) {
                const child = state[parent].children[childIndex];

                if (child) {
                    element.next = child;
                    state[child].prev = guid;
                }
                state[parent].children[childIndex] = guid;
            }
            break;
        case SELECTION_ON_FIXED_CANVAS:
            state = _selectionOnFixedCanvas(
                state,
                action.payload.canvasElementGuidsToSelect,
                action.payload.canvasElementGuidsToDeselect,
                action.payload.selectableGuids
            );
            break;
        default:
    }

    return state;
}
