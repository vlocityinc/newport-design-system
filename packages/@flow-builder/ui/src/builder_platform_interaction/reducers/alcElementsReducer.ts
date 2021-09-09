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
    CREATE_GOTO_CONNECTION,
    ADD_PARENT_WITH_CHILDREN,
    DECORATE_CANVAS,
    CLEAR_CANVAS_DECORATION,
    MODIFY_START_WITH_SCHEDULED_PATHS,
    DELETE_GOTO_CONNECTION
} from 'builder_platform_interaction/actions';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { deepCopy } from 'builder_platform_interaction/storeLib';
import { isDevNameInStore } from 'builder_platform_interaction/storeUtils';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import elementsReducer from './elementsReducer';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { getElementsMetadata, getAlcElementType, getChildCount } from 'builder_platform_interaction/alcCanvasUtils';

import {
    deleteBranchHeadProperties,
    FAULT_INDEX,
    FOR_EACH_INDEX,
    START_IMMEDIATE_INDEX,
    HighlightInfo,
    findLastElement,
    findParentElement,
    assertInDev,
    assertAutoLayoutState,
    reducer,
    actions,
    Guid,
    FlowModel,
    fulfillsBranchingCriteria,
    ParentNodeModel,
    hasGoTo,
    getConnectionTarget,
    deleteGoToConnection,
    createGoToConnection,
    removeGoTosFromElement,
    findFirstElement,
    NodeType,
    setChild,
    getValuesFromConnectionSource
} from 'builder_platform_interaction/autoLayoutCanvas';

import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';

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

/* eslint-disable-next-line complexity */
/**
 * ALC Reducer for elements
 *
 * @param state - elements in the store
 * @param action - with type and payload
 * @returns new state after reduction
 */
export default function alcElementsReducer(state: Readonly<UI.Elements>, action: any): Readonly<UI.Elements> {
    const metadata = getElementsMetadata();

    const statePostElementReducer = elementsReducer(state, action);
    let nextState = deepCopy(statePostElementReducer);
    const elementService = getElementService(nextState);
    const autoLayoutCanvasReducer = reducer(elementService);

    switch (action.type) {
        case ADD_START_ELEMENT: {
            const startElement = action.payload;
            nextState[startElement.guid] = startElement;
            startElement.nodeType = NodeType.START;

            const endElementGuid = elementService.createEndElement();
            const initAction = actions.initAction(action.payload.guid, endElementGuid);
            nextState = autoLayoutCanvasReducer(nextState, initAction);
            break;
        }

        case CREATE_GOTO_CONNECTION: {
            const { source, target, isReroute } = action.payload;
            const createGoToConnectionAction = actions.createGoToConnectionAction(source, target, isReroute);
            nextState = autoLayoutCanvasReducer(nextState, createGoToConnectionAction);
            break;
        }
        case DELETE_GOTO_CONNECTION: {
            const { source } = action.payload;
            const deleteGoToConnectionAction = actions.deleteGoToConnectionAction(source.guid, source.childIndex);
            nextState = autoLayoutCanvasReducer(nextState, deleteGoToConnectionAction);
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
            element.nodeType = getAlcElementType(element.elementType);

            if (!nextState[element.guid]) {
                nextState[element.guid] = element;
            }

            const source = action.payload.alcConnectionSource;
            const children = getChildren(element);

            if (children) {
                nextState[element.guid].children = children;
            }
            const nodeType = metadata[element.elementType].type;
            const alcAction = actions.addElementAction(element.guid, nodeType, source);
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            break;
        }
        case MODIFY_WAIT_WITH_WAIT_EVENTS:
        case MODIFY_DECISION_WITH_OUTCOMES: {
            // redo
            const element = _getElementFromActionPayload(action.payload);
            const originalChildReferences = deepCopy((state[element.guid] as ParentNodeModel).childReferences);
            const updatedChildReferences = deepCopy(nextState[element.guid].childReferences);
            nextState[element.guid].childReferences = originalChildReferences;
            const alcAction = actions.updateChildrenAction(element.guid, updatedChildReferences);
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            break;
        }
        case MODIFY_START_WITH_SCHEDULED_PATHS: {
            // TODO: refactor this code, almost identical as above
            const element = _getElementFromActionPayload(action.payload);
            const originalChildReferences = deepCopy((state[element.guid] as ParentNodeModel).childReferences);
            const updatedChildReferences = deepCopy(nextState[element.guid].childReferences);
            nextState[element.guid].childReferences = originalChildReferences;
            const alcAction = actions.updateChildrenOnAddingOrUpdatingScheduledPathsAction(
                element.guid,
                updatedChildReferences
            );
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            break;
        }
        case DELETE_ELEMENT: {
            const { selectedElements, childIndexToKeep } = action.payload;
            const deletedElement = deepCopy(selectedElements[0]);
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
                action.payload.selectableGuids,
                action.payload.allowAllDisabledElements
            );
            break;
        case PASTE_ON_FIXED_CANVAS:
            // TODO: move to autoLayoutCanvasReducer
            nextState = _pasteOnFixedCanvas(nextState, action.payload);
            break;
        case DECORATE_CANVAS: {
            const decoratedElements = getDecoratedElements(nextState, action.payload.connectorsToHighlight);
            const alcAction = actions.decorateCanvasAction(decoratedElements);
            nextState = autoLayoutCanvasReducer(nextState, alcAction);
            break;
        }
        case CLEAR_CANVAS_DECORATION:
            nextState = autoLayoutCanvasReducer(nextState, actions.clearCanvasDecorationAction());
            break;

        default:
            if (state === statePostElementReducer) {
                nextState = state;
            }
            break;
    }

    assertInDev(() => assertAutoLayoutState(nextState));

    return nextState;
}

