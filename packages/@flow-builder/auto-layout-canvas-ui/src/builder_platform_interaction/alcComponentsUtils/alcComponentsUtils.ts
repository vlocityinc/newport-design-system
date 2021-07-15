import { classSet } from 'lightning/utils';

import {
    NodeType,
    getElementMetadata,
    FlowModel,
    ElementsMetadata,
    ParentNodeModel,
    NodeModel,
    Guid,
    BranchHeadNodeModel,
    ConnectorRenderInfo,
    NodeRenderInfo,
    FlowRenderInfo,
    findParentElement,
    findFirstElement,
    getChild,
    Geometry,
    FlowRenderContext,
    hasChildren,
    hasGoToOnNext,
    hasGoToOnBranchHead,
    FAULT_INDEX
} from 'builder_platform_interaction/autoLayoutCanvas';

import { ToggleMenuEvent } from 'builder_platform_interaction/alcEvents';
import { PrivateItemRegisterEvent } from 'builder_platform_interaction/alcEvents';

export interface AutoLayoutCanvasContext {
    isPasteAvailable: boolean;
    mode: AutoLayoutCanvasMode;
}

interface CanvasElementSelectionData {
    canvasElementGuidsToSelect: Guid[];
    canvasElementGuidsToDeselect: Guid[];
    selectableCanvasElementGuids: Guid[];
    topSelectedGuid: Guid | null;
}

enum AutoLayoutCanvasMode {
    DEFAULT = 'default',
    SELECTION = 'selection',
    RECONNECTION = 'reconnection'
}

enum ICON_SHAPE {
    DIAMOND = 'diamond', // Example, Decision
    CIRCLE = 'circle', // Example, Start Element
    SQUARE = 'square'
}

/**
 * @param nodeType - The current node type
 * @returns - True if the element is a system element
 */
function isSystemElement(nodeType: NodeType) {
    switch (nodeType) {
        case NodeType.ROOT:
        case NodeType.START:
        case NodeType.END:
            return true;
        default:
            return false;
    }
}

const ELEMENT_SELECTED_ACTION = 'element_selected_action';
const ELEMENT_DESELECTED_ACTION = 'element_deselected_action';

/**
 * Checks whether to traverse down the chain or not depending on the action the user performed
 *
 * @param action - Selection or Deselection action
 * @param currentBranchElement - Branch Element we are going to traverse
 * @returns - True if we should traverse down
 */
function _shouldTraverseDown(action: string, currentBranchElement: NodeModel): boolean {
    // In case of deselection, we should traverse down only if canvas element is selected
    const shouldTraverseDown =
        action === ELEMENT_SELECTED_ACTION
            ? !!currentBranchElement
            : currentBranchElement && currentBranchElement.config && currentBranchElement.config.isSelected;
    return shouldTraverseDown;
}

/**
 * Gets the branch elements present child branches of a Decision or Pause
 *
 * @param action - Selection or Deselection action
 * @param parentElement - Parent Element of a given tree in the flow
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns - Child element Guids
 */
function _getChildBranchElements(action: string, parentElement: ParentNodeModel, flowModel: FlowModel): Guid[] {
    let branchElementGuidsToSelectOrDeselect: Guid[] = [];
    if (parentElement && parentElement.children && parentElement.children.length > 0) {
        const branchRootsToVisitStack = parentElement.children;

        // Iterating over different branches of a given parent element
        for (let i = 0; i < branchRootsToVisitStack.length; i++) {
            const branchRootGuid = branchRootsToVisitStack[i];
            let currentBranchElement =
                branchRootGuid && !hasGoToOnBranchHead(flowModel, parentElement.guid, i)
                    ? flowModel[branchRootGuid]
                    : null;

            // Traversing down a given branch
            while (
                currentBranchElement != null &&
                _shouldTraverseDown(action, currentBranchElement) &&
                !isSystemElement(currentBranchElement.nodeType)
            ) {
                branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
                // Grabs all the elements in the child and fault branches as needed
                branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
                    _getSubtreeElements(action, currentBranchElement as ParentNodeModel, flowModel)
                );
                currentBranchElement =
                    currentBranchElement.next && !hasGoToOnNext(flowModel, currentBranchElement.guid)
                        ? flowModel[currentBranchElement.next]
                        : null;
            }
        }
    }

    return branchElementGuidsToSelectOrDeselect;
}

