import {
    ADD_CANVAS_ELEMENT,
    ADD_DECISION_WITH_OUTCOMES,
    ADD_SCREEN_WITH_FIELDS,
    ADD_END_ELEMENT,
    SELECTION_ON_FIXED_CANVAS,
    ADD_WAIT_WITH_WAIT_EVENTS,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    DELETE_ELEMENT,
    PASTE_ON_FIXED_CANVAS
} from 'builder_platform_interaction/actions';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { isDevNameInStore } from 'builder_platform_interaction/storeUtils';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import ffcElementsReducer from './elementsReducer';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { initializeChildren } from 'builder_platform_interaction/flcConversionUtils';

import { supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';

import {
    findLastElement,
    findFirstElement,
    FlcList,
    addElementToState,
    linkElement,
    linkBranch
} from 'builder_platform_interaction/flowUtils';

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

function _getElementFromActionPayload(payload) {
    return payload.screen || payload.canvasElement || payload;
}

/**
 * Function to add a canvas element on the fixed canvas
 * @param {Object} state - State of elements in the store
 * @param {Object} action - Action dispatched to the store
 */

function _addCanvasElement(state, action) {
    const element = _getElementFromActionPayload(action.payload);
    const { parent, childIndex } = element;

    addElementToState(element, state);

    if (supportsChildren(element)) {
        initializeChildren(element);
    }

    if (parent) {
        // if the element has a parent, make it the new branch head
        const parentElement = state[parent];
        linkBranch(state, parentElement, childIndex, element);
    } else {
        linkElement(state, element);
    }

    // when adding an end element, we might need to restructure things
    if (action.type === ADD_END_ELEMENT) {
        _restructureFlow(element, state);
    }

    return state;
}

/**
 * When adding an end element we might need to restructure the flow
 * @param {Object} element - end element
 * @param {Object} state - current state of elements in the store
 */
function _restructureFlow(element, state) {
    const branchFirstElement = findFirstElement(element, state);
    if (branchFirstElement.elementType === ELEMENT_TYPE.START_ELEMENT) {
        // nothing to restructure
        return;
    }

    // mark the branch as a terminal branch
    branchFirstElement.isTerminal = true;

    const parent = state[branchFirstElement.parent];
    const children = parent.children;

    // find the indexes of the non-terminal branches
    // (there will always be at least one when adding an end element)
    const nonTerminalBranchIndexes = children
        .map((child, index) => (child == null || !state[child].isTerminal ? index : -1))
        .filter(index => index !== -1);

    if (nonTerminalBranchIndexes.length === 1) {
        // we have one non-terminal branch, so we need to restructure
        const [branchIndex] = nonTerminalBranchIndexes;
        const branchHead = children[branchIndex];
        const parentNext = state[parent.next];

        const branchTail = branchHead && findLastElement(state[branchHead], state);

        if (branchTail != null) {
            //  reconnect the elements that follow the parent element to the tail of the branch
            branchTail.next = parent.next;
            linkElement(state, branchTail);
        } else {
            // its an empty branch, so make the elements that follow the parent element be the branch itself
            parentNext.prev = null;
            linkBranch(state, parent, branchIndex, parentNext);
        }
        parent.next = null;
    }
}

/**
 * Helper function to get unique dev name that is not in the store or in the passed in blacklist
 *
 * @param {String} name - existing dev name to make unique
 * @param {String[]} blacklistNames - blacklisted list of names to check against in addition to store
 * @return {String} new unique dev name
 */
function _getUniquePastedElementName(name, blacklistNames = []) {
    if (isDevNameInStore(name) || blacklistNames.includes(name)) {
        return _getUniquePastedElementName(name + '_0', blacklistNames);
    }

    return name;
}

/**
 * Helper function to get unique dev names for child elements
 *
 * @param {Object} cutOrCopiedChildElements - list of guids of the child elements to paste
 * @param {String[]} blacklistNames - blacklisted list of names to check against in addition to store
 */
function _getPastedChildElementNameMap(cutOrCopiedChildElements, blacklistNames) {
    const childElementNameMap = {};
    const cutOrCopiedChildElementsArray = Object.values(cutOrCopiedChildElements);
    for (let i = 0; i < cutOrCopiedChildElementsArray.length; i++) {
        const pastedChildElementName = _getUniquePastedElementName(
            cutOrCopiedChildElementsArray[i].name,
            blacklistNames
        );
        childElementNameMap[cutOrCopiedChildElementsArray[i].name] = pastedChildElementName;
        blacklistNames.push(pastedChildElementName);
    }

    return childElementNameMap;
}

/**
 * Function to paste elements on Fixed Canvas
 * @param {Object} elements - State of elements in the store
 * @param {Object} payload - Contains the data needed for pasting the cut or copied elements
 * @returns newState - The updated state of elements in the store
 */
function _pasteOnFixedCanvas(
    elements,
    {
        canvasElementGuidMap,
        childElementGuidMap,
        cutOrCopiedCanvasElements,
        cutOrCopiedChildElements,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        prev,
        next,
        parent,
        childIndex
    }
) {
    let newState = { ...elements };

    const elementGuidsToPaste = Object.keys(canvasElementGuidMap);
    const blacklistNames = [];
    const childElementNameMap = _getPastedChildElementNameMap(cutOrCopiedChildElements, blacklistNames);

    for (let i = 0; i < elementGuidsToPaste.length; i++) {
        const pastedElementGuid = canvasElementGuidMap[elementGuidsToPaste[i]];
        const pastedElementName = _getUniquePastedElementName(
            cutOrCopiedCanvasElements[elementGuidsToPaste[i]].name,
            blacklistNames
        );
        blacklistNames.push(pastedElementName);

        const elementConfig = getConfigForElementType(cutOrCopiedCanvasElements[elementGuidsToPaste[i]].elementType);
        const { pastedCanvasElement, pastedChildElements = {} } =
            elementConfig &&
            elementConfig.factory &&
            elementConfig.factory.pasteElement &&
            elementConfig.factory.pasteElement({
                canvasElementToPaste: cutOrCopiedCanvasElements[elementGuidsToPaste[i]],
                newGuid: pastedElementGuid,
                newName: pastedElementName,
                canvasElementGuidMap,
                childElementGuidMap,
                childElementNameMap,
                cutOrCopiedChildElements,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                prev,
                next,
                parent,
                childIndex
            });

        newState[pastedCanvasElement.guid] = pastedCanvasElement;
        newState = { ...newState, ...pastedChildElements };
    }

    // Updating previous element's next to the guid of the top-most pasted element
    if (prev) {
        const prevElement = newState[prev];
        prevElement.next = canvasElementGuidMap[topCutOrCopiedGuid];
        linkElement(newState, prevElement);
    } else if (parent) {
        linkBranch(newState, newState[parent], childIndex, newState[canvasElementGuidMap[topCutOrCopiedGuid]]);
    }

    return newState;
}

function _deleteElement(state, { payload }) {
    const { selectedElements, childIndexToKeep = 0 } = payload;

    selectedElements.forEach(element => {
        const { prev, next, parent, childIndex } = element;

        let nextElement;

        // take care of linking tail of the branch to keep to the next element
        if (supportsChildren(element) && childIndexToKeep != null) {
            const headElement = state[element.children[childIndexToKeep]];
            if (headElement && next) {
                const tailElement = findLastElement(headElement, state);
                tailElement.next = next;
                linkElement(state, tailElement);
            }
            nextElement = headElement;
        }

        nextElement = nextElement || state[next];
        const parentElement = state[parent];

        if (parentElement) {
            parentElement.children[childIndex] = null;
            linkBranch(state, parentElement, childIndex, nextElement);
        } else if (nextElement) {
            nextElement.prev = prev;
            linkElement(state, nextElement);
        } else {
            // we're deleting the last element in a branch
            state[prev].next = null;
        }

        // now delete the elements that need to be deleted
        delete state[element.guid];
        if (supportsChildren(element)) {
            element.children.forEach((child, i) => {
                if (child != null && i !== childIndexToKeep) {
                    new FlcList(state, child).forEach(listElement => delete state[listElement.guid]);
                }
            });
        }
    });

    return state;
}

/**
 * FLC Reducer for elements
 *
 * @param {Object} state - elements in the store
 * @param {Object} action - with type and payload
 * @return {Object} new state after reduction
 */

export default function elementsReducer(state = {}, action) {
    state = deepCopy(ffcElementsReducer(state, action));

    switch (action.type) {
        case ADD_CANVAS_ELEMENT:
        case ADD_SCREEN_WITH_FIELDS:
        case ADD_DECISION_WITH_OUTCOMES:
        case ADD_END_ELEMENT:
        case ADD_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
            state = _addCanvasElement(state, action);
            break;
        case DELETE_ELEMENT:
            state = _deleteElement(state, action);
            break;
        case SELECTION_ON_FIXED_CANVAS:
            state = _selectionOnFixedCanvas(
                state,
                action.payload.canvasElementGuidsToSelect,
                action.payload.canvasElementGuidsToDeselect,
                action.payload.selectableGuids
            );
            break;
        case PASTE_ON_FIXED_CANVAS:
            state = _pasteOnFixedCanvas(state, action.payload);
            break;
        default:
    }

    return state;
}