/**
 * Returns a nulled' children array for a new element that supports children
 *
 * @param element - An element that can have a children
 * @returns An nulled array of n children, where n is the number of children the element can have
 */
function getChildren(element: ParentNodeModel): (Guid | null)[] | null {
    const childCount = getChildCount(element);
    return childCount != null ? Array(childCount).fill(null) : null;
}

/**
 * Computes which branch index to highlight on a given element based on connector type or child reference
 *
 * @param element store element
 * @param connectorType connector type to highlight
 * @param childReference child guid associated with the connector to highlight (eg. outcome guid)
 * @returns - The branch index to highlight
 */
function getBranchIndexToHighlight(
    element: ParentNodeModel,
    connectorType: string,
    childReference?: Guid
): number | null {
    let branchIndexToHighlight: number | null = null;

    const { childReferences, children } = element;

    if (connectorType === CONNECTOR_TYPE.FAULT && element.fault) {
        branchIndexToHighlight = FAULT_INDEX;
    } else if (connectorType === CONNECTOR_TYPE.DEFAULT) {
        branchIndexToHighlight = childReferences.length;
    } else if (connectorType === CONNECTOR_TYPE.LOOP_NEXT) {
        branchIndexToHighlight = FOR_EACH_INDEX;
    } else if (connectorType === CONNECTOR_TYPE.IMMEDIATE && children) {
        branchIndexToHighlight = START_IMMEDIATE_INDEX;
    } else if (childReferences != null && childReference) {
        branchIndexToHighlight = childReferences.findIndex((ref) => {
            return ref.childReference === childReference;
        });
        if (element.nodeType === NodeType.START) {
            branchIndexToHighlight! += 1; // To account for the immediate path at index 0
        }
    }

    return branchIndexToHighlight;
}

/**
 * Helper function to update highlight info on a parent element and include a merge branch index to highlight
 *
 * @param parentHighlightInfo HighlightInfo object on parent element
 * @param mergeBranchIndexToHighlight index of the merge branch to be highlighted on parent element
 */
function setMergeBranchIndexesToHighlight(parentHighlightInfo: HighlightInfo, mergeBranchIndexToHighlight: number) {
    parentHighlightInfo.mergeBranchIndexesToHighlight = parentHighlightInfo.mergeBranchIndexesToHighlight || [];
    if (!parentHighlightInfo.mergeBranchIndexesToHighlight.includes(mergeBranchIndexToHighlight)) {
        parentHighlightInfo.mergeBranchIndexesToHighlight.push(mergeBranchIndexToHighlight);
    }
}

/**
 * Helper function to get the list of elements to decorate after the decorate canvas action is fired
 *
 * @param state flow state
 * @param connectorsToHighlight array of connectors to highlight from the decorate action payload
 * @returns List of decorated elements
 */
