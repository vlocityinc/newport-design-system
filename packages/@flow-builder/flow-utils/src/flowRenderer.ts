import { createConnectorToNextNode, createBranchConnector, createMergeConnector } from './connectorLib';
import ConnectorType from './ConnectorTypeEnum';

import { FlowModel, NodeModel, ParentNodeModel, resolveNode, getRootNode, getElementMetadata, guid } from './model';
import { getBranchLayoutKey } from './layout';

import {
    FlowInteractionState,
    ConnectorVariant,
    ConnectorRenderInfo,
    LayoutConfig,
    FlowRenderInfo,
    NodeRenderInfo,
    getLayout,
    getBranchLayout,
    Option,
    FlowRenderContext
} from './flowRendererUtils';
import MenuType from './MenuType';
import ElementType from './ElementType';

interface MenuEventDetail {
    top: number;
    left: number;
    guid: string;
    parent: string;
    childIndex: number;
    type: MenuType;
}

/**
 * Creates a key for a branch flow
 *
 * @param parent - The guid of the branch's parent
 * @param childIndex - The index of the branch in the parent
 */
function createFlowKey(parent: guid, childIndex: number): string {
    const branchKey = getBranchLayoutKey(parent, childIndex);
    return `flow-${branchKey}`;
}

/**
 * Renders an empty flow for branch
 *
 * @param parentNode - The branch's parent node
 * @param childIndex - The branch's index in the parent
 * @param context - The flow rendering context
 * @returns A FlowRenderInfo for the rendered empty flow
 */
function renderEmptyFlow(parentNode: NodeModel, childIndex: number, context: FlowRenderContext): FlowRenderInfo {
    const { progress, nodeLayoutMap } = context;
    const { x, h, w } = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);

    return {
        key: createFlowKey(parentNode.guid, childIndex),
        geometry: { x, y: 0, h, w },
        nodes: [],
        isTerminal: false,
        layoutConfig: context.layoutConfig
    };
}

/**
 * Checks if a menu is opened for a node.
 *
 * @param nodeGuid - The guid for the node
 * @param menuType - The type of the menu to check for
 * @param interactionState - The flow's interaction state
 * @returns True if the menu is opened, false otherwise
 */
function isMenuOpened(nodeGuid: guid, menuType: MenuType, interactionState: FlowInteractionState): boolean {
    if (!interactionState.menuInfo) {
        return false;
    } else {
        const menuInfo = interactionState.menuInfo;
        return menuInfo.key === nodeGuid && menuInfo.type === menuType;
    }
}

/**
 * Checks if a node is the flow's root node
 * @param node - The node to check
 * @param context - The flow rendering context
 * @returns true if the node is the root node, otherwise false
 */
function isRootNode(node: NodeModel, context: FlowRenderContext) {
    return node.guid === getRootNode(context.flowModel).guid;
}

/**
 * Renders a non-branching node
 *
 * @param node - The node to render
 * @param context - The flow rendering context
 * @returns A NodeRenderInfo for the rendered node
 */
function renderSimpleNode(node: NodeModel, context: FlowRenderContext): NodeRenderInfo {
    const { elementsMetadata, nodeLayoutMap, progress } = context;
    const { y } = getLayout(node.guid, progress, nodeLayoutMap);

    const metadata = getElementMetadata(elementsMetadata, node.elementType);

    const label =
        metadata.type === ElementType.END || metadata.type === ElementType.START ? '' : node.label || node.guid;

    return {
        key: node.guid,
        guid: node.guid,
        geometry: { x: 0, y },
        menuOpened: isMenuOpened(node.guid, MenuType.NODE, context.interactionState),
        label,
        metadata,
        config: node.config,
        hasFault: node.fault != null,
        flows: [],
        isNew: nodeLayoutMap[node.guid].prevLayout == null && progress === 0,
        logicConnectors: [],
        isTerminal: metadata.type === ElementType.END
    };
}

function isBranching(node: NodeModel) {
    return (node as ParentNodeModel).children != null;
}
/**
 * Renders a node in the flow
 *
 * @param parentNode - The node's branching parent
 * @param node - The node to render
 * @param context - The flow rendering context
 * @returns A NodeRenderInfo for the rendered node
 */
