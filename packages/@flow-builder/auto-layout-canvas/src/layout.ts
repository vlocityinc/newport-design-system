import { NodeModel, resolveNode, ParentNodeModel, NodeRef, getElementMetadata, FAULT_INDEX } from './model';
import { FlowRenderContext, LayoutConfig } from './flowRendererUtils';
import MenuType from './MenuType';
import ElementType from './ElementType';
import ConnectorType from './ConnectorTypeEnum';

export const NO_OFFSET = 0;

export interface LayoutInfo {
    x: number;
    y: number;
    w: number;
    h: number;
    joinOffsetY: number;
    offsetX: number;
}

export interface NodeLayout {
    prevLayout?: LayoutInfo | undefined;
    layout: LayoutInfo;
}

export interface NodeLayoutMap {
    [key: string]: NodeLayout;
}

/**
 * Returns the MenuType of a menu that is opened for a node
 *
 * @param key - The menu key (the node guid for which the menu is opened)
 * @param context - The flow rendering context
 * @returns The MenuType if a menu is opened for the specified key, null otherwise
 */
function getMenuType(key: NodeRef, context: FlowRenderContext): MenuType | null {
    const { interactionState } = context;
    const menuInfo = interactionState.menuInfo;

    if (menuInfo && menuInfo.key === key) {
        return menuInfo.type;
    } else {
        return null;
    }
}

/**
 * Returns the height of a menu
 *
 * @returns The height of the menu
 */
function getMenuHeight({
    menuType,
    elementType,
    layoutConfig
}: {
    menuType: MenuType;
    elementType?: ElementType;
    connectorType?: ConnectorType;
    layoutConfig: LayoutConfig;
}): number {
    if (menuType === MenuType.CONNECTOR) {
        return layoutConfig.connector.menu.h;
    } else {
        return layoutConfig.node.menu[elementType!]!.h;
    }
}

/**
 * Default algorithm for calculating the NodeLayout information for nodes. Updates
 * the nodeLayoutMap in the flow render context
 *
 * @param context - The flow render context
 */
function calculateFlowLayout(context: FlowRenderContext): void {
    const startNodeIndex = 0;
    calculateBranchLayout(context.flowModel.root as ParentNodeModel, startNodeIndex, context);
    // console.log(context.nodeLayoutMap);
}

function createDefaultLayout(): LayoutInfo {
    return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        joinOffsetY: 0,
        offsetX: 0
    };
}

function getBranchLayoutKey(parentGuid: string, childIndex: number) {
    return `${parentGuid}:${childIndex}`;
}

function getBranchLayout(parentGuid: string, childIndex: number, nodeLayoutMap: NodeLayoutMap): NodeLayout {
    const key = getBranchLayoutKey(parentGuid, childIndex);
    return nodeLayoutMap[key];
}

function setBranchLayout(parentGuid: string, childIndex: number, nodeLayoutMap: NodeLayoutMap, nodeLayout: NodeLayout) {
    const key = getBranchLayoutKey(parentGuid, childIndex);
    nodeLayoutMap[key] = nodeLayout;
}

function cloneLayout(layout?: LayoutInfo): LayoutInfo {
    return layout ? { ...layout } : createDefaultLayout();
}

/**
 * Get the type of the next node connector
 *
 * @param elementType - The current node's ElementType
 * @param nodeGuid - The current node's guid
 * @param nextNodeGuid - The next node's guid
 * @param isBranchHead - Whether this is a branch head
 * @returns The ConnectorType of the next node connector or null if there is no next node connector
 */
function getNextNodeConnectorType(
    elementType: ElementType,
    nodeGuid: NodeRef,
    nextNodeGuid: NodeRef,
    isBranchHead: boolean
): ConnectorType | null {
    let nextNodeConnectorType;

    if (elementType === ElementType.END || elementType === ElementType.ROOT) {
        nextNodeConnectorType = null;
    } else if (elementType === ElementType.BRANCH || elementType === ElementType.LOOP) {
        if (isBranchHead) {
            nextNodeConnectorType = nodeGuid == null ? ConnectorType.BRANCH_EMPTY_HEAD : ConnectorType.BRANCH_HEAD;
        } else {
            nextNodeConnectorType = ConnectorType.POST_MERGE;
        }
    } else if (nextNodeGuid == null) {
        nextNodeConnectorType = ConnectorType.BRANCH_TAIL;
    } else {
        nextNodeConnectorType = ConnectorType.STRAIGHT;
    }

    return nextNodeConnectorType;
}