function getDecoratedElements(state: FlowModel, connectorsToHighlight: any[]): Map<Guid, HighlightInfo> {
    const decoratedElements = new Map<Guid, HighlightInfo>();
    connectorsToHighlight.forEach((connector) => {
        const elementGuid = connector.source;
        const element = state[elementGuid];
        const highlightInfo = decoratedElements.get(elementGuid) || {};
        const elementAsParent = element as ParentNodeModel;
        const branchIndexToHighlight = getBranchIndexToHighlight(
            elementAsParent,
            connector.type,
            connector.childSource
        );
        if (branchIndexToHighlight != null) {
            highlightInfo.branchIndexesToHighlight = highlightInfo.branchIndexesToHighlight || [];
            if (!highlightInfo.branchIndexesToHighlight.includes(branchIndexToHighlight)) {
                highlightInfo.branchIndexesToHighlight.push(branchIndexToHighlight);
            }
            // For branching elements that don't have any elements or End in the branch to highlight,
            // set highlightNext to true to indicate that we need to highlight the merge point after the highlighted branch
            if (
                fulfillsBranchingCriteria(element, element.nodeType) &&
                branchIndexToHighlight !== FAULT_INDEX &&
                !elementAsParent.children[branchIndexToHighlight]
            ) {
                highlightInfo.highlightNext = true;
                setMergeBranchIndexesToHighlight(highlightInfo, branchIndexToHighlight);
            }

            // For loop elements that don't have any elements in the loop back branch, directly set highlightLoopBack to true
            if (
                element.nodeType === NodeType.LOOP &&
                branchIndexToHighlight === FOR_EACH_INDEX &&
                !elementAsParent.children[branchIndexToHighlight]
            ) {
                highlightInfo.highlightLoopBack = true;
            }
        } else if (connector.type !== CONNECTOR_TYPE.FAULT && !fulfillsBranchingCriteria(element, element.nodeType)) {
            // If no branch index to highlight was found and the element is not a branching
            // or error-ed element, just set highlightNext to true
            highlightInfo.highlightNext = true;
        }

        // Once we get to an element that does not have a next (i.e. it is within a merged branch or loop),
        // go up it's branch chain to it's parent element to highlight merge points correctly
        if (!element.next && highlightInfo.highlightNext) {
            let parentElement = findParentElement(element, state);
            let branchHeadElement = findFirstElement(element, state);
            let mergeBranchIndexToHighlight = branchHeadElement.childIndex;

            // If the parent is a not a loop and not a branch with a next element,
            // set highlightNext so that we highlight the merge point after it's branches
            // Also, set the index for which of it's merge branches need to be highlighted
            // Finally, keep going up it's branch chain to do the same for all it's parents that meet the same criteria
            while (parentElement.nodeType !== NodeType.LOOP && !parentElement.next) {
                const parentHighlightInfo = decoratedElements.get(parentElement.guid) || {};
                parentHighlightInfo.highlightNext = true;
                setMergeBranchIndexesToHighlight(parentHighlightInfo, mergeBranchIndexToHighlight);
                decoratedElements.set(parentElement.guid, parentHighlightInfo);

                branchHeadElement = findFirstElement(parentElement, state);
                mergeBranchIndexToHighlight = branchHeadElement && branchHeadElement.childIndex;
                parentElement = findParentElement(parentElement, state);
            }

            // If the final parent is a loop element, highlight the end of the loop back connector,
            // else it is a branch element whose next and merge branch also need to be highlighted
            const parentHighlightInfo = decoratedElements.get(parentElement.guid) || {};
            if (parentElement.nodeType === NodeType.LOOP) {
                parentHighlightInfo.highlightLoopBack = true;
            } else {
                parentHighlightInfo.highlightNext = true;
                setMergeBranchIndexesToHighlight(parentHighlightInfo, mergeBranchIndexToHighlight);
            }
            decoratedElements.set(parentElement.guid, parentHighlightInfo);
        }

        decoratedElements.set(elementGuid, highlightInfo);
    });

    return decoratedElements;
}

/**
 * @param payload - The action payload
 * @returns The element
 */
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
 * @param allowAllDisabledElements - True if disabled elements are allowed
 * @returns The new state
 */