/**
 * Gets all the elements present in the Fault branch of a given element
 *
 * @param action - Selection or Deselection action
 * @param element - Parent Element of a given tree in the flow
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns - Fault branch element Guids
 */
function _getFaultBranchElements(action: string, element: NodeModel, flowModel: FlowModel): Guid[] {
    let branchElementGuidsToSelectOrDeselect: Guid[] = [];
    let currentBranchElement =
        element.fault && !hasGoToOnBranchHead(flowModel, element.guid, FAULT_INDEX) ? flowModel[element.fault] : null;

    // Iterate only up till the End Element of the Fault Branch
    while (currentBranchElement != null && !isSystemElement(currentBranchElement.nodeType)) {
        branchElementGuidsToSelectOrDeselect.push(currentBranchElement.guid);
        // Grabs all the elements in the child and fault branches as needed
        branchElementGuidsToSelectOrDeselect = branchElementGuidsToSelectOrDeselect.concat(
            _getSubtreeElements(action, currentBranchElement as ParentNodeModel, flowModel)
        );
        currentBranchElement =
            currentBranchElement.next && !hasGoToOnNext(flowModel, currentBranchElement.guid)
                ? flowModel[currentBranchElement.next]
                : null;
    }

    return branchElementGuidsToSelectOrDeselect;
}

/**
 * Gets all the elements present in the child and/or fault branches of a given parent element
 *
 * @param action - Selection or Deselection action
 * @param parentElement - Parent Element of a given tree in the flow
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns - The subtree elements guids
 */
function _getSubtreeElements(action: string, parentElement: NodeModel, flowModel: FlowModel): Guid[] {
    let canvasElementGuidsArray: Guid[] = [];
    // Getting all the elements present in the child branches based on the selection/deselection action
    if (hasChildren(parentElement)) {
        canvasElementGuidsArray = canvasElementGuidsArray.concat(
            _getChildBranchElements(action, parentElement, flowModel)
        );
    }
    // Getting all the elements present in the fault branch based on the selection/deselection action
    if (parentElement.fault) {
        canvasElementGuidsArray = canvasElementGuidsArray.concat(
            _getFaultBranchElements(action, parentElement, flowModel)
        );
    }

    return canvasElementGuidsArray;
}

/**
 * Helper function to get all the possible elements that can be selected/deselected next
 *
 * @param topSelectedGuid - Guid of the top-most selected element
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @returns selectableCanvasElementGuids - An array containing all the selectable Canvas Element Guids
 */
function _getSelectableCanvasElementGuids(topSelectedGuid: Guid, flowModel: FlowModel): Guid[] {
    let selectableCanvasElementGuids: Guid[] = [];
    if (topSelectedGuid) {
        const topSelectedElement = flowModel[topSelectedGuid];
        let currentCanvasElement = topSelectedElement as NodeModel | null;

        // All the elements in the chain above (excluding the Start Element) should be selectable
        while (currentCanvasElement && !isSystemElement(currentCanvasElement.nodeType)) {
            selectableCanvasElementGuids.push(currentCanvasElement.guid);
            currentCanvasElement =
                flowModel[currentCanvasElement.prev || (currentCanvasElement as BranchHeadNodeModel).parent];
        }

        // Resetting the currentElement to the topSelectedElement to start going down the chain
        currentCanvasElement = topSelectedElement;

        // All the elements in the vertical chain below (such as element.next is not null) should be selectable
        while (currentCanvasElement && !isSystemElement(currentCanvasElement.nodeType)) {
            if (currentCanvasElement.guid !== topSelectedElement.guid) {
                selectableCanvasElementGuids.push(currentCanvasElement.guid);
            }
            // Getting all the selectable elements present in the child and fault branches
            selectableCanvasElementGuids = selectableCanvasElementGuids.concat(
                _getSubtreeElements(ELEMENT_SELECTED_ACTION, currentCanvasElement as ParentNodeModel, flowModel)
            );

            currentCanvasElement =
                currentCanvasElement.next && !hasGoToOnNext(flowModel, currentCanvasElement.guid)
                    ? flowModel[currentCanvasElement.next]
                    : null;
        }
    }

    return selectableCanvasElementGuids;
}

/**
 * Function to get all the selection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param selectedCanvasElementGuid - Guid of the Canvas Element that just got selected
 * @param  topSelectedGuid - Guid of the top-most selected element
 * @returns Selection Data as needed by the store
 */
