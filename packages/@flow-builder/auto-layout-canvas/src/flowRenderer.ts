import * as connectorLib from './connectorLib';
import { Geometry } from './svgUtils';
import ConnectorType from './ConnectorTypeEnum';

import {
    FlowModel,
    NodeModel,
    ParentNodeModel,
    BranchHeadNodeModel,
    resolveNode,
    getRootNode,
    getElementMetadata,
    Guid,
    FAULT_INDEX,
    FOR_EACH_INDEX,
    START_IMMEDIATE_INDEX
} from './model';
import {
    fulfillsBranchingCriteria,
    shouldSupportScheduledPaths,
    hasGoToOnNext,
    hasGoToOnBranchHead,
    isBranchTerminal
} from './modelUtils';
import { NO_OFFSET, getLayoutChildOrFault } from './layout';

import {
    ConnectorVariant,
    ConnectorRenderInfo,
    LayoutConfig,
    FlowRenderInfo,
    NodeRenderInfo,
    getLayout,
    getBranchLayout,
    Option,
    getMergeOutcomeCount,
    FlowRenderContext,
    LayoutInfo,
    getBranchLayoutKey
} from './flowRendererUtils';

import NodeType from './NodeType';
import MenuType from './MenuType';
import { isMenuOpened } from './interactionUtils';
import ConnectorLabelType from './ConnectorLabelTypeEnum';
import { getDefaultLayoutConfig } from './defaultLayoutConfig';

const IS_BRANCH = true;

/**
 * Creates a Geometry for a branch or merge connector
 *
 * @param branchLayout - The branch layout info
 * @param layoutConfig - The layout config
 * @param isBranch - True for a branch connector, false for a merge connector
 * @param joinOffsetY - The join offset
 * @returns The Geometry for the branch
 */
function createBranchOrMergeConnectorGeometry(
    branchLayout: LayoutInfo,
    layoutConfig: LayoutConfig,
    isBranch: boolean,
    joinOffsetY = 0
): Geometry {
    const width = Math.abs(branchLayout.x);
    const gridHeight = layoutConfig.grid.h;

    const [y, height] = isBranch ? [0, gridHeight] : [joinOffsetY - gridHeight, 2 * gridHeight];

    return {
        x: branchLayout.x < 0 ? branchLayout.x : 0,
        y,
        w: width,
        h: height
    };
}

/**
 * Renders an empty flow for branch
 *
 * @param parentNode - The branch's parent node
 * @param childIndex - The branch's index in the parent
 * @param context - The flow rendering context
 * @param markAsTerminal - Determines if the flows needs to be marked as terminal or not
 * @returns A FlowRenderInfo for the rendered empty flow
 */
function renderEmptyFlow(
    parentNode: ParentNodeModel,
    childIndex: number,
    context: FlowRenderContext,
    markAsTerminal: boolean
): FlowRenderInfo {
    const { progress, nodeLayoutMap } = context;
    const { x, h, w } = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);

    return {
        geometry: { x, y: 0, h, w },
        nodes: [],
        // Marking the flow as terminal when there's a GoTo on the parent's branch
        isTerminal: markAsTerminal,
        layoutConfig: context.layoutConfig
    };
}

/**
 * Checks if a node is the flow's root node
 *
 * @param node - The node to check
 * @param context - The flow rendering context
 * @returns true if the node is the root node, otherwise false
 */
function isRootNode(node: NodeModel, context: FlowRenderContext) {
    return node.guid === getRootNode(context.flowModel).guid;
}

/**
 * Checks if the guid of the element being currently traversed is same as that present in deletionPathInfo
 *
 * @param context - The flow rendering context
 * @param currentElementGuid - Guid of the element being currently traversed
 * @returns true if the currentElementGuid matches the one present in the deletionPathInfo
 */
function isElementGuidToDelete(context: FlowRenderContext, currentElementGuid: Guid) {
    const { interactionState } = context;
    return (
        interactionState.deletionPathInfo &&
        interactionState.deletionPathInfo.elementGuidToDelete === currentElementGuid
    );
}

/**
 * Checks if the index of the branch being traversed is same the one present in deletionPathInfo
 *
 * @param context - The flow rendering context
 * @param currentChildIndex - Index of the connector branch being traversed
 * @returns true if the index of the branch being traversed is same the one present in deletionPathInfo
 */
function isChildIndexToKeep(context: FlowRenderContext, currentChildIndex: number) {
    const { interactionState } = context;
    return (
        interactionState.deletionPathInfo && interactionState.deletionPathInfo.childIndexToKeep === currentChildIndex
    );
}