function _selectionOnFixedCanvas(
    elements: Readonly<UI.StoreState>,
    canvasElementGuidsToSelect: Guid[],
    canvasElementGuidsToDeselect: Guid[],
    selectableGuids: Guid[],
    allowAllDisabledElements: boolean
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

            // When selectableGuids is an empty array and allowAllDisabledElements is false, we mark everything as selectable
            if (selectableGuids.length === 0 && !allowAllDisabledElements) {
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
                        hasError: newState[guid].config.hasError,
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
 * @returns new unique dev name
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
 * @param cutOrCopiedChildElements - list of child elements to paste
 * @param blacklistNames - blacklisted list of names to check against in addition to store
 * @returns List of child elements
 */
function _getPastedChildElementNameMap(cutOrCopiedChildElements: UI.Element[], blacklistNames: string[]) {
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
 *
 * @param elements - State of elements in the store
 * @param payload - Contains the data needed for pasting the cut or copied elements
 * @param payload.canvasElementGuidMap - List of Element Guid
 * @param payload.childElementGuidMap - List of child element guid
 * @param payload.cutOrCopiedCanvasElements - the cutOrCopiedCanvasElements
 * @param payload.cutOrCopiedChildElements - the cutOrCopiedChildElements
 * @param payload.topCutOrCopiedGuid - the topCutOrCopiedGuid
 * @param payload.bottomCutOrCopiedGuid - the bottomCutOrCopiedGuid
 * @param payload.source - The connection source
 * @returns newState - The updated state of elements in the store
 */
function _pasteOnFixedCanvas(
    elements: any,
    {
        canvasElementGuidMap,
        childElementGuidMap,
        cutOrCopiedCanvasElements,
        cutOrCopiedChildElements,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        source
    }
) {
    let newState = { ...elements };

    const { prev, parent, childIndex } = getValuesFromConnectionSource(source);

    let savedGoto;

    if (hasGoTo(newState, source)) {
        savedGoto = getConnectionTarget(newState, source);
        newState = deleteGoToConnection(getElementService(newState), newState, source);
    }

    const next = getConnectionTarget(newState, source);

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

        const pastedElement = removeGoTosFromElement(
            cutOrCopiedCanvasElements,
            deepCopy(cutOrCopiedCanvasElements[elementGuidsToPaste[i]])
        );

        const { pastedCanvasElement, pastedChildElements = {} } =
            elementConfig &&
            elementConfig.factory &&
            elementConfig.factory.pasteElement &&
            elementConfig.factory.pasteElement({
                canvasElementToPaste: pastedElement,
                newGuid: pastedElementGuid,
                newName: pastedElementName,
                canvasElementGuidMap,
                childElementGuidMap,
                childElementNameMap,
                cutOrCopiedChildElements,
                topCutOrCopiedGuid,
                bottomCutOrCopiedGuid,
                source,
                next
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
        if (newState[next].isTerminal) {
            newState[canvasElementGuidMap[topCutOrCopiedGuid]].isTerminal = true;
        }

        // Deleting the next element's parent, childIndex and isTerminal property
        deleteBranchHeadProperties(newState[next]);
    }

    if (parent != null) {
        // Updating the parent's child to to point to the top-most pasted element's guid
        setChild(newState[parent!], childIndex!, newState[canvasElementGuidMap[topCutOrCopiedGuid]], !!savedGoto);
    }

    // Adding end elements to the pasted fault branches
    const pastedElementGuids = Object.values(canvasElementGuidMap) as Guid[];
    for (let i = 0; i < pastedElementGuids.length; i++) {
        const pastedElement = newState[pastedElementGuids[i]];
        if (pastedElement.fault) {
            // Adding an end element and connecting it to the last element in the pasted Fault Branch
            const lastFaultBranchElement = findLastElement(newState[pastedElement.fault], newState);
            const endElement = createEndElement({
                prev: lastFaultBranchElement.guid,
                next: null
            });
            endElement.nodeType = NodeType.END;
            newState[endElement.guid] = endElement;
            lastFaultBranchElement.next = endElement.guid;
        }
    }

    return savedGoto
        ? createGoToConnection(
              getElementService(newState),
              newState,
              { guid: canvasElementGuidMap[bottomCutOrCopiedGuid] },
              savedGoto,
              false
          )
        : newState;
}