const getCanvasElementSelectionData = (
    flowModel: FlowModel,
    selectedCanvasElementGuid: Guid,
    topSelectedGuid: Guid | null
): CanvasElementSelectionData => {
    let canvasElementGuidsToSelect: Guid[] = [];

    const selectedCanvasElement = flowModel[selectedCanvasElementGuid];
    if (!topSelectedGuid) {
        // If there's no topSelectedGuid, it means that this is the first element being selected
        topSelectedGuid = selectedCanvasElement.guid;
        canvasElementGuidsToSelect.push(selectedCanvasElement.guid);
    } else {
        let currentCanvasElement = selectedCanvasElement;

        // Going up the chain to find the first selected element and pushing all the elements in between into
        // canvasElementGuidsToSelect
        while (currentCanvasElement && currentCanvasElement.config && !currentCanvasElement.config.isSelected) {
            canvasElementGuidsToSelect.push(currentCanvasElement.guid);
            if (currentCanvasElement.prev) {
                currentCanvasElement = flowModel[currentCanvasElement.prev];
                // In case the element supports children, all it's branches need to be marked as selected as well
                if (hasChildren(currentCanvasElement)) {
                    canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                        _getChildBranchElements(
                            ELEMENT_SELECTED_ACTION,
                            currentCanvasElement as ParentNodeModel,
                            flowModel
                        )
                    );
                }
            } else if ((currentCanvasElement as BranchHeadNodeModel).parent) {
                currentCanvasElement = flowModel[(currentCanvasElement as BranchHeadNodeModel).parent];
            }

            // In case we reach the start element without having found any selected element, then that means that our
            // topSelectedGuid is somewhere in the chain below. Hence emptying the canvasElementGuidsToSelect array
            // and breaking out of the loop
            if (currentCanvasElement.nodeType === NodeType.START) {
                canvasElementGuidsToSelect = [];
                break;
            }
        }

        // If canvasElementGuidsToSelect's length is 0 then that means that no selected element was found in the
        // chain above
        if (canvasElementGuidsToSelect.length === 0) {
            currentCanvasElement = flowModel[topSelectedGuid];

            // Going up the chain from topSelectedElement's previous/parent canvas element to find the selected
            // canvas element and pushing all the elements in between into canvasElementGuidsToSelect
            while (currentCanvasElement && currentCanvasElement.guid !== selectedCanvasElementGuid) {
                if (currentCanvasElement.guid !== topSelectedGuid) {
                    canvasElementGuidsToSelect.push(currentCanvasElement.guid);
                }

                if (currentCanvasElement.prev) {
                    currentCanvasElement = flowModel[currentCanvasElement.prev];
                    // In case the element supports children, all it's branches need to be marked as selected as well
                    if (hasChildren(currentCanvasElement)) {
                        canvasElementGuidsToSelect = canvasElementGuidsToSelect.concat(
                            _getChildBranchElements(
                                ELEMENT_SELECTED_ACTION,
                                currentCanvasElement as ParentNodeModel,
                                flowModel
                            )
                        );
                    }
                } else if ((currentCanvasElement as BranchHeadNodeModel).parent) {
                    currentCanvasElement = flowModel[(currentCanvasElement as BranchHeadNodeModel).parent];
                }
            }

            // Pushing the newly selected Canvas Element into the canvasElementGuidsToSelect array
            canvasElementGuidsToSelect.push(selectedCanvasElementGuid);

            // Resetting topSelectedGuid to selectedCanvasElementGuid
            topSelectedGuid = selectedCanvasElementGuid;
        }
    }

    return {
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect: [],
        selectableCanvasElementGuids: _getSelectableCanvasElementGuids(topSelectedGuid, flowModel),
        topSelectedGuid
    };
};

/**
 * Function to get all the deselection data which includes canvasElementGuidsToSelect, canvasElementGuidsToDeselect,
 * selectableCanvasElementGuids and the updated topSelectedGuid
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param deselectedCanvasElementGuid - Guid of the Canvas Element that just got deselected
 * @param topSelectedGuid - Guid of the top-most selected element
 * @returns Deselection Data as needed by the store
 */
