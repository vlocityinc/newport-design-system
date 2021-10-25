import { classSet } from 'lightning/utils';
import {
    NodeType,
    getElementMetadata,
    FlowModel,
    ParentNodeModel,
    NodeModel,
    NodeRef,
    Guid,
    BranchHeadNodeModel,
    ConnectorRenderInfo,
    NodeRenderInfo,
    FlowRenderInfo,
    Geometry,
    FlowRenderContext,
    hasChildren,
    hasGoToOnNext,
    hasGoToOnBranchHead,
    hasGoTo,
    FAULT_INDEX,
    shouldSupportScheduledPaths,
    getFirstNonNullNext,
    isGoingBackToAncestorLoop,
    ConnectionSource,
    getConnectionTarget,
    FOR_EACH_INDEX,
    START_IMMEDIATE_INDEX,
    findParentElement
} from 'builder_platform_interaction/autoLayoutCanvas';

import { ToggleMenuEvent } from 'builder_platform_interaction/alcEvents';
import { PrivateItemRegisterEvent } from 'builder_platform_interaction/alcEvents';
import { LABELS } from './alcComponentsUtilsLabels';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

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

const SELECTORS = {
    node: 'builder_platform_interaction-alc-node',
    xLazy: 'x-lazy',
    flow: 'builder_platform_interaction-alc-flow'
};

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

const DELIMITER = ', ';

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
 * @param source - The connection source
 * @returns The alcFlow component data
 */