/**
 * Returns the height of a connector
 *
 * @param connectorType - The type of the connector
 * @param layoutConfig - The config for the layout
 * @returns The height of a connector
 */
function getConnectorHeight(connectorType: ConnectorType, layoutConfig: LayoutConfig): number {
    return connectorType == null ? 0 : layoutConfig.connector.types[connectorType]!.h;
}

/**
 * Returns the extra height needed so that an opened menu doens't overlap over its next node
 * @returns The amount of extra height needed
 */
function getExtraHeightForMenu({
    menuType,
    elementType,
    connectorType,
    connectorHeight,
    layoutConfig,
    hasNext
}: {
    menuType: MenuType | null;
    elementType?: ElementType;
    connectorType?: ConnectorType;
    connectorHeight: number;
    layoutConfig: LayoutConfig;
    hasNext: boolean;
}): number {
    if (menuType == null) {
        return 0;
    }

    const menuHeight = getMenuHeight({ menuType, elementType, layoutConfig });
    const menuMarginBottom = layoutConfig.menu.marginBottom;
    const menuTriggerOffset =
        menuType === MenuType.CONNECTOR ? layoutConfig.connector.types[connectorType!]!.addOffset : 0;

    const halfIconSize = layoutConfig.node.icon.h / 2;
    const heightFromMenuTriggerToNextNode = connectorHeight - menuTriggerOffset - (hasNext ? halfIconSize : 0);
    const menuSpacingToNextNode = heightFromMenuTriggerToNextNode - menuHeight;

    return menuSpacingToNextNode < menuMarginBottom ? menuMarginBottom - menuSpacingToNextNode : 0;
}

/**
 * Get the ElementType of a node
 *
 * @param context - The flow render context
 * @param nodeModel - The node model
 * @returns the ElementType for the node
 */
function getElementType(context: FlowRenderContext, nodeModel: NodeModel): ElementType {
    return getElementMetadata(context.elementsMetadata, nodeModel.elementType).type;
}

/**
 * Calculates the layout for a node
 *
 * @param nodeModel - The node model
 * @param context - The flow rendering context
 * @param offsetY  - The node's offset in its parent
 * @returns A NodeLayout for the node
 */
function calculateNodeLayout(nodeModel: NodeModel, context: FlowRenderContext, offsetY: number): NodeLayout {
    const { nodeLayoutMap, layoutConfig } = context;

    let layout;
    const { guid } = nodeModel;
    let layoutInfo = nodeLayoutMap[guid];

    // handle the layout for any branches
    const branchingInfo = calculateBranchingLayout(nodeModel as ParentNodeModel, context, offsetY);

    if (nodeModel.fault != null) {
        calculateBranchLayout(nodeModel as ParentNodeModel, FAULT_INDEX, context);
    }

    const elementType = getElementType(context, nodeModel);
    const nextNodeConnectorType = getNextNodeConnectorType(elementType, nodeModel.guid, nodeModel.next, false);
    const nextNodeConnectorHeight =
        nextNodeConnectorType != null ? getConnectorHeight(nextNodeConnectorType, layoutConfig) : 0;

    let height = nextNodeConnectorHeight + branchingInfo.h;

    const menuType = getMenuType(guid, context);

    height +=
        menuType != null
            ? getExtraHeightForMenu({
                  hasNext: nodeModel.next != null,
                  menuType,
                  elementType,
                  connectorType: nextNodeConnectorType!,
                  connectorHeight:
                      menuType === MenuType.CONNECTOR && nextNodeConnectorType === ConnectorType.POST_MERGE
                          ? nextNodeConnectorHeight
                          : height,
                  layoutConfig
              })
            : 0;

    const isNew = layoutInfo == null;

    if (isNew) {
        layout = Object.assign(createLayoutForNewNode(nodeModel, nodeLayoutMap), {
            offsetY,
            joinOffsetY: branchingInfo.h
        });
    }

    layoutInfo = layoutInfo || { layout };
    layoutInfo = {
        prevLayout: isNew ? undefined : cloneLayout(layoutInfo.layout),
        layout: {
            w: Math.max(branchingInfo.w, layoutConfig.node.w),
            h: height,
            y: offsetY,
            x: 0,
            joinOffsetY: branchingInfo.h,
            offsetX: Math.max(branchingInfo.offsetX, layoutConfig.node.offsetX)
        }
    };

    nodeLayoutMap[nodeModel.guid] = layoutInfo;

    return layoutInfo;
}