const getCanvasElementDeselectionData = (
    flowModel: FlowModel,
    deselectedCanvasElementGuid: Guid,
    topSelectedGuid: Guid | null
): CanvasElementSelectionData => {
    const deselectedCanvasElement = flowModel[deselectedCanvasElementGuid];
    let canvasElementGuidsToDeselect: Guid[] = [];

    if (deselectedCanvasElementGuid === topSelectedGuid) {
        // Top-most element is being deselected, we don't need to deselect anything else. Just have to reset the
        // topSelectedGuid to the next selected element (if any). In case the next element is not selected, reset
        // topSelectedGuid to null
        const nextCanvasElement =
            deselectedCanvasElement.next && !hasGoToOnNext(flowModel, deselectedCanvasElement.guid)
                ? flowModel[deselectedCanvasElement.next]
                : null;
        if (nextCanvasElement && nextCanvasElement.config && nextCanvasElement.config.isSelected) {
            topSelectedGuid = nextCanvasElement.guid;
        } else {
            topSelectedGuid = null;
        }

        // Pushing the deselected element to the canvasElementGuidsToDeselect array
        canvasElementGuidsToDeselect.push(deselectedCanvasElementGuid);

        // Getting all the child and fault branch elements to deselect
        canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
            _getSubtreeElements(ELEMENT_DESELECTED_ACTION, deselectedCanvasElement as ParentNodeModel, flowModel)
        );
    } else {
        let currentCanvasElement = deselectedCanvasElement as NodeModel | null;
        // Deselecting one of the middle elements, should deselect everything else in the vertical chain
        // (i.e. till the the point element.next is not null) below as well
        while (currentCanvasElement && currentCanvasElement.config && currentCanvasElement.config.isSelected) {
            canvasElementGuidsToDeselect.push(currentCanvasElement.guid);

            // Getting all the child and fault branch elements to deselect
            canvasElementGuidsToDeselect = canvasElementGuidsToDeselect.concat(
                _getSubtreeElements(ELEMENT_DESELECTED_ACTION, currentCanvasElement as ParentNodeModel, flowModel)
            );

            currentCanvasElement =
                currentCanvasElement.next && !hasGoToOnNext(flowModel, currentCanvasElement.guid)
                    ? flowModel[currentCanvasElement.next]
                    : null;
        }
    }

    // In the case where topSelectedGuid doesn't exist, everything is selectable. Just passing an empty array
    // in that scenario
    return {
        canvasElementGuidsToSelect: [],
        canvasElementGuidsToDeselect,
        selectableCanvasElementGuids: topSelectedGuid
            ? _getSelectableCanvasElementGuids(topSelectedGuid, flowModel)
            : [],
        topSelectedGuid
    };
};

/**
 * Function to get the guid of the first selectable element on the canvas
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param elementGuid - Guid of the element being checked
 * @returns Guid of the first selectable element or undefined if no element is selectable
 */
const getFirstSelectableElementGuid = (flowModel: FlowModel, elementGuid: Guid): Guid | undefined => {
    const currentCanvasElement = flowModel[elementGuid] as ParentNodeModel;
    if (
        !isSystemElement(currentCanvasElement.nodeType) &&
        currentCanvasElement.config &&
        currentCanvasElement.config.isSelectable
    ) {
        return currentCanvasElement.guid;
    }

    if (hasChildren(currentCanvasElement)) {
        // Traversing down the branches to find the first selectable element
        for (let i = 0; i < currentCanvasElement.children.length; i++) {
            const childGuid = currentCanvasElement.children[i];
            if (childGuid && !hasGoToOnBranchHead(flowModel, currentCanvasElement.guid, i)) {
                const selectableElementGuid = getFirstSelectableElementGuid(flowModel, childGuid);
                if (selectableElementGuid) {
                    return selectableElementGuid;
                }
            }
        }
    }

    if (currentCanvasElement.fault && !hasGoToOnBranchHead(flowModel, currentCanvasElement.guid, FAULT_INDEX)) {
        // Traversing down the fault branch to find the first selectable element
        const selectableElementGuid = getFirstSelectableElementGuid(flowModel, currentCanvasElement.fault);
        if (selectableElementGuid) {
            return selectableElementGuid;
        }
    }

    if (currentCanvasElement.next && !hasGoToOnNext(flowModel, currentCanvasElement.guid)) {
        // Traversing down to the next element to find the first selectable element
        const selectableElementGuid = getFirstSelectableElementGuid(flowModel, currentCanvasElement.next);
        if (selectableElementGuid) {
            return selectableElementGuid;
        }
    }

    return undefined;
};

/**
 * Util functions for alc components
 */

const CLASS_MENU_OPENED = 'menu-opened';
const CLASS_IS_NEW = 'is-new';
const DYNAMIC_NODE_COMPONENT = 'dynamic-node-component';

/**
 * @param cssEntries - css
 * @returns The Css
 */