function getAlcFlowData(flowInfo: FlowRenderInfo, source: ConnectionSource) {
    const { guid, childIndex } = source;

    return {
        key: `flow-${guid}-${childIndex}`,
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

    const faultFlow = nodeInfo.faultFlow
        ? getAlcFlowData(nodeInfo.faultFlow, { guid: nodeInfo.guid, childIndex: FAULT_INDEX })
        : null;

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
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param nodeInfo - Info about a node
 * @returns The alcNode component data
 */
function getAlcNodeData(flowModel: FlowModel, nodeInfo: NodeRenderInfo) {
    const { guid, menuOpened } = nodeInfo;
    const { dynamicNodeComponent, dynamicNodeComponentSelector } = nodeInfo.metadata;

    const className = classSet({
        [CLASS_MENU_OPENED]: menuOpened,
        [DYNAMIC_NODE_COMPONENT]: !!dynamicNodeComponent
    }).toString();

    const nodeDescription = getNodeAriaInfo(flowModel, nodeInfo);

    return {
        key: guid,
        nodeInfo,
        className,
        style: '',
        dynamicNodeComponent,
        dynamicNodeComponentSelector,
        nodeDescription
    };
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

    const { guid } = detail.source;
    const { flowModel, elementsMetadata } = context;

    const style = getMenuStyle(detail, containerElementGeometry, menuButtonHalfWidth, scale, needToPosition);
    const canHaveFaultConnector = guid && flowModel[guid].canHaveFaultConnector;

    const elementHasFault = guid ? flowModel[guid].fault : false;
    const targetGuid = detail.source ? getConnectionTarget(flowModel, detail.source) : null;

    const targetElement = targetGuid != null ? flowModel[targetGuid] : null;
    const isGoToConnector = hasGoTo(flowModel, detail.source);
    const isTargetEnd =
        targetElement != null &&
        getElementMetadata(elementsMetadata, targetElement.elementSubtype || targetElement.elementType).type ===
            NodeType.END;

    const hasEndElement = targetGuid == null;
    const canAddGoto = isTargetEnd || hasEndElement;
    return {
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
    const { source, type } = connectorInfo;
    const { guid, childIndex } = source;
    const suffix = childIndex == null ? `${guid}` : `${guid}:${childIndex}`;
    return `connector-${type}-${suffix}`;
}

const ELEMENT_TYPE_DECISION = 'Decision';

/**
 * Get the following element of a node
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @returns NodeModel of the following element
 */
function getFollowingElement(flowModel: FlowModel, node: NodeModel): NodeModel {
    let followingElement;
    if (node.next) {
        followingElement = flowModel[node.next];
    } else {
        const parentNode = findParentElement(node, flowModel);
        if (parentNode.nodeType === NodeType.ROOT) {
            return followingElement;
        }
        const targetGuid = getFirstNonNullNext(flowModel, parentNode);
        followingElement = flowModel[targetGuid];
    }
    return followingElement;
}

/**
 * Get aria info for the following element
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @param followingElement - nodeModel of the following element
 * @param needDelimiter - whether a delimiter needs to be appended
 * @param needAfterMergingLabel - whether after merging label is needed
 * @returns a string of aria info
 */
function getAriaInfoForFollowingElement(
    flowModel: FlowModel,
    node: NodeModel,
    followingElement: NodeModel,
    needDelimiter: boolean,
    needAfterMergingLabel: boolean
) {
    let label = '';
    if (hasGoToOnNext(flowModel, node.guid)) {
        label = needAfterMergingLabel ? LABELS.ariaGoToPostMergeFollowedByLabel : LABELS.ariaGoToFollowedByLabel;
    } else if (
        isGoingBackToAncestorLoop(flowModel, followingElement.guid, node) &&
        followingElement.nodeType === NodeType.LOOP
    ) {
        label = needAfterMergingLabel ? LABELS.ariaLoopPostMergeFollowedByLabel : LABELS.ariaLoopFollowedByLabel;
    } else {
        label = needAfterMergingLabel ? LABELS.ariaRegularPostMergeFollowedByLabel : LABELS.ariaRegularFollowedByLabel;
    }
    return format(needDelimiter ? DELIMITER + label : label, followingElement.label);
}

/**
 * Get aria info for a branching element
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @param children - children of the node
 * @param followingElement - nodeModel of the element following current node
 * @returns a string of aria info
 */
function getAriaInfoForBranchingElement(
    flowModel: FlowModel,
    node: ParentNodeModel,
    children: NodeRef[],
    followingElement: NodeModel
): string {
    let ariaDescribedBy = '';

    if (children.length > 3) {
        // Node has 3+ child elements
        const label =
            node.nodeType === NodeType.START
                ? LABELS.ariaScheduledPathCountLabel
                : node.elementType === ELEMENT_TYPE_DECISION
                ? LABELS.ariaOutcomeCountLabel
                : LABELS.ariaPauseConfigurationCountLabel;
        ariaDescribedBy = format(label, children.length);
    } else if (node.nodeType === NodeType.LOOP) {
        // Node is a loop element, generate the aria info for the for each path
        const useGoToLabelForEach = hasGoToOnBranchHead(flowModel, node.guid, FOR_EACH_INDEX);
        ariaDescribedBy = format(
            useGoToLabelForEach ? LABELS.ariaForEachPathGoToLabel : LABELS.ariaForEachPathLabel,
            children[0] ? flowModel[children[0]].label : LABELS.ariaEmptyBranchLabel
        );
    } else {
        // Node is a regular branching element
        const regularLabel =
            node.nodeType === NodeType.START
                ? LABELS.ariaScheduledPathInfo
                : node.elementType === ELEMENT_TYPE_DECISION
                ? LABELS.ariaDecisionPathInfo
                : LABELS.ariaPausePathInfo;
        // calculate default index: start element's default index is 0, non-start element's default is length - 1
        const defaultIndex = node.nodeType === NodeType.START ? START_IMMEDIATE_INDEX : children.length - 1;

        // generate aria info for each branches and apprend them to ariaDescribedBy
        for (let i = 0; i < children.length; i++) {
            // get path label: default index should use default label,
            // start element's labels are stored in reverse order
            const pathLabel =
                i === defaultIndex
                    ? node.defaultConnectorLabel
                    : node.nodeType === NodeType.START
                    ? flowModel[node.childReferences[i - 1].childReference].label
                    : flowModel[node.childReferences[i].childReference].label;

            // get goTo label for different element types
            const goToLabel =
                node.nodeType === NodeType.START
                    ? LABELS.ariaScheduledPathGoToInfo
                    : node.elementType === ELEMENT_TYPE_DECISION
                    ? LABELS.ariaDecisionPathGoToInfo
                    : LABELS.ariaPausePathGoToInfo;

            const childElement = children[i] ? flowModel[children[i]!] : null;
            const info = format(
                hasGoToOnBranchHead(flowModel, node.guid, i) ? goToLabel : regularLabel,
                pathLabel,
                childElement ? childElement.label : LABELS.ariaEmptyBranchLabel
            );

            ariaDescribedBy += ariaDescribedBy === '' ? info : DELIMITER + info;
        }
    }

    if (followingElement) {
        if (node.nodeType === NodeType.LOOP) {
            // generate the aria info for the after last path of loop
            const useGoToLabelAfterLast = hasGoToOnNext(flowModel, node.guid);
            // nested loop should use loop label for the after last path
            const useLoopLabel = isGoingBackToAncestorLoop(flowModel, followingElement.guid, node);
            ariaDescribedBy +=
                DELIMITER +
                format(
                    useGoToLabelAfterLast
                        ? LABELS.ariaAfterLastPathGoToLabel
                        : useLoopLabel
                        ? LABELS.ariaAfterLastPathLoopLabel
                        : LABELS.ariaAfterLastPathLabel,
                    followingElement!.label
                );
        } else {
            // generate aria info for the following element of regular branching element
            ariaDescribedBy += getAriaInfoForFollowingElement(flowModel, node, followingElement, true, true);
        }
    }
    return ariaDescribedBy;
}

/**
 * Get aria info for a branch head element
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param node - nodeModel of a node
 * @param followingElement - nodeModel of the element following current node
 * @param childIndex - childIndex of the node
 * @param children - children of the node
 * @returns a string of aria info
 */
function getAriaInfoForBranchHeadElement(
    flowModel: FlowModel,
    node: NodeModel,
    followingElement: NodeModel,
    childIndex: number,
    children: NodeRef[]
) {
    const { parent } = node as BranchHeadNodeModel;
    let ariaDescribedBy = '';

    if (childIndex === FOR_EACH_INDEX && flowModel[parent].nodeType === NodeType.LOOP) {
        // branch head is on the for each path of a loop
        ariaDescribedBy = LABELS.ariaOnForEachPathLabel;
    } else if (childIndex === FAULT_INDEX) {
        // branch head is on the fault path
        ariaDescribedBy = LABELS.ariaOnFaultPathLabel;
    } else if (flowModel[parent].nodeType === NodeType.START) {
        // branch head of start node
        const pathLabel =
            childIndex === START_IMMEDIATE_INDEX
                ? flowModel[parent].defaultConnectorLabel
                : flowModel[(flowModel[parent] as ParentNodeModel).childReferences[childIndex - 1].childReference]
                      .label;
        ariaDescribedBy = format(LABELS.ariaOnScheduledPathLabel, pathLabel);
    } else {
        // regular branch head: decision and pause
        const label =
            flowModel[parent].elementType === ELEMENT_TYPE_DECISION
                ? LABELS.ariaOutcomeLabel
                : LABELS.ariaPauseConfigurationLabel;

        if (childIndex === (flowModel[parent] as ParentNodeModel).children.length - 1) {
            // use defaultConnectorLabel for the label of the default path
            ariaDescribedBy = format(label, node.defaultConnectorLabel);
        } else {
            const childReference = (flowModel[parent] as ParentNodeModel).childReferences[childIndex].childReference;
            ariaDescribedBy = format(label, flowModel[childReference].label);
        }
    }

    if (children) {
        // branch head node is a branching element
        ariaDescribedBy +=
            DELIMITER + getAriaInfoForBranchingElement(flowModel, node as ParentNodeModel, children, followingElement);
    } else {
        // branch head is a regular element
        ariaDescribedBy += getAriaInfoForFollowingElement(flowModel, node, followingElement, true, false);
    }

    return ariaDescribedBy;
}

/**
 * Get the aria info needed for an alcNode component
 *
 * @param flowModel - Representation of the flow as presented in the Canvas
 * @param nodeInfo - NodeRenderInfo of the node
 * @returns a string of aria info
 */
function getNodeAriaInfo(flowModel: FlowModel, nodeInfo: NodeRenderInfo): string {
    let ariaDescribedBy = '';

    const { guid } = nodeInfo;
    const node = flowModel[guid];

    if (node && node.nodeType !== NodeType.END && node.nodeType !== NodeType.ROOT) {
        const { children } = node as ParentNodeModel;
        const { childIndex } = node as BranchHeadNodeModel;

        const followingElement = getFollowingElement(flowModel, node);

        if (childIndex != null && node.nodeType !== NodeType.START) {
            // Branch head node
            ariaDescribedBy = getAriaInfoForBranchHeadElement(flowModel, node, followingElement, childIndex, children);
        } else {
            // Non branch head but need to be handled separately
            const prevElement = node.prev ? flowModel[node.prev] : null;
            if (prevElement?.nodeType === NodeType.LOOP) {
                // 1. first node on the after last path of a loop
                ariaDescribedBy = LABELS.ariaOnPathAfterLastLabel;
            } else if (
                prevElement?.nodeType === NodeType.START &&
                shouldSupportScheduledPaths(prevElement) &&
                !(prevElement as ParentNodeModel).children
            ) {
                // 2. previous element is start node that supports scheduled path and have no path on it
                ariaDescribedBy =
                    ariaDescribedBy === ''
                        ? LABELS.ariaOnPathImmediateLabel
                        : ariaDescribedBy + DELIMITER + LABELS.ariaOnPathImmediateLabel;
            }

            if (children) {
                // Branching node: start, decision, wait, loop
                const branchingElementInfo = getAriaInfoForBranchingElement(
                    flowModel,
                    node as ParentNodeModel,
                    children,
                    followingElement
                );
                ariaDescribedBy =
                    ariaDescribedBy === '' ? branchingElementInfo : ariaDescribedBy + DELIMITER + branchingElementInfo;
            } else {
                // Regular node
                ariaDescribedBy += getAriaInfoForFollowingElement(
                    flowModel,
                    node,
                    followingElement,
                    ariaDescribedBy !== '',
                    false
                );
            }
        }

        // Fault
        if (node.fault) {
            ariaDescribedBy +=
                DELIMITER +
                format(
                    hasGoToOnBranchHead(flowModel, node.guid, FAULT_INDEX)
                        ? LABELS.ariaFaultPathGoToLabel
                        : LABELS.ariaFaultPathLabel,
                    flowModel[node.fault].label
                );
        }

        // Element with incomingGoTo
        if (node.incomingGoTo && node.incomingGoTo.length > 0) {
            const incomingGoToLabel =
                node.incomingGoTo.length > 1
                    ? format(LABELS.ariaMultiGoToConnectorLabel, node.incomingGoTo.length)
                    : LABELS.airaOneGoToConnectorLabel;
            ariaDescribedBy += DELIMITER + incomingGoToLabel;
        }
    }

    return ariaDescribedBy;
}

export {
    ICON_SHAPE,
    AutoLayoutCanvasMode,
    SELECTORS,
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