/**
 * Checks if the connector should be deleted
 *
 * @param context - The flow rendering context
 * @param nodeGuid - Connector's source element guid
 * @param currentChildIndex - Index of the connector branch being traversed
 * @returns true if the connector should be marked as deleted
 */
function shouldDeleteConnector(context: FlowRenderContext, nodeGuid: Guid, currentChildIndex: number) {
    return !!(
        context.isDeletingBranch ||
        (isElementGuidToDelete(context, nodeGuid) && !isChildIndexToKeep(context, currentChildIndex))
    );
}

/**
 * Checks if a given branch on a node is highlighted
 *
 * @param node Branch node to check
 * @param branchIndex Index of the branch to check against
 * @returns true if the branch is highlighted
 */
function isBranchHighlighted(node: NodeModel, branchIndex: number) {
    return !!node.config.highlightInfo?.branchIndexesToHighlight?.includes(branchIndex);
}

/**
 * Checks if a given merge branch on a node is highlighted
 *
 * @param node Branch node to check
 * @param branchIndex Index of the branch to check against
 * @returns true if the merge branch is highlighted
 */
function isMergeBranchHighlighted(node: NodeModel, branchIndex: number) {
    return !!node.config.highlightInfo?.mergeBranchIndexesToHighlight?.includes(branchIndex);
}

/**
 * Renders a non-branching node
 *
 * @param node - The node to render
 * @param context - The flow rendering context
 * @returns A NodeRenderInfo for the rendered node
 */
function renderSimpleNode(node: NodeModel, context: FlowRenderContext): NodeRenderInfo {
    const { guid, label, config, nodeType } = node;

    const { elementsMetadata, nodeLayoutMap, progress, layoutConfig, isDeletingBranch } = context;
    const { y, h, x } = getLayout(node.guid, progress, nodeLayoutMap);

    const metadata = getElementMetadata(elementsMetadata, node.elementSubtype || node.elementType);

    const nodeRenderInfo = {
        guid,
        geometry: { x, y, w: layoutConfig.node.icon.w, h },
        menuOpened: isMenuOpened(node.guid, MenuType.NODE, context.interactionState),
        label,
        metadata,
        config,
        flows: [],
        isNew: !nodeLayoutMap[guid] || (nodeLayoutMap[guid].prevLayout == null && progress === 0),
        logicConnectors: [],
        isTerminal: nodeType === NodeType.END,
        toBeDeleted: isElementGuidToDelete(context, guid) || isDeletingBranch,
        node
    };

    return nodeRenderInfo;
}

/**
 * Renders a node in the flow
 *
 * @param parentNode - The node's branching parent
 * @param node - The node to render
 * @param context - The flow rendering context
 * @param variant - A connector variant
 * @returns A NodeRenderInfo for the rendered node
 */
function renderNode(
    parentNode: ParentNodeModel,
    node: NodeModel,
    context: FlowRenderContext,
    variant: ConnectorVariant
): NodeRenderInfo {
    const { layoutConfig, progress, nodeLayoutMap, flowModel } = context;
    const { nodeType } = node;

    const nodeRenderInfo =
        fulfillsBranchingCriteria(node, nodeType) || nodeType === NodeType.LOOP
            ? renderBranchNode(node as ParentNodeModel, context)
            : renderSimpleNode(node, context);

    if (node.fault != null) {
        const stashedIsFault = context.isFault;

        // set isFault to true on the context so that all subsequent connectors are rendered with fault styling
        context.isFault = true;

        renderBranches(node as ParentNodeModel, nodeRenderInfo, context, true);
        const branchLayout = getBranchLayout(node.guid, FAULT_INDEX, progress, nodeLayoutMap);

        // Mark the Fault branch connector to be deleted if it's a part of the branch that's being deleted or
        // if it's associated with the parent element that is being deleted (Pause Element)
        const connectorToBeDeleted = shouldDeleteConnector(context, node.guid, FAULT_INDEX);
        const isHighlighted = isBranchHighlighted(node, FAULT_INDEX);

        nodeRenderInfo.logicConnectors = (nodeRenderInfo.logicConnectors || []).concat([
            connectorLib.createBranchConnector(
                { guid: parentNode.guid, childIndex: FAULT_INDEX },
                createBranchOrMergeConnectorGeometry(branchLayout, layoutConfig, IS_BRANCH),
                ConnectorType.BRANCH_RIGHT,
                layoutConfig,
                context.isFault,
                connectorToBeDeleted,
                isHighlighted
            )
        ]);

        // restore the previous fault state
        context.isFault = stashedIsFault;
    }

    if (nodeType !== NodeType.END && (!nodeRenderInfo.isTerminal || nodeType === NodeType.LOOP)) {
        if (hasGoToOnNext(flowModel, node.guid)) {
            // Draw out GoTo Connector
            nodeRenderInfo.nextConnector = createGoToConnector(node, context, variant);
        } else {
            nodeRenderInfo.nextConnector = createNextConnector(parentNode, node, context, variant);
        }
    }

    return nodeRenderInfo;
}