/**
 * Creates a layout object for a new node
 *
 * @param nodeModel - The node
 * @param nodeLayoutMap  - The nodeLayoutMap
 * @returns The layout info for the new node
 */
function createLayoutForNewNode(nodeModel: NodeModel, nodeLayoutMap: NodeLayoutMap): LayoutInfo {
    // if we just inserted a node, set its layout to
    // the next node's previous layout (ie, the next node's location before
    // it was pushed down by the connector menu)

    const next = nodeModel.next;
    const nextLayoutInfo = next ? nodeLayoutMap[next] : null;
    return nextLayoutInfo != null ? cloneLayout(nextLayoutInfo.prevLayout) : createDefaultLayout();
}

/**
 * Calculates the branching layout
 *
 * @param nodeModel - The branching node model
 * @param context - The flow render context
 * @param offsetY - The offset-y of the branching element
 * @returns branching layout information
 */
function calculateBranchingLayout(nodeModel: ParentNodeModel, context: FlowRenderContext, offsetY: number) {
    const type = getElementType(context, nodeModel);

    const children = nodeModel.children || [];

    if (children.length < 1) {
        return { w: 0, h: 0, offsetX: 0 };
    }

    let branchOffsetX = 0;
    let offsetX;
    let w;
    let h = 0;

    if (type === ElementType.LOOP) {
        const lastConnectorSpacing = context.layoutConfig.grid.h * 2.5;

        const branchLayout = calculateBranchLayout(nodeModel, 0, context, offsetY);
        offsetX = branchLayout.offsetX + lastConnectorSpacing;
        branchLayout.x = 0;
        branchLayout.h += context.layoutConfig.grid.h;
        h = branchLayout.h;
        w = branchLayout.w + 2 * lastConnectorSpacing;
    } else {
        const branchLayouts = children.map((child, i) => {
            const branchLayout = calculateBranchLayout(nodeModel, i, context, offsetY);

            // make the branch's stem the origin
            branchLayout.x = branchOffsetX + branchLayout.offsetX;

            branchOffsetX += branchLayout.w;
            h = Math.max(h, branchLayout.h);
            return branchLayout;
        });

        offsetX = centerLayouts(branchLayouts);
        w = branchOffsetX;
    }

    return { w, h, offsetX };
}

/**
 * Returns a node's child or fault
 *
 * @param nodeModel - The parent node
 * @param childIndex - The the index of the child or fault
 * @returns The child or fault corresponding childIndex
 */
function getLayoutChildOrFault(nodeModel: ParentNodeModel, childIndex: number) {
    return childIndex === FAULT_INDEX ? nodeModel.fault : nodeModel.children[childIndex];
}

/**
 * Calculates the layout of a branch and each of its nodes recursively and adds
 * the layout to the FlowRenderContext's nodeLayoutMap
 *
 * @param parentNodeModel - The branching element
 * @param childIndex - The index of the branch
 * @param context - The flow rendering context
 * @param offsetY - The y-offset of the branching node in its flow
 * @returns The LayoutInfo for the branch
 */
