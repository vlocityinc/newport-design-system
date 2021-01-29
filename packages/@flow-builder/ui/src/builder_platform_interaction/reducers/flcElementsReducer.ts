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
    ADD_FAULT,
    DELETE_FAULT,
    FLC_CREATE_CONNECTION,
    ADD_PARENT_WITH_CHILDREN
} from 'builder_platform_interaction/actions';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { isDevNameInStore } from 'builder_platform_interaction/storeUtils';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import elementsReducer from './elementsReducer';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { getElementsMetadata, supportsChildren } from 'builder_platform_interaction/flcBuilderUtils';

import {
    deleteBranchHeadProperties,
    FAULT_INDEX,
    findLastElement,
    assertInDev,
    assertAutoLayoutState,
    reducer,
    actions,
    Guid,
    NodeType
} from 'builder_platform_interaction/autoLayoutCanvas';

import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

import { getSubElementGuids } from './reducersUtils';

const getElementService = (flowModel: UI.Elements) => {
    return {
        deleteElement(elementGuid: Guid) {
            const element = flowModel[elementGuid];
            getSubElementGuids(element, flowModel).forEach((subElementGuid) => {
                delete flowModel[subElementGuid];
            });
            delete flowModel[elementGuid];
        },

        createEndElement() {
            const endElement = createEndElement();
            flowModel[endElement.guid] = endElement;
            return endElement.guid;
        }
    };
};

/**
 * FLC Reducer for elements
 *
 * @param state - elements in the store
 * @param action - with type and payload
 * @return new state after reduction
 */
export default function flcElementsReducer(state: Readonly<UI.Elements>, action: any): Readonly<UI.Elements> {
    const metadata = getElementsMetadata();

    let nextState = elementsReducer(deepCopy(state), action);
    const elementService = getElementService(nextState);
    const autoLayoutCanvasReducer = reducer(elementService);

    switch (action.type) {
        case ADD_START_ELEMENT: {
            const startElement = action.payload;
            nextState[startElement.guid] = startElement;

            const endElementGuid = elementService.createEndElement();
            const initAction = actions.initAction(action.payload.guid, endElementGuid);
            nextState = autoLayoutCanvasReducer(nextState, initAction);
            break;
        }
        case FLC_CREATE_CONNECTION: {
            const { insertAt, targetGuid } = action.payload;
            const connectToElementAction = actions.connectToElementAction(insertAt, targetGuid);
            nextState = autoLayoutCanvasReducer(nextState, connectToElementAction);
            break;
        }
        case ADD_FAULT: {
            const addFaultAction = actions.addFaultAction(action.payload);
            nextState = autoLayoutCanvasReducer(nextState, addFaultAction);
            break;
        }
        case DELETE_FAULT: {
            const deleteFaultAction = actions.deleteFaultAction(action.payload);
            nextState = autoLayoutCanvasReducer(nextState, deleteFaultAction);
            break;
        }
        case ADD_CANVAS_ELEMENT:
        case ADD_SCREEN_WITH_FIELDS:
        case ADD_DECISION_WITH_OUTCOMES:
        case ADD_END_ELEMENT:
        case ADD_WAIT_WITH_WAIT_EVENTS:
        case ADD_PARENT_WITH_CHILDREN: {
            const element = _getElementFromActionPayload(action.payload);
            if (!nextState[element.guid]) {
                nextState[element.guid] = element;
            }

            const insertAt = action.payload.alcInsertAt;
            const children = supportsChildren(element) ? getChildren(element) : null;

            if (children) {
                nextState[element.guid].children = children;
            }
            const nodeType = metadata[element.elementType].type;
            const alcAction = actions.addElementAction(element.guid, nodeType, insertAt);
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            break;
        }
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_DECISION_WITH_OUTCOMES: {
            // redo
            const element = _getElementFromActionPayload(action.payload);
            const updatedChildren = getNextChildren(state[element.guid], element);
            const alcAction = actions.updateChildrenAction(element.guid, updatedChildren);
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            break;
        }
        case DELETE_ELEMENT: {
            const { selectedElements, childIndexToKeep } = action.payload;
            const deletedElement = { ...selectedElements[0] };
            if (deletedElement.childReferences && deletedElement.childReferences.length > 0) {
                // Resetting childReferences since it has already been cleaned up in elements reducer
                deletedElement.childReferences = [];
            }
            const alcAction = actions.deleteElementAction(deletedElement.guid, childIndexToKeep);
            nextState[deletedElement.guid] = deletedElement;
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            delete nextState[deletedElement.guid];
            break;
        }
        case SELECTION_ON_FIXED_CANVAS:
            // TODO: move to autoLayoutCanvasReducer
            nextState = _selectionOnFixedCanvas(
                nextState,
                action.payload.canvasElementGuidsToSelect,
                action.payload.canvasElementGuidsToDeselect,
                action.payload.selectableGuids
            );
            break;
        case PASTE_ON_FIXED_CANVAS:
            // TODO: move to autoLayoutCanvasReducer
            nextState = _pasteOnFixedCanvas(nextState, action.payload);
            break;
        default:
    }

    assertInDev(() => assertAutoLayoutState(nextState));

    return nextState;
}