function renderNode(
    parentNode: ParentNodeModel,
    node: NodeModel,
    context: FlowRenderContext,
    variant?: ConnectorVariant
): NodeRenderInfo {
    const { elementsMetadata } = context;

    const metadata = getElementMetadata(elementsMetadata, node.elementType);

    const nodeRenderInfo = isBranching(node)
        ? renderBranchNode(node as ParentNodeModel, context)
        : renderSimpleNode(node, context);

    if (metadata.type !== ElementType.END && !nodeRenderInfo.isTerminal) {
        nodeRenderInfo.nextConnector = createNextConnector(parentNode, node, context, variant);
    }

    return nodeRenderInfo;
}

/**
 * Creates the next node connector for a node
 *
 * @param parentNode - The parent branching node
 * @param node - The source node for the connector
 * @param context - The flow rendering context
 * @param variant - The connnector variant
 * @returns A ConnectorRenderInfo for the node's next connector
 */
function createNextConnector(
    parentNode: ParentNodeModel,
    node: NodeModel,
    context: FlowRenderContext,
    variant?: ConnectorVariant
): ConnectorRenderInfo {
    const { progress, nodeLayoutMap, interactionState } = context;
    const { y, joinOffsetY } = getLayout(node.guid, progress, nodeLayoutMap);
    let height;
    if (node.next) {
        const nextNodeLayout = getLayout(node.next, progress, nodeLayoutMap);
        height = nextNodeLayout.y - y;
    } else if (!isRootNode(parentNode, context)) {
        height = getLayout(parentNode.guid, progress, nodeLayoutMap).joinOffsetY - y;
    } else {
        height = 0;
    }
    let offsetY = 0;
    let connectorType;
    if (isBranching(node)) {
        connectorType = ConnectorType.POST_MERGE;
    } else if (node.next == null) {
        connectorType = ConnectorType.BRANCH_TAIL;
    } else {
        connectorType = ConnectorType.STRAIGHT;
    }

    if (connectorType === ConnectorType.POST_MERGE) {
        offsetY = joinOffsetY;
        height = height - joinOffsetY;
    }

    return createConnectorToNextNode(
        { node },
        connectorType,
        offsetY,
        height,
        isMenuOpened(node.guid, MenuType.CONNECTOR, interactionState),
        context.layoutConfig,
        variant
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
    const { x, w, h } = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);

    const layoutChild = parentNode.children[childIndex];
    let node: NodeModel | null = resolveNode(flowModel, layoutChild);

    const nodeRenderInfos = [];
    let isTerminal = false;

    // TODO: FLC move to layout.ts
    let connectorVariant;
    if (x === 0) {
        connectorVariant = ConnectorVariant.CENTER;
    } else if (childIndex === 0 || childIndex === parentNode.children.length - 1) {
        connectorVariant = ConnectorVariant.EDGE;
    }

    while (node) {
        const nodeRenderInfo = renderNode(parentNode, node, context, connectorVariant);
        nodeRenderInfos.push(nodeRenderInfo);

        const next = node.next;
        if (next) {
            node = resolveNode(flowModel, next);
        } else {
            isTerminal = nodeRenderInfo.isTerminal;
            break;
        }
    }

    return {
        key: createFlowKey(parentNode.guid, childIndex),
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
 * @param childIndex - The index of the branch
 * @param fieldName - The field name metadata
 * @return A SelecInfo for the conditions of a branch
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

// TODO: FLC use metadata here
function getConditionReferences(parentNode: ParentNodeModel): any {
    if (parentNode.elementType === 'Decision') {
        return {
            refKey: 'outcomeReference',
            references: parentNode.outcomeReferences
        };
    } else if (parentNode.elementType === 'Wait') {
        return {
            refKey: 'waitEventReference',
            references: parentNode.waitEventReferences
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

function getBranchingInfo(flowRenderInfos: FlowRenderInfo[]) {
    let isTerminal = true;
    let w = 0;

    // the index of the leftmost branch that merges back to its parent
    let leftMergeIndex: any;
    // the index of the rightmost branch that merges back to its parent
    let rightMergeIndex: any;

    flowRenderInfos.forEach((flowRenderInfo, i) => {
        if (!flowRenderInfo.isTerminal) {
            if (leftMergeIndex == null) {
                leftMergeIndex = i;
            }
            rightMergeIndex = i;
        }

        isTerminal = isTerminal && flowRenderInfo.isTerminal;
        w += flowRenderInfo.geometry.w!;
    });

    return { isTerminal, w, leftMergeIndex, rightMergeIndex };
}

/**
 * Renders a branch node.
 * The branching node is renderered, along with all its branches, recursively.
 *
 * @param parentNode - The branch node
 * @param context - The flow rendering context
 * @returns A NodeRenderInfo for the rendered node
 */
function renderBranchNode(parentNode: ParentNodeModel, context: FlowRenderContext): NodeRenderInfo {
    const { progress, nodeLayoutMap, layoutConfig } = context;

    const nodeRenderInfo = renderSimpleNode(parentNode, context);

    const children = parentNode.children;
    const { y, joinOffsetY } = getLayout(parentNode.guid, progress, nodeLayoutMap);

    nodeRenderInfo.flows = children.map((child, i) =>
        child == null ? renderEmptyFlow(parentNode, i, context) : renderFlowHelper(parentNode, i, context)
    );

    const { isTerminal, w, leftMergeIndex, rightMergeIndex } = getBranchingInfo(nodeRenderInfo.flows);

    nodeRenderInfo.flows.forEach((flowRenderInfo, i) => {
        const height = children[i] != null ? flowRenderInfo.nodes[0].geometry.y! : joinOffsetY;
        flowRenderInfo.preConnector = createPreConnector(parentNode, i, context, height);
    });

    nodeRenderInfo.logicConnectors = [
        ...createBranchConnectors(parentNode, context, layoutConfig),
        ...createMergeConnectors(parentNode, joinOffsetY, context, leftMergeIndex, rightMergeIndex)
    ];

    nodeRenderInfo.isTerminal = isTerminal;
    nodeRenderInfo.geometry = { x: 0, y, w };

    return nodeRenderInfo;
}

/**
 * Creates a pre connector for a branch. This is the connector that precedes the first node in a branch.
 *
 * @param parentNode - The branch's parent node
 * @param childIndex - The branch index
 * @param context - The flow rendering index
 * @param height - The height of the connector
 * @returns A ConnectorRenderInfo for the pre connector
 */
function createPreConnector(
    parentNode: ParentNodeModel,
    childIndex: number,
    context: FlowRenderContext,
    height: number
): ConnectorRenderInfo {
    const { progress, nodeLayoutMap, interactionState } = context;

    const branchLayout = getBranchLayout(parentNode.guid, childIndex, progress, nodeLayoutMap);
    const isEmptyBranch = parentNode.children[childIndex] == null;

    let variant;
    if (childIndex === 0 || childIndex === parentNode.children.length - 1) {
        variant = ConnectorVariant.EDGE;
    } else if (branchLayout.x === 0) {
        variant = ConnectorVariant.CENTER;
    }
    const conditionOptions = createConditionOptions(parentNode, context);

    return createConnectorToNextNode(
        { parent: parentNode.guid, childIndex },
        isEmptyBranch ? ConnectorType.BRANCH_EMPTY_HEAD : ConnectorType.BRANCH_HEAD,
        0,
        height,
        isMenuOpened(getBranchLayoutKey(parentNode.guid, childIndex), MenuType.CONNECTOR, interactionState),
        context.layoutConfig,
        variant,
        conditionOptions
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

    return [0, parentNode.children.length - 1].map(branchIndex => {
        const branchLayout = getBranchLayout(parentNode.guid, branchIndex, progress, nodeLayoutMap);
        return createBranchConnector(parentNode.guid, branchIndex, branchLayout, layoutConfig);
    });
}

/**
 * Creates the left and right merge connectors for a branching node
 *
 * @param parentNode - The branching node
 * @param context - The flow rendering context
 * @param layoutConfig - The config for the layout
 * @returns An array of ConnectorRenderInfo for the connectors
 */
function createMergeConnectors(
    parentNode: ParentNodeModel,
    joinOffsetY: number,
    context: FlowRenderContext,
    leftMergeIndex: number,
    rightMergeIndex: number
): ConnectorRenderInfo[] {
    const { progress, nodeLayoutMap } = context;
    const mergeConnectors = [];

    if (leftMergeIndex != null) {
        const branchLayout = getBranchLayout(parentNode.guid, leftMergeIndex!, progress, nodeLayoutMap);
        if (branchLayout.x < 0) {
            mergeConnectors.push(
                createMergeConnector(parentNode.guid, leftMergeIndex!, branchLayout, joinOffsetY, context.layoutConfig)
            );
        }
    }
    if (rightMergeIndex != null) {
        const branchLayout = getBranchLayout(parentNode.guid, rightMergeIndex!, progress, nodeLayoutMap);
        if (branchLayout.x > 0) {
            mergeConnectors.push(
                createMergeConnector(parentNode.guid, rightMergeIndex!, branchLayout, joinOffsetY, context.layoutConfig)
            );
        }
    }

    return mergeConnectors;
}

// function renderBranchChild(node: ParentNodeModel, i: number): FlowRenderInfo {
//     return renderNestedFlow(node, i);
// }

// function renderNestedFlow(parent: ParentNodeModel, childIndex: number): FlowRenderInfo {
//     const isFault = parent.fault != null;

//     // TODO
//     // // for a fault we don't want any animation of the nested flow position
//     // const childLayout = isFault
//     //     ? _nodeLayoutMap[node.guid].layout
//     //     : getLayout(node, progress);
//     return renderFlowHelper(parent, childIndex, isFault);
// }

// function renderLoopNode(node: ParentNodeModel, isFault: boolean): NodeRenderInfo {
//     const nodeRenderInfo = renderSimpleNode(node);

//     const nodeLayout = getLayout(node);
//     const { x, y, h, w } = nodeLayout;
//     const childNode = resolveNode(flowModel, node.children[0]);
//     const childLayout = getLayout(childNode);

//     // TODO: FIX ME
//     const connectors = [];

//     connectors.push({
//         key: `loop-left_${node.guid}`,
//         connectorType: 'loop-left',
//         sourceX: x - childLayout.w / 2,
//         sourceY: y,
//         svgWidth: w / 2,
//         isFault,
//         svgHeight: h,
//         shouldRender: true
//     });

//     connectors.push({
//         key: `loop-right_${node.guid}`,
//         connectorType: 'loop-right',
//         sourceX: x,
//         sourceY: y,
//         svgWidth: w / 2,
//         svgHeight: childLayout.h,
//         isFault,
//         shouldRender: true
//     });

//     nodeRenderInfo.flows.push(renderNestedFlow(node, 0));

//     return nodeRenderInfo;
// }

// function setFlowModel(flowModel: FlowModel) {
//     flowModel = flowModel;
//     calculateFlowLayout(flowModel, nodeLayoutMap, interactionState, elementsMetadata);

//     return this;
// }

/**
 * Updates a flow's FlowInteractionState so that the menu is toggled
 *
 * @param menuEventDetail - The menu event detail
 * @param interactionState - The flow interaction state
 * @returns A new, updated FlowInteractionState
 */
export function toggleFlowMenu(
    menuEventDetail: MenuEventDetail,
    interactionState: FlowInteractionState
): FlowInteractionState {
    let menuInfo = interactionState.menuInfo;

    if (!menuInfo) {
        const { parent, childIndex, type } = menuEventDetail;
        const key = parent ? getBranchLayoutKey(parent, childIndex) : menuEventDetail.guid;

        menuInfo = {
            key,
            type
        };
    } else {
        menuInfo = null;
    }

    return { ...interactionState, menuInfo };
}

/**
 * Creates a FlowRenderInfo that represents a rendered flow
 *
 * @param context - The context for the flow
 * @returns A FlowRenderInfo for the rendered flow
 */
export function renderFlow(context: FlowRenderContext): FlowRenderInfo {
    const rootNode = getRootNode(context.flowModel);
    return renderFlowHelper(rootNode as ParentNodeModel, 0, context);
}