/**
 * Get the height of the connector to the "next" node
 *
 * @param parentNode - The source node's parent
 * @param node - The source node
 * @param context - The flow render context
 * @param offsetY - The node's offset
 * @returns The height of the connector to the next node
 */
function getNextConnectorHeight(
    parentNode: ParentNodeModel,
    node: NodeModel,
    context: FlowRenderContext,
    offsetY: number
): number {
    const { progress, nodeLayoutMap } = context;
    const { next } = node;
    let height;

    if (next != null) {
        const nextNodeLayout = getLayout(next, progress, nodeLayoutMap);
        height = nextNodeLayout.y - offsetY;
    } else if (!isRootNode(parentNode, context)) {
        const { guid } = parentNode;
        height = getLayout(guid, progress, nodeLayoutMap).joinOffsetY - offsetY;
    } else {
        height = 0;
    }

    return height;
}

/**
 * @param guid element Guid
 * @param context Flow render context
 * @returns true if the element is beyound the deleting merge point
 */
function isDeletingBeyondMergePoint(guid: string, context: FlowRenderContext) {
    return !!(
        isElementGuidToDelete(context, guid) &&
        context.interactionState.deletionPathInfo &&
        context.interactionState.deletionPathInfo.shouldDeleteBeyondMergingPoint
    );
}

/**
 * Creates the next node connector for a node
 *
 * @param parentNode - The parent branching node
 * @param node - The source node for the connector
 * @param context - The flow rendering context
 * @param variant - The connector variant
 * @returns A ConnectorRenderInfo for the node's next connector
 */
function createNextConnector(
    parentNode: ParentNodeModel,
    node: NodeModel,
    context: FlowRenderContext,
    variant: ConnectorVariant
): ConnectorRenderInfo {
    const { flowModel, progress, nodeLayoutMap, interactionState, isDeletingBranch } = context;
    const { y, joinOffsetY, addOffset, labelOffset } = getLayout(node.guid, progress, nodeLayoutMap);
    const { nodeType } = node;

    let height = getNextConnectorHeight(parentNode, node, context, y);

    let offsetY = 0;

    let mainVariant =
        fulfillsBranchingCriteria(node, nodeType) || nodeType === NodeType.LOOP
            ? ConnectorVariant.POST_MERGE
            : !(node as ParentNodeModel).children && shouldSupportScheduledPaths(node)
            ? ConnectorVariant.DEFAULT_LABEL
            : ConnectorVariant.DEFAULT;

    let showAdd = true;
    if (mainVariant === ConnectorVariant.POST_MERGE) {
        offsetY = joinOffsetY;
        height = height - joinOffsetY;
        showAdd = getMergeOutcomeCount(flowModel, node as ParentNodeModel) !== 1 || nodeType === NodeType.LOOP;
    }

    if (node.next == null) {
        mainVariant =
            mainVariant === ConnectorVariant.POST_MERGE
                ? ConnectorVariant.POST_MERGE_TAIL
                : ConnectorVariant.BRANCH_TAIL;
    }

    const connectorLabelType =
        !(node as ParentNodeModel).children && shouldSupportScheduledPaths(node)
            ? ConnectorLabelType.BRANCH
            : ConnectorLabelType.NONE;

    const connectorBadgeLabel =
        !(node as ParentNodeModel).children && shouldSupportScheduledPaths(node)
            ? node.defaultConnectorLabel
            : undefined;

    return connectorLib.createConnectorToNextNode(
        { guid: node.guid },
        ConnectorType.STRAIGHT,
        connectorLabelType,
        offsetY,
        height,
        isMenuOpened(node.guid, MenuType.CONNECTOR, interactionState),
        context.layoutConfig,
        context.isFault,
        [mainVariant, variant],
        isDeletingBranch || isDeletingBeyondMergePoint(node.guid, context),
        showAdd ? addOffset : undefined,
        labelOffset,
        connectorBadgeLabel,
        !!node.config.highlightInfo?.highlightNext,
        undefined
    );
}

/**
 * Creates a GoTo connector to the next node (doesn't include the GoTo connectors on branch head)
 *
 * @param node - The source node for the connector
 * @param context - The flow rendering context
 * @param variant - The connector variant
 * @returns A ConnectorRenderInfo for the node's next goTo connector
 */