function calculateBranchLayout(
    parentNodeModel: ParentNodeModel,
    childIndex: number,
    context: FlowRenderContext,
    offsetY: number = 0
): LayoutInfo {
    const { flowModel, nodeLayoutMap, layoutConfig } = context;

    const prevLayout = getBranchLayout(parentNodeModel.guid, childIndex, nodeLayoutMap)
        ? getBranchLayout(parentNodeModel.guid, childIndex, nodeLayoutMap).layout
        : { ...createDefaultLayout(), y: offsetY };

    const branchLayout = createDefaultLayout();

    setBranchLayout(parentNodeModel.guid, childIndex, nodeLayoutMap, {
        prevLayout,
        layout: branchLayout
    });

    const parentNodeType = getElementType(context, parentNodeModel);
    const branchHeadGuid = getLayoutChildOrFault(parentNodeModel, childIndex);

    let node: NodeModel | null = branchHeadGuid != null ? resolveNode(flowModel, branchHeadGuid) : null;

    const nextNodeConnectorType: ConnectorType = getNextNodeConnectorType(
        parentNodeType,
        branchHeadGuid,
        branchHeadGuid,
        true
    )!;

    let height = getConnectorHeight(nextNodeConnectorType, layoutConfig);

    const menuType = getMenuType(getBranchLayoutKey(parentNodeModel.guid, childIndex), context);

    height += getExtraHeightForMenu({
        hasNext: branchHeadGuid != null,
        menuType,
        connectorType: nextNodeConnectorType,
        connectorHeight: height,
        layoutConfig
    });

    let faultLayout;

    let isTerminal = false;

    let leftWidth = 0;
    let rightWidth = 0;

    while (node) {
        const { layout } = calculateNodeLayout(node, context, height);

        const nodeType = getElementType(context, node);
        isTerminal =
            isTerminal || (nodeType === ElementType.END && parentNodeModel.next != null) || childIndex === FAULT_INDEX;

        if (node.fault != null) {
            faultLayout = getBranchLayout(node.guid, FAULT_INDEX, nodeLayoutMap).layout;

            // extra height so that the fault doesn't overlap with the merge connectors
            faultLayout.y = height + layoutConfig.grid.h;
        }

        layout.y = height;

        rightWidth = Math.max(layout.w - layout.offsetX, rightWidth);
        leftWidth = Math.max(leftWidth, layout.offsetX);
        height += layout.h;

        const next = node.next;
        node = next ? resolveNode(flowModel, next) : null;
    }

    // if we have a fault, we might need to extend the branch height, otherwise it could overlap the merge connectors
    if (faultLayout != null) {
        height = Math.max(faultLayout.y + faultLayout.h, height);
        faultLayout.x = rightWidth + faultLayout.offsetX;
        rightWidth = rightWidth + faultLayout.w;
    }

    // for faults and terminal branches we need to some extra height so that it won't overlap the merge connectors
    if (isTerminal) {
        height += getConnectorHeight(ConnectorType.BRANCH_TAIL, layoutConfig);
    }

    if (branchHeadGuid == null) {
        leftWidth = rightWidth = layoutConfig.branch.emptyWidth / 2;
    }

    return Object.assign(branchLayout, { w: leftWidth + rightWidth, h: height, offsetX: leftWidth });
}

/**
 * Adjusts the offsets so that the branch is centered relative to the parent connector
 *
 * @param branchLayouts - The branch layouts
 * @returns The offsetX of the branches
 */
function centerLayouts(branchLayouts: LayoutInfo[]): number {
    let adjust = 0;
    if (branchLayouts.length > 1) {
        const firstBranchLayout = branchLayouts[0];
        const lastBranchLayout = branchLayouts[branchLayouts.length - 1];
        adjust = firstBranchLayout.offsetX + (lastBranchLayout.x - firstBranchLayout.x) / 2;
    }

    let offsetX = 0;
    branchLayouts.forEach((branchLayout, i) => {
        branchLayout.x = branchLayout.x - adjust;
        if (i === 0) {
            offsetX = Math.abs(branchLayout.x) + branchLayout.offsetX;
        }
    });

    return offsetX;
}

export { calculateFlowLayout, getBranchLayoutKey, getLayoutChildOrFault };

// function centerLayouts(branchLayouts: LayoutInfo[]): number {
//     let maxSpacing = 0;

//     for (let i = 0; i < branchLayouts.length - 1; i++) {
//         maxSpacing = Math.max(branchLayouts[i + 1].x - branchLayouts[i].x, maxSpacing);
//     }

//     let spacingOffsetX = 0;
//     for (let i = 1; i < branchLayouts.length; i++) {
//         const spacing = branchLayouts[i].x - branchLayouts[i - 1].x;
//         const diffSpacing = maxSpacing - spacing;
//         if (diffSpacing !== 0) {
//             spacingOffsetX += diffSpacing;
//             branchLayouts[i].w += diffSpacing;
//             branchLayouts[i].x += spacingOffsetX;
//             branchOffsetX += diffSpacing;
//         }
//     }
//     const firstBranchLayout = branchLayouts[0];
//     const lastBranchLayout = branchLayouts[branchLayouts.length - 1];
//     return firstBranchLayout.offsetX + (lastBranchLayout.x - firstBranchLayout.x) / 2;
// }

// function resetLayouts(
//     node: NodeModel | null,
//     flowModel: FlowModel,
//     nodeLayoutMap: NodeLayoutMap
// ) {
//     while (node) {
//         nodeLayoutMap[node.guid] = {
//             layout: createDefaultLayout()
//         };
//         node = node.next ? resolveNode(flowModel, node.next) : null;
//     }
// }