/**
 * Returns a nulled' children array for a new element that supports children
 *
 * @param element - An element that can have a children
 * @return An nulled array of n children, where n is the number of children the element can have
 */
function getChildren(element: UI.CanvasElement): (Guid | null)[] | null {
    let childCount;
    const { elementType, childReferences } = element;

    if (elementType === ELEMENT_TYPE.LOOP) {
        childCount = 1;
    } else if (childReferences && childReferences.length > 0) {
        childCount = childReferences.length + 1;
    } else {
        return null;
    }

    return Array(childCount).fill(null);
}

/**
 * Computes and returns the new children for an element
 *
 * @param element - The previous state of the element
 * @param nextElement - The next state of the element
 * @return The new children array for the element
 */
function getNextChildren(element, nextElement): (Guid | null)[] {
    const { children } = element;
    const nextChildren = getChildren(nextElement)!;

    // copy over the child corresponding to the default outcome
    nextChildren[nextChildren.length - 1] = children[children.length - 1];

    nextElement.childReferences.forEach((childReference, i) => {
        const currentIndex = element.childReferences.findIndex((ref) => {
            return ref.childReference === childReference.childReference;
        });

        if (currentIndex !== -1) {
            nextChildren[i] = children[currentIndex];
        }
    });

    return nextChildren;
}

function _getElementFromActionPayload(payload) {
    return payload.screen || payload.canvasElement || payload;
}

/**
 * Helper function to handle select mode in the Fixed Layout Canvas. Iterates over all the elements
 * and marks them as selected, deselected or disables the checkbox based on the data received
 *
 * @param elements - current state of elements in the store
 * @param canvasElementGuidsToSelect - Array of canvas elements to be selected
 * @param canvasElementGuidsToDeselect - Array of canvas elements to be deselected
 * @param selectableGuids - Array of canvas element guids that are selectable next
 */
function _selectionOnFixedCanvas(
    elements: Readonly<UI.StoreState>,
    canvasElementGuidsToSelect: Guid[],
    canvasElementGuidsToDeselect: Guid[],
    selectableGuids: Guid[]
) {
    const newState = updateProperties(elements);
    let hasStateChanged = false;

    Object.keys(elements).map((guid) => {
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
 * @param name - existing dev name to make unique
 * @param blacklistNames - blacklisted list of names to check against in addition to store
 * @return new unique dev name
 */
function _getUniquePastedElementName(name: string, blacklistNames: string[] = []) {
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
    const cutOrCopiedChildElementsArray = Object.values(cutOrCopiedChildElements) as any;
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
    const blacklistNames: string[] = [];
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
        newState[prev!].next = canvasElementGuidMap[topCutOrCopiedGuid];
    }

    // Updating next element's prev to the guid of the bottom-most pasted element
    if (next) {
        newState[next!].prev = canvasElementGuidMap[bottomCutOrCopiedGuid];

        // If the next element was a terminal element, then marking the topCutOrCopied element as the terminal element
        if (newState[next!].isTerminal) {
            newState[canvasElementGuidMap[topCutOrCopiedGuid]].isTerminal = true;
        }

        // Deleting the next element's parent, childIndex and isTerminal property
        deleteBranchHeadProperties(newState[next!]);
    }

    if (parent) {
        if (childIndex === FAULT_INDEX) {
            // Updating the parent's fault to to point to the top-most pasted element's guid
            newState[parent!].fault = canvasElementGuidMap[topCutOrCopiedGuid];
        } else {
            // Updating the parent's children to include the top-most pasted element's guid at the right index
            newState[parent!].children[childIndex!] = canvasElementGuidMap[topCutOrCopiedGuid];
        }
    }

    // Adding end elements to the pasted fault branches
    const pastedElementGuids = Object.values(canvasElementGuidMap) as any;
    for (let i = 0; i < pastedElementGuids.length; i++) {
        const pastedElement = newState[pastedElementGuids[i]];
        if (pastedElement.fault) {
            // Adding an end element and connecting it to the last element in the pasted Fault Branch
            const lastFaultBranchElement = findLastElement(newState[pastedElement.fault], newState);
            const endElement = createEndElement({
                prev: lastFaultBranchElement.guid,
                next: null
            }) as any;
            endElement.nodeType = NodeType.END;
            newState[endElement.guid] = endElement;
            lastFaultBranchElement.next = endElement.guid;
        }
    }

    return newState;
}