function getCssStyle(cssEntries): string {
    return Object.entries(cssEntries)
        .map((entry) => `${entry[0]}: ${entry[1]}px`)
        .join(';');
}

/**
 * Returns a css style string for a Geometry object
 *
 * @param obj geometry object
 * @param obj.x - The x position of the top left corner of the rectangle.
 * @param obj.y - The y position of the top left corner of the rectangle.
 * @param obj.w - The width of the rectangle
 * @param obj.h - The height of the rectangle
 * @returns A css style string for the geometry
 */
function getStyleFromGeometry({ x, y, w, h }: { x?: number; y?: number; w?: number; h?: number }): string {
    return getCssStyle({
        left: x,
        top: y,
        width: w,
        height: h
    });
}

/**
 * Get the data needed to render a alcConnector component
 *
 * @param connectorInfo - Info about a connector
 * @returns The alcConnector component data
 */
function getAlcConnectorData(connectorInfo: ConnectorRenderInfo) {
    return {
        key: connectorKey(connectorInfo),
        connectorInfo,
        style: getStyleFromGeometry(connectorInfo.geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a alcFlow component
 *
 * @param flowInfo - Info about a flow
 * @param parentNodeInfo - The flow's parent node info
 * @param childIndex - The flow's childIndex
 * @returns The alcFlow component data
 */
function getAlcFlowData(flowInfo: FlowRenderInfo, parentNodeInfo: NodeRenderInfo, childIndex: number) {
    return {
        key: `flow-${parentNodeInfo.guid}-${childIndex}`,
        flowInfo,
        style: getStyleFromGeometry(flowInfo.geometry),
        className: ''
    };
}

/**
 * Get the data needed to render a alcCompoundNode component
 *
 * @param nodeInfo - Info about a node
 * @returns The alcCompoundNode component data
 */
function getAlcCompoundNodeData(nodeInfo: NodeRenderInfo) {
    const { geometry, guid } = nodeInfo;
    const className = classSet({ [CLASS_IS_NEW]: nodeInfo.isNew });

    const faultFlow = nodeInfo.faultFlow ? getAlcFlowData(nodeInfo.faultFlow, nodeInfo, -1) : null;

    // let the browser manage the width
    const geo = { ...geometry, w: undefined };

    return {
        key: guid,
        nodeInfo,
        style: getStyleFromGeometry(geo),
        className,
        faultFlow
    };
}

/**
 * Get the data needed to render a alcNode component
 *
 * @param nodeInfo - Info about a node
 * @returns The alcNode component data
 */
function getAlcNodeData(nodeInfo: NodeRenderInfo) {
    const { guid, menuOpened } = nodeInfo;
    const { dynamicNodeComponent, dynamicNodeComponentSelector } = nodeInfo.metadata;

    const className = classSet({
        [CLASS_MENU_OPENED]: menuOpened,
        [DYNAMIC_NODE_COMPONENT]: !!dynamicNodeComponent
    }).toString();

    return {
        key: guid,
        nodeInfo,
        className,
        style: '',
        dynamicNodeComponent,
        dynamicNodeComponentSelector
    };
}

/**
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param parentElement - Parent Element of a given tree in the flow
 * @param elementsMetadata - Contains elementType -> data map
 * @returns - True if the element is in a loop
 */
function isInLoop(flowModel: FlowModel, parentElement: ParentNodeModel, elementsMetadata: ElementsMetadata) {
    let parentType = getElementMetadata(elementsMetadata, parentElement.elementType).type;

    while (parentType !== NodeType.ROOT && parentType != null) {
        if (parentType === NodeType.LOOP) {
            return true;
        }

        parentElement = findParentElement(parentElement, flowModel);
        parentType = getElementMetadata(elementsMetadata, parentElement.elementType).type;
    }

    return false;
}

/**
 * @param detail - Event detail
 * @param containerElementGeometry - Geometry of the container element
 * @param menuButtonHalfWidth - The half-width of the menu trigger button
 * @param scale - scale factor
 * @param needToPosition - True means element need to position
 * @returns - The menu style
 */
export function getMenuStyle(detail, containerElementGeometry, menuButtonHalfWidth, scale, needToPosition) {
    let { left, top } = detail;
    const { x, y } = containerElementGeometry;

    left = left - x + detail.offsetX + menuButtonHalfWidth;
    top -= y;

    return needToPosition
        ? 'opacity: 0'
        : getStyleFromGeometry({
              x: left * (1 / scale),
              y: (top + detail.height / 2) * (1 / scale)
          });
}

/**
 * Dispatches a privateitemregister event to register a child component with its parent
 *
 * @param component The component to register
 * @event privateitemregister always dispatched
 */
export function dispatchPrivateItemRegister(component) {
    component.dispatchEvent(new PrivateItemRegisterEvent(component));
}
/**
 * Creates an object with the properties needed to render the node + connector menus
 *
 * @param event - The toggle menu event
 * @param menuButtonHalfWidth - The half-width of the menu trigger button
 * @param containerElementGeometry - Geometry of the container element
 * @param scale - scale factor
 * @param context - The flow rendering context
 * @param needToPosition - True means element need to position
 * @returns object with menu properties
 */
function getAlcMenuData(
    event: ToggleMenuEvent,
    menuButtonHalfWidth: number,
    containerElementGeometry: Geometry,
    scale: number,
    context: FlowRenderContext,
    needToPosition = false
) {
    const detail = event.detail;

    const { guid, prev, next, parent, childIndex } = detail;

    const { flowModel, elementsMetadata } = context;

    const style = getMenuStyle(detail, containerElementGeometry, menuButtonHalfWidth, scale, needToPosition);
    const canHaveFaultConnector = guid && flowModel[guid].canHaveFaultConnector;

    const elementHasFault = guid ? flowModel[guid].fault : false;
    const targetGuid = childIndex != null ? getChild(flowModel[parent!], childIndex) : next;

    const targetElement = targetGuid != null ? flowModel[targetGuid] : null;

    let canMergeEndedBranch = false;
    let isTargetEnd = false;
    let isGoToConnector = false;
    if (targetElement != null) {
        // Checking for GoTo on branchHead and setting canMergeEndedBranch accordingly
        if (parent && childIndex != null && hasGoToOnBranchHead(flowModel, parent, childIndex)) {
            canMergeEndedBranch =
                childIndex !== FAULT_INDEX &&
                getElementMetadata(elementsMetadata, flowModel[parent].elementType).type !== NodeType.ROOT;
            isGoToConnector = true;
        } else {
            const isNextGoTo = prev && next && hasGoToOnNext(flowModel, prev);
            const targetBranchHeadElement = isNextGoTo
                ? findFirstElement(flowModel[prev!], flowModel)
                : findFirstElement(targetElement, flowModel);
            const targetParentElement = flowModel[targetBranchHeadElement.parent];
            const isTargetParentRoot =
                getElementMetadata(elementsMetadata, targetParentElement.elementType).type === NodeType.ROOT;

            if (isNextGoTo) {
                canMergeEndedBranch = targetBranchHeadElement.childIndex !== FAULT_INDEX && !isTargetParentRoot;
                isGoToConnector = true;
            } else {
                isTargetEnd = getElementMetadata(elementsMetadata, targetElement.elementType).type === NodeType.END;
                canMergeEndedBranch =
                    targetBranchHeadElement.childIndex !== FAULT_INDEX && !isTargetParentRoot && isTargetEnd;
            }
        }
    }

    const parentElement = (parent != null
        ? flowModel[parent]
        : findParentElement(flowModel[guid!], flowModel)) as ParentNodeModel;

    const hasEndElement = targetGuid == null && !isInLoop(flowModel, parentElement, elementsMetadata);
    const canAddGoto = isTargetEnd || hasEndElement;
    return {
        canMergeEndedBranch,
        canAddGoto,
        hasEndElement,
        canHaveFaultConnector,
        elementHasFault,
        ...detail,
        connectorMenu: detail.type,
        next: targetGuid,
        style,
        isGoToConnector
    };
}

/**
 * Creates a unique key for a connector
 *
 * @param connectorInfo - The connector render info
 * @returns a string key
 */
function connectorKey(connectorInfo: ConnectorRenderInfo): string {
    const { connectionInfo, type } = connectorInfo;
    const { prev, next, parent, childIndex } = connectionInfo;
    const suffix = prev ? `${prev}:${next}` : `${parent}:${childIndex}`;
    return `connector-${type}-${suffix}`;
}

export {
    ICON_SHAPE,
    AutoLayoutCanvasMode,
    connectorKey,
    getCssStyle,
    getStyleFromGeometry,
    getAlcNodeData,
    getAlcCompoundNodeData,
    getAlcFlowData,
    getAlcConnectorData,
    getAlcMenuData,
    getCanvasElementSelectionData,
    getCanvasElementDeselectionData,
    getFirstSelectableElementGuid
};