function createGoToConnector(
    node: NodeModel,
    context: FlowRenderContext,
    variant: ConnectorVariant
): ConnectorRenderInfo {
    const { progress, nodeLayoutMap, interactionState, isDeletingBranch, layoutConfig, flowModel } = context;
    const { joinOffsetY, addOffset, labelOffset, h } = getLayout(node.guid, progress, nodeLayoutMap);
    const { nodeType } = node;

    const mainVariant =
        fulfillsBranchingCriteria(node, nodeType) || nodeType === NodeType.LOOP
            ? ConnectorVariant.POST_MERGE
            : ConnectorVariant.DEFAULT;

    const connectorBadgeLabel =
        !(node as ParentNodeModel).children && shouldSupportScheduledPaths(node)
            ? node.defaultConnectorLabel
            : undefined;

    return connectorLib.createConnectorToNextNode(
        { guid: node.guid },
        ConnectorType.GO_TO,
        ConnectorLabelType.NONE,
        joinOffsetY,
        h - joinOffsetY,
        isMenuOpened(node.guid, MenuType.CONNECTOR, interactionState),
        layoutConfig,
        context.isFault,
        [mainVariant, variant],
        isDeletingBranch || isDeletingBeyondMergePoint(node.guid, context),
        addOffset,
        labelOffset,
        connectorBadgeLabel,
        !!node.config.highlightInfo?.highlightNext,
        flowModel[node.next!].label
    );
}

/**
 * Creates a GoTo connector at the branch head
 *
 * @param parentNode - The branch's parent node
 * @param childIndex - The branch index
 * @param context - The flow rendering index
 * @param conditionOptions - The conditions options
 * @param isHighlighted - Whether to highlight this connector
 * @returns A ConnectorRenderInfo for the node's branch head goTo connector
 */
function createGoToConnectorOnParentBranch(
    parentNode: ParentNodeModel,
    childIndex: number,
    context: FlowRenderContext,
    conditionOptions: Option[],
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { interactionState, isDeletingBranch, flowModel, progress, nodeLayoutMap } = context;
    const { addOffset, labelOffset, h } = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);
    const childCount = childIndex === FAULT_INDEX ? 1 : parentNode.children.length;

    const variant = getConnectorVariant(parentNode, childIndex, context);
    const { nodeType } = parentNode;

    const defaultConditionIndex =
        nodeType === NodeType.BRANCH ? childCount - 1 : nodeType === NodeType.START ? START_IMMEDIATE_INDEX : null;

    let connectorBadgeLabel;
    if (childIndex === defaultConditionIndex) {
        connectorBadgeLabel = parentNode.defaultConnectorLabel;
    } else if (childIndex !== FAULT_INDEX) {
        connectorBadgeLabel =
            nodeType === NodeType.START
                ? conditionOptions && conditionOptions[childIndex - 1].label
                : conditionOptions && conditionOptions[childIndex].label;
    }

    let variants = [variant];
    if (nodeType === NodeType.BRANCH || nodeType === NodeType.LOOP || nodeType === NodeType.START) {
        variants = [ConnectorVariant.BRANCH_HEAD, variant];
    }

    let height = h;
    if (nodeType === NodeType.LOOP) {
        height = h - getDefaultLayoutConfig().grid.h;
    }

    return connectorLib.createConnectorToNextNode(
        { guid: parentNode.guid, childIndex },
        ConnectorType.GO_TO,
        getConnectorLabelType({
            isFault: childIndex === FAULT_INDEX,
            isLoop: nodeType === NodeType.LOOP
        }),
        NO_OFFSET,
        height,
        isMenuOpened(getBranchLayoutKey(parentNode.guid, childIndex), MenuType.CONNECTOR, interactionState),
        context.layoutConfig,
        context.isFault || childIndex === FAULT_INDEX,
        variants,
        isDeletingBranch,
        addOffset,
        labelOffset,
        connectorBadgeLabel,
        isHighlighted,
        childIndex === FAULT_INDEX
            ? flowModel[parentNode.fault!].label
            : flowModel[parentNode.children[childIndex]!].label
    );
}

/**
 * Renders a branch of a branching node.
 *
 * @param parentNode - The branching node
 * @param childIndex - The index of the branch
 * @param context - The flow rendering context
 * @returns A FlowRenderInfo for the branch
 */
