// @ts-nocheck
import {
    ADD_START_ELEMENT,
    ADD_CANVAS_ELEMENT,
    ADD_DECISION_WITH_OUTCOMES,
    ADD_SCREEN_WITH_FIELDS,
    ADD_END_ELEMENT,
    SELECTION_ON_FIXED_CANVAS,
    ADD_WAIT_WITH_WAIT_EVENTS,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    MODIFY_DECISION_WITH_OUTCOMES,
    DELETE_ELEMENT,
    PASTE_ON_FIXED_CANVAS,
    REORDER_CONNECTORS,
    ADD_FAULT,
    DELETE_FAULT,
    FLC_CREATE_CONNECTION
} from 'builder_platform_interaction/actions';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { isDevNameInStore } from 'builder_platform_interaction/storeUtils';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import elementsReducer from './elementsReducer';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { createRootElement } from 'builder_platform_interaction/flcConversionUtils';
import {
    addElementToState,
    linkElement,
    linkBranchOrFault,
    deleteBranchHeadProperties,
    deleteElement,
    addElement,
    deleteFault,
    deleteBranch,
    FAULT_INDEX,
    reconnectBranchElement,
    findLastElement
} from 'builder_platform_interaction/autoLayoutCanvas';
import { getSubElementGuids } from './reducersUtils';

/**
 * FLC Reducer for elements
 *
 * @param {Object} state - elements in the store
 * @param {Object} action - with type and payload
 * @return {Object} new state after reduction
 */
export default function flcElementsReducer(state = {}, action) {
    state = deepCopy(elementsReducer(state, action));

    switch (action.type) {
        case ADD_START_ELEMENT:
            state = addRootAndEndElements(state, action.payload.guid);
            break;
        case FLC_CREATE_CONNECTION:
            state = _reconnectBranchElement(state, action.payload);
            break;
        case ADD_FAULT:
            state = _addFault(state, action.payload);
            break;
        case DELETE_FAULT:
            state = _deleteFault(state, action.payload);
            break;
        case ADD_CANVAS_ELEMENT:
        case ADD_SCREEN_WITH_FIELDS:
        case ADD_DECISION_WITH_OUTCOMES:
        case ADD_END_ELEMENT:
        case ADD_WAIT_WITH_WAIT_EVENTS:
            state = _addCanvasElement(state, action);
            break;
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_DECISION_WITH_OUTCOMES:
            state = _modifyCanvasElementWithChildren(state, action);
            break;
        case DELETE_ELEMENT:
            // TODO: FLC find a better solution for getSubElementGuids
            state = _deleteElements(state, action, null, getSubElementGuids);
            break;
        case REORDER_CONNECTORS:
            state = _reorderConnectors(
                state,
                action.payload.parentElementGuid,
                action.payload.oldChildReferenceGuid,
                action.payload.newChildReferenceGuid
            );
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

/**
 * Adds a root and end element for a new flow
 * @param {Object} elements - the store elements
 * @param {string} startElementGuid - the start element guid
 */
function addRootAndEndElements(elements, startElementGuid) {
    const rootElement = createRootElement();
    addElementToState(rootElement, elements);

    linkBranchOrFault(elements, rootElement, 0, elements[startElementGuid]);
    linkElement(elements, createEndElement({ prev: startElementGuid }));
    return elements;
}

function _getElementFromActionPayload(payload) {
    return payload.screen || payload.canvasElement || payload;
}

function _reconnectBranchElement(elements, { sourceGuid, targetGuid }) {
    return reconnectBranchElement(elements, sourceGuid, targetGuid);
}

/**
 * Adds a fault to an element
 *
 * @param {Object} state - The flow state
 * @param {Object} elementGuid - The guid of the element to add a fault to
 */
function _addFault(state, elementGuid) {
    const element = state[elementGuid];

    const endElement = createEndElement({
        prev: null,
        next: null
    });

    addElementToState(endElement, state);
    linkBranchOrFault(state, element, FAULT_INDEX, endElement);

    return state;
}

function _deleteFault(state, elementGuid) {
    return deleteFault(state, elementGuid, getSubElementGuids);
}

/**
 * Function to add a canvas element on the fixed canvas
 * @param {Object} state - State of elements in the store
 * @param {Object} action - Action dispatched to the store
 */
function _addCanvasElement(state, action) {
    const element = _getElementFromActionPayload(action.payload);

    addElement(state, element, action.type === ADD_END_ELEMENT);

    return state;
}

/**
 * Function to add a canvas element on the fixed canvas
 * @param {Object} state - State of elements in the store
 * @param {Object} action - Action dispatched to the store
 */
function _modifyCanvasElementWithChildren(state, action) {
    let element = _getElementFromActionPayload(action.payload);
    element = state[element.guid];

    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i]) {
            state[element.children[i]].childIndex = i;
        }
    }

    const deletedBranchHeadGuids = action.payload.deletedBranchHeadGuids;
    for (let i = 0; i < deletedBranchHeadGuids.length; i++) {
        deleteBranch(state, deletedBranchHeadGuids[i], getSubElementGuids);
    }

    return state;
}