function renderFlowHelper(parentNode: ParentNodeModel, childIndex: number, context: FlowRenderContext): FlowRenderInfo {
    const { flowModel, progress, nodeLayoutMap } = context;

    const layoutChild = childIndex === FAULT_INDEX ? parentNode.fault : parentNode.children[childIndex];
    const branchHead = layoutChild == null ? null : resolveNode(flowModel, layoutChild);

    // Rendering an empty flow when no element exists on the branch or when there's a GoTo connection from the branch itself
    const hasGoToOnHead = hasGoToOnBranchHead(flowModel, parentNode.guid, childIndex);
    if (branchHead == null || hasGoToOnHead) {
        return renderEmptyFlow(parentNode, childIndex, context, hasGoToOnHead);
    }

    const { x, w, h } = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);

    let node: NodeModel | null = branchHead;

    const nodeRenderInfos: NodeRenderInfo[] = [];

    const connectorVariant = getConnectorVariant(parentNode, childIndex, context);

    while (node) {
        if (node.prev && isDeletingBeyondMergePoint(node.prev, context)) {
            context.isDeletingBranch = true;
        }
        const nodeRenderInfo = renderNode(parentNode, node, context, connectorVariant);
        nodeRenderInfos.push(nodeRenderInfo);
        node = node.next && !hasGoToOnNext(flowModel, node.guid) ? resolveNode(flowModel, node.next) : null;
    }

    const isTerminal = !!(branchHead as BranchHeadNodeModel).isTerminal;

    return {
        geometry: { x, y: 0, w, h },
        nodes: nodeRenderInfos,
        isTerminal,
        layoutConfig: context.layoutConfig
    };
}

/**
 * Creates a SelectInfo for the conditions of a branch
 *
 * @param flowModel - The flow model
 * @param conditionReferences - The condition references
 * @param fieldName - The field name metadata
 * @returns A SelectInfo for the conditions of a branch
 */
function createOptionsForConditionReferences(
    flowModel: FlowModel,
    conditionReferences: any[],
    fieldName: string
): Option[] {
    return conditionReferences.map((reference: any) => {
        const value = reference[fieldName];

        return {
            label: flowModel[value].label,
            value
        };
    });
}

/**
 * @param parentNode parent node
 * @returns condition references
 */
function getConditionReferences(parentNode: ParentNodeModel): any {
    // TODO: Use NodeType instead of elementType and update tests
    const elementType = parentNode.elementType;
    if (elementType === 'Decision' || elementType === 'Wait' || elementType === 'START_ELEMENT') {
        return {
            refKey: 'childReference',
            references: parentNode.childReferences
        };
    }
}

/**
 * Creates a SelectInfo for a branching node
 *
 * @param parentNode - The branching node
 * @param context - The flow rendering context
 * @returns A SelectInfo for the connector labels
 */
function createConditionOptions(parentNode: ParentNodeModel, context: FlowRenderContext): Option[] | undefined {
    const { flowModel } = context;

    const conditionReferences = getConditionReferences(parentNode);
    if (conditionReferences != null) {
        const { refKey, references } = conditionReferences;
        return createOptionsForConditionReferences(flowModel, references, refKey);
    }
}

/**
 * Get some misc branching info such as isTerminal and left/right merge indexes
 *
 * @param branchFlowRenderInfos - The flow render infos for the branches
 * @returns misc branching info
 */
function getMiscBranchingInfo(branchFlowRenderInfos: FlowRenderInfo[]) {
    let isTerminal = true;
    let w = 0;

    branchFlowRenderInfos.forEach((flowRenderInfo) => {
        isTerminal = isTerminal && flowRenderInfo.isTerminal;
        w += flowRenderInfo.geometry.w;
    });

    return { isTerminal, w };
}

/**
 * Renders a branch node.
 * The branching node is rendered, along with all its branches, recursively.
 *
 * @param parentNode - The branch node
 * @param context - The flow rendering context
 * @returns A NodeRenderInfo for the rendered node
 */
function renderBranchNode(parentNode: ParentNodeModel, context: FlowRenderContext): NodeRenderInfo {
    const nodeRenderInfo = renderSimpleNode(parentNode, context);
    renderBranches(parentNode, nodeRenderInfo, context);
    return nodeRenderInfo;
}

/**
 * Renders node's children or fault
 *
 * @param node - The node
 * @param nodeRenderInfo - The node's render info
 * @param context - The flow render context
 * @param isFault  - True, if we should render the node's fault, otherwise renders the node's children
 */
function renderBranches(
    node: ParentNodeModel,
    nodeRenderInfo: NodeRenderInfo,
    context: FlowRenderContext,
    isFault = false
): void {
    const { progress, nodeLayoutMap, layoutConfig, flowModel } = context;
    const { nodeType } = node;
    const children = !isFault ? (node as ParentNodeModel).children : null;

    const layout = getLayout(node.guid, progress, nodeLayoutMap);

    const { y, h } = layout;

    const childIndexes = children != null ? children.map((child, childIndex) => childIndex) : [FAULT_INDEX];
    const conditionOptions = createConditionOptions(node, context);

    const flows = childIndexes.map((i) => {
        // When rendering branches for the element being deleted, setting context.isDeletingBranch to true
        // when traversing a branch whose index is not equal to childIndexToKeep
        if (isElementGuidToDelete(context, node.guid)) {
            context.isDeletingBranch = !isChildIndexToKeep(context, i);
        }
        const isHighlighted = isBranchHighlighted(node, i);
        const flowRenderInfo = renderFlowHelper(node, i, context);
        const child = getLayoutChildOrFault(node, i);
        const height = child == null ? layout.joinOffsetY : getLayout(child, progress, nodeLayoutMap).y;
        if (child && hasGoToOnBranchHead(flowModel, node.guid, i)) {
            // Draw out GoTo Connector
            flowRenderInfo.preConnector = createGoToConnectorOnParentBranch(
                node,
                i,
                context,
                conditionOptions!,
                isHighlighted
            );
        } else {
            flowRenderInfo.preConnector = createPreConnector(
                node,
                i,
                context,
                height,
                conditionOptions!,
                isHighlighted
            );
        }

        //  Resetting context.isDeletingBranch to false after rendering each branch of the parent element being deleted
        if (isElementGuidToDelete(context, node.guid)) {
            context.isDeletingBranch = false;
        }
        return flowRenderInfo;
    });

    const { isTerminal, w } = getMiscBranchingInfo(flows);

    if (!isFault) {
        if (nodeType === NodeType.LOOP) {
            nodeRenderInfo.logicConnectors = [
                createLoopAfterLastConnector(node.guid, context, !!node.config.highlightInfo?.highlightNext)
            ];

            if (!isBranchTerminal(flowModel, node, FOR_EACH_INDEX)) {
                nodeRenderInfo.logicConnectors.push(
                    createLoopBackConnector(node.guid, context, !!node.config.highlightInfo?.highlightLoopBack)
                );
            }
        } else {
            nodeRenderInfo.logicConnectors = [
                ...createBranchConnectors(node, context, layoutConfig),
                ...createMergeConnectors(node, layout.joinOffsetY, context)
            ];
        }
    }

    if (isFault) {
        const flow = flows[0];
        flow.geometry.y = y;
        nodeRenderInfo.faultFlow = flow;
    } else {
        nodeRenderInfo.flows = flows;
        nodeRenderInfo.isTerminal = isTerminal;
    }

    nodeRenderInfo.conditionOptions = conditionOptions;
    nodeRenderInfo.defaultConnectorLabel = node.defaultConnectorLabel;
    nodeRenderInfo.geometry = { x: 0, y, w, h };
}

/**
 * Returns the variant for a connector at a childIndex
 *
 * @param parentNode - The parent node
 * @param childIndex - The childIndex
 * @param context  - The flow render context
 * @returns the connector variant
 */
function getConnectorVariant(
    parentNode: ParentNodeModel,
    childIndex: number,
    context: FlowRenderContext
): ConnectorVariant {
    if (childIndex === FAULT_INDEX) {
        return ConnectorVariant.FAULT;
    }

    const { progress, nodeLayoutMap, flowModel } = context;
    const branchLayout = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);
    let variant = ConnectorVariant.DEFAULT;

    const { children, nodeType } = parentNode;

    let firstNonTerminalBranch = true;

    children.forEach((child, i) => {
        // isTerminal should be true whenever the child is either a GoTo target or has it's isTerminal set to true
        const isTerminal = isBranchTerminal(flowModel, parentNode, i);

        if (!isTerminal) {
            if (firstNonTerminalBranch) {
                firstNonTerminalBranch = false;
            }
        }
    });

    if (nodeType === NodeType.LOOP) {
        variant = ConnectorVariant.LOOP;
    } else if (branchLayout.x === 0) {
        variant = ConnectorVariant.CENTER;
    }

    return variant;
}

/**
 * Utility function to get a connectors' label type
 *
 * @param obj - An object
 * @param obj.isFault - true if is fault connector
 * @param obj.isLoop - true if element is a loop element
 * @returns the connector label type
 */