/**
 * Function to delete elements from store state
 * @param {Object} state - Current state of elements in the store
 * @param {Object} action - Action dispatched to the store
 */
function _deleteElements(state, { payload }) {
    const { selectedElements, childIndexToKeep } = payload;
    selectedElements.forEach(element => deleteElement(state, element, childIndexToKeep, getSubElementGuids));
    return state;
}

/**
 * Function to re-order the connectors in Auto-Layout Canvas
 * @param {Object} state - Current state of elements in the store
 * @param {String} parentElementGuid - Guid of the parent element which can either be a Decision or Pause element
 * @param {String} oldChildReferenceGuid - Previously selected childReference guid
 * @param {String} newChildReferenceGuid - Newly selected childReference guid
 */
function _reorderConnectors(state, parentElementGuid, oldChildReferenceGuid, newChildReferenceGuid) {
    const parentElement = state[parentElementGuid];
    const { singular, plural } = getConfigForElementType(parentElement.elementType).childReferenceKey;
    const newChildReferences = parentElement[plural].map(childReferenceObject => {
        // Swapping the oldChildReferenceGuid with newChildReferenceGuid
        if (childReferenceObject[singular] === oldChildReferenceGuid) {
            return {
                [singular]: newChildReferenceGuid
            };
        }

        // Swapping the newChildReferenceGuid with oldChildReferenceGuid
        if (childReferenceObject[singular] === newChildReferenceGuid) {
            return {
                [singular]: oldChildReferenceGuid
            };
        }

        return childReferenceObject;
    });

    parentElement[plural] = newChildReferences;
    return state;
}

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
            let updatedIsSelectable = newState[guid].config.isSelectable;

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
                // Setting isSelectable as true only if it was originally set to false
                if (newState[guid].config && !newState[guid].config.isSelectable) {
                    updatedIsSelectable = true;
                }
            } else if (selectableGuids.includes(guid)) {
                // Setting isSelectable as true only if it was originally set to false
                if (newState[guid].config && !newState[guid].config.isSelectable) {
                    updatedIsSelectable = true;
                }
            } else if (newState[guid].config && newState[guid].config.isSelectable) {
                // Setting isSelectable as false only if it was originally set to true
                updatedIsSelectable = false;
            }

            if (
                updatedIsSelected !== newState[guid].config.isSelected ||
                updatedIsSelectable !== newState[guid].config.isSelectable
            ) {
                newState[guid] = updateProperties(newState[guid], {
                    config: {
                        isSelected: updatedIsSelected,
                        isHighlighted: newState[guid].config.isHighlighted,
                        isSelectable: updatedIsSelectable
                    }
                });

                hasStateChanged = true;
            }
        }

        return guid;
    });

    return hasStateChanged ? newState : elements;
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
        prev = null,
        next = null,
        parent = null,
        childIndex = null
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
        newState[prev].next = canvasElementGuidMap[topCutOrCopiedGuid];
    }

    // Updating next element's prev to the guid of the bottom-most pasted element
    if (next) {
        newState[next].prev = canvasElementGuidMap[bottomCutOrCopiedGuid];

        // If the next element was a terminal element, then marking the topCutOrCopied element as the terminal element
        if (newState[next].isTerminal) {
            newState[canvasElementGuidMap[topCutOrCopiedGuid]].isTerminal = true;
        }

        // Deleting the next element's parent, childIndex and isTerminal property
        deleteBranchHeadProperties(newState[next]);
    }

    if (parent) {
        if (childIndex === FAULT_INDEX) {
            // Updating the parent's fault to to point to the top-most pasted element's guid
            newState[parent].fault = canvasElementGuidMap[topCutOrCopiedGuid];
        } else {
            // Updating the parent's children to include the top-most pasted element's guid at the right index
            newState[parent].children[childIndex] = canvasElementGuidMap[topCutOrCopiedGuid];
        }
    }

    // Adding end elements to the pasted fault branches
    const pastedElementGuids = Object.values(canvasElementGuidMap);
    for (let i = 0; i < pastedElementGuids.length; i++) {
        const pastedElement = newState[pastedElementGuids[i]];
        if (pastedElement.fault) {
            // Adding an end element and connecting it to the last element in the pasted Fault Branch
            const lastFaultBranchElement = findLastElement(newState[pastedElement.fault], newState);
            const endElement = createEndElement({
                prev: lastFaultBranchElement.guid,
                next: null
            });
            addElementToState(endElement, newState);
            lastFaultBranchElement.next = endElement.guid;
        }
    }

    return newState;
}