function getConnectorLabelType({ isFault, isLoop }: { isFault?: boolean; isLoop?: boolean }) {
    if (isFault) {
        return ConnectorLabelType.FAULT;
    } else if (isLoop) {
        return ConnectorLabelType.LOOP_FOR_EACH;
    }

    return ConnectorLabelType.BRANCH;
}
/**
 * Creates a pre connector for a branch. This is the connector that precedes the first node in a branch.
 *
 * @param parentNode - The branch's parent node
 * @param childIndex - The branch index
 * @param context - The flow rendering index
 * @param height - The height of the connector
 * @param conditionOptions - The conditions options
 * @param isHighlighted - Whether to highlight this connector
 * @returns A ConnectorRenderInfo for the pre connector
 */
function createPreConnector(
    parentNode: ParentNodeModel,
    childIndex: number,
    context: FlowRenderContext,
    height: number,
    conditionOptions: Option[],
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { interactionState, isDeletingBranch, progress, nodeLayoutMap } = context;

    const [branchHeadGuid, childCount] =
        childIndex === FAULT_INDEX
            ? [parentNode.fault, 1]
            : [parentNode.children[childIndex], parentNode.children.length];

    const isEmptyBranch = branchHeadGuid == null;
    const variant = getConnectorVariant(parentNode, childIndex, context);
    const { nodeType } = parentNode;

    const defaultConditionIndex =
        nodeType === NodeType.BRANCH ? childCount - 1 : nodeType === NodeType.START ? START_IMMEDIATE_INDEX : null;

    let connectorBadgeLabel;
    if (childIndex === defaultConditionIndex) {
        connectorBadgeLabel = parentNode.defaultConnectorLabel;
    } else if (childIndex !== FAULT_INDEX) {
        connectorBadgeLabel =
            nodeType === NodeType.START
                ? conditionOptions && conditionOptions[childIndex - 1].label
                : conditionOptions && conditionOptions[childIndex].label;
    }

    let variants = [variant];
    if (nodeType === NodeType.BRANCH || nodeType === NodeType.LOOP || nodeType === NodeType.START) {
        variants = [isEmptyBranch ? ConnectorVariant.BRANCH_HEAD_EMPTY : ConnectorVariant.BRANCH_HEAD, variant];
    }

    const branchLayout = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);

    return connectorLib.createConnectorToNextNode(
        { guid: parentNode.guid, childIndex },
        ConnectorType.STRAIGHT,
        getConnectorLabelType({
            isFault: childIndex === FAULT_INDEX,
            isLoop: nodeType === NodeType.LOOP
        }),
        NO_OFFSET,
        height,
        isMenuOpened(getBranchLayoutKey(parentNode.guid, childIndex), MenuType.CONNECTOR, interactionState),
        context.layoutConfig,
        context.isFault || childIndex === FAULT_INDEX,
        variants,
        isDeletingBranch,
        branchLayout.addOffset,
        branchLayout.labelOffset,
        connectorBadgeLabel,
        isHighlighted,
        undefined
    );
}

/**
 * Creates the left and right branch connectors for a branching node
 *
 * @param parentNode - The branching node
 * @param context - The flow rendering context
 * @param layoutConfig - The config for the layout
 * @returns An array of ConnectorRenderInfo for the connectors
 */
function createBranchConnectors(
    parentNode: ParentNodeModel,
    context: FlowRenderContext,
    layoutConfig: LayoutConfig
): ConnectorRenderInfo[] {
    const { progress, nodeLayoutMap } = context;

    return parentNode.children
        .map((_, branchIndex) => {
            const branchLayout = getBranchLayout(parentNode.guid, branchIndex, progress, nodeLayoutMap);

            // Marking the connector as to be deleted if it's a part of the branch being deleted
            // or if it's associated with the element being deleted and not equal to it's childIndexToKeep
            const connectorToBeDeleted = shouldDeleteConnector(context, parentNode.guid, branchIndex);
            const isHighlighted = isBranchHighlighted(parentNode, branchIndex);

            return connectorLib.createBranchConnector(
                { guid: parentNode.guid, childIndex: branchIndex },
                createBranchOrMergeConnectorGeometry(branchLayout, layoutConfig, IS_BRANCH),
                branchLayout.x < 0 ? ConnectorType.BRANCH_LEFT : ConnectorType.BRANCH_RIGHT,
                layoutConfig,
                context.isFault,
                connectorToBeDeleted,
                isHighlighted
            );
        })
        .filter((connectorInfo) => connectorInfo.geometry.w > 0 && connectorInfo.geometry.h);
}

/**
 * Creates the left and right merge connectors for a branching node
 *
 * @param parentNode - The branching node
 * @param joinOffsetY - The parent's join offset
 * @param context - The flow rendering context
 * @returns An array of ConnectorRenderInfo for the connectors
 */
function createMergeConnectors(
    parentNode: ParentNodeModel,
    joinOffsetY: number,
    context: FlowRenderContext
): ConnectorRenderInfo[] {
    const { progress, nodeLayoutMap, layoutConfig, flowModel } = context;

    return parentNode.children
        .map((_, index) => {
            if (isBranchTerminal(flowModel, parentNode, index)) {
                return null;
            }
            // Marking the connector as to be deleted if it's a part of the branch being deleted
            // or if it's associated with the element being deleted and not equal to it's childIndexToKeep
            const connectorToBeDeleted = shouldDeleteConnector(context, parentNode.guid, index);
            const isHighlighted =
                isMergeBranchHighlighted(parentNode, index) && parentNode.config.highlightInfo!.highlightNext;

            const branchLayout = getBranchLayout(parentNode.guid, index, progress, nodeLayoutMap);
            let connectorType: ConnectorType | null = null;
            const geometry = createBranchOrMergeConnectorGeometry(branchLayout, layoutConfig, !IS_BRANCH, joinOffsetY);

            if (branchLayout.x < 0) {
                connectorType = ConnectorType.MERGE_LEFT;
            } else if (branchLayout.x > 0) {
                connectorType = ConnectorType.MERGE_RIGHT;
            }

            if (connectorType != null && branchLayout.x !== 0) {
                return connectorLib.createMergeConnector(
                    { guid: parentNode.guid, childIndex: index },
                    geometry,
                    connectorType,
                    layoutConfig,
                    context.isFault,
                    connectorToBeDeleted,
                    !!isHighlighted
                );
            }

            return null;
        })
        .filter((renderInfo) => renderInfo != null) as ConnectorRenderInfo[];
}

/**
 * Creates a ConnectorRenderInfo for a loop after last connector
 *
 * @param parentGuid - The loop element Guid
 * @param context - The flow context
 * @param isHighlighted - Whether to highlight this connector
 * @returns A loop after last ConnectorRenderInfo
 */
function createLoopAfterLastConnector(
    parentGuid: Guid,
    context: FlowRenderContext,
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { progress, nodeLayoutMap, layoutConfig } = context;
    const childIndex = FOR_EACH_INDEX;

    const branchLayout = getBranchLayout(parentGuid, childIndex, progress, nodeLayoutMap);
    const connectorToBeDeleted = shouldDeleteConnector(context, parentGuid, childIndex);
    const w = branchLayout.w - branchLayout.offsetX;

    const geometry = {
        x: 0,
        y: 0,
        h: branchLayout.h,
        w
    };

    return connectorLib.createLoopAfterLastConnector(
        { guid: parentGuid },
        geometry,
        layoutConfig,
        context.isFault,
        connectorToBeDeleted,
        branchLayout.labelOffset,
        w,
        isHighlighted
    );
}

/**
 * Creates a ConnectorRenderInfo for a loop back connector
 *
 * @param parentGuid - The loop element Guid
 * @param context - The flow context
 * @param isHighlighted - Whether to highlight this connector
 * @returns A loop back ConnectorRenderInfo
 */
function createLoopBackConnector(
    parentGuid: Guid,
    context: FlowRenderContext,
    isHighlighted: boolean
): ConnectorRenderInfo {
    const { progress, nodeLayoutMap, layoutConfig } = context;
    const childIndex = FOR_EACH_INDEX;
    const branchLayout = getBranchLayout(parentGuid, childIndex, progress, nodeLayoutMap);
    const connectorToBeDeleted = shouldDeleteConnector(context, parentGuid, childIndex);
    const w = branchLayout.offsetX;

    const geometry = {
        x: -w,
        y: 0,
        w,
        h: branchLayout.h
    };

    return connectorLib.createLoopBackConnector(
        { guid: parentGuid },
        geometry,
        layoutConfig,
        context.isFault,
        connectorToBeDeleted,
        isHighlighted
    );
}

/**
 * Creates a FlowRenderInfo that represents a rendered flow
 *
 * @param context - The context for the flow
 * @param progress - The animation progress (0 to 1)
 * @returns A FlowRenderInfo for the rendered flow
 */
function renderFlow(context: FlowRenderContext, progress: number): FlowRenderInfo {
    Object.assign(context, { progress });
    const rootNode = getRootNode(context.flowModel);

    const flowRenderInfo = renderFlowHelper(rootNode as ParentNodeModel, 0, context);
    context.isDeletingBranch = false;
    return flowRenderInfo;
}

export { renderFlow };
