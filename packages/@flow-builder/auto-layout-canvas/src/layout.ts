import { NodeModel, resolveNode, ParentNodeModel, NodeRef, Guid, getElementMetadata, FAULT_INDEX } from './model';
import { areAllBranchesTerminals, shouldSupportTimeTriggers, fulfillsBranchingCriteria } from './modelUtils';
import {
    FlowRenderContext,
    LayoutConfig,
    getConnectorConfig,
    ConnectorVariant,
    LayoutInfo,
    NodeLayout,
    NodeLayoutMap,
    getBranchLayoutKey,
    InteractionMenuInfo,
    Dimension,
    VerticalAlign,
    ConnectorTypeLayoutConfig
} from './flowRendererUtils';
import MenuType from './MenuType';
import NodeType from './NodeType';
import ConnectorType from './ConnectorTypeEnum';

export const NO_OFFSET = 0;

/**
 * Computes the offset of the (+) button and branch label relative to the top of the connector
 *
 * @param addAndLabelAlign - The alignment for the add button (top or bottom) and the branch label
 * @param height - The height of the connector
 * @param config - The config for the connector
 * @param extraNodeHeight - The extra height for custom nodes
 * @return The offset of the add button and branch label relative to the top of the connector
 */
function getAddAndLabelOffsets(
    addAndLabelAlign: VerticalAlign,
    height: number,
    config: ConnectorTypeLayoutConfig,
    extraNodeHeight: number
): { addOffset: number; labelOffset: number } {
    const { labelOffset, addOffset, h } = config;
    const addOffsetFromTop = addOffset + extraNodeHeight;
    const addOffsetFromBottom = height - (h - addOffset);
    const labelOffsetFromTop = labelOffset != null ? labelOffset + extraNodeHeight : 0;
    const labelOffsetFromBottom = labelOffset != null ? height - (h - labelOffset) : 0;

    return addAndLabelAlign === VerticalAlign.TOP
        ? { addOffset: addOffsetFromTop, labelOffset: labelOffsetFromTop }
        : { addOffset: addOffsetFromBottom, labelOffset: labelOffsetFromBottom };
}

function getMenuNeedToPosition(key: NodeRef, context: FlowRenderContext): boolean {
    const { interactionState } = context;
    const { menuInfo } = interactionState;

    return menuInfo != null && menuInfo.key === key && menuInfo.needToPosition;
}

/**
 * Returns the menu info for a node if its menu is opened
 *
 * @param key - The menu key (the node guid for which the menu is opened)
 * @param context - The flow rendering context
 * @returns The menu info for a node if its menu is opened or null otherwise
 */
function getMenuInfo(key: NodeRef, context: FlowRenderContext): InteractionMenuInfo | null {
    const { interactionState } = context;
    const menuInfo = interactionState.menuInfo;

    return menuInfo && menuInfo.key === key ? menuInfo : null;
}

/**
 * Returns the height of a menu
 *
 * @returns The height of the menu
 */
function getMenuHeight({ menuInfo }: { menuInfo: InteractionMenuInfo }): number {
    const { geometry } = menuInfo;

    return geometry != null ? geometry.h : 0;
}

/**
 * Default algorithm for calculating the NodeLayout information for nodes. Updates
 * the nodeLayoutMap in the flow render context
 *
 * @param context - The flow render context
 */
function calculateFlowLayout(context: FlowRenderContext): void {
    const startNodeIndex = 0;
    calculateBranchLayout(context.flowModel.root as ParentNodeModel, startNodeIndex, context, 0);
    // console.log(context.nodeLayoutMap);
}

function createDefaultLayout(): LayoutInfo {
    return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        joinOffsetY: 0,
        offsetX: 0,
        addOffset: 0,
        labelOffset: 0
    };
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
 * @returns The ConnectorType of the next node connector or null if there is no next node connector
 */
function getNextNodeConnectorType(nodeType: NodeType): ConnectorType | null {
    return nodeType === NodeType.END || nodeType === NodeType.ROOT ? null : ConnectorType.STRAIGHT;
}

/**
 * Calculates the extra height needed so that an opened menu doens't overlap over its next node
 *
 * @returns The amount of extra height needed
 */
function calculateExtraHeightForMenu({
    menuInfo,
    connectorType,
    connectorVariant,
    connectorHeight,
    layoutConfig,
    hasNext,
    joinOffsetY
}: {
    menuInfo: InteractionMenuInfo;
    elementType?: NodeType;
    connectorType: ConnectorType;
    connectorVariant: ConnectorVariant;
    connectorHeight: number;
    layoutConfig: LayoutConfig;
    hasNext: boolean;
    joinOffsetY: number;
}): number {
    if (menuInfo == null) {
        return 0;
    }

    const menuHeight = getMenuHeight({ menuInfo });
    const menuMarginBottom = layoutConfig.menu.marginBottom;
    const halfIconSize = layoutConfig.node.icon.h / 2;

    let extraHeight;
    if (menuInfo.type === MenuType.CONNECTOR) {
        const addTriggerOffset = getConnectorConfig(layoutConfig, connectorType, connectorVariant).addOffset;
        const heightFromMenuTriggerToNextNode = connectorHeight - addTriggerOffset - (hasNext ? halfIconSize : 0);
        const menuSpacingToNextNode = heightFromMenuTriggerToNextNode - menuHeight;
        extraHeight = menuMarginBottom - menuSpacingToNextNode;
    } else {
        // For connector variants default_label, branch_head or branch_head_empty,
        // the labelOffset is used to to calculate the extraHeight instead of addOffset
        const { labelOffset, addOffset } = getConnectorConfig(layoutConfig, connectorType, connectorVariant);
        extraHeight = menuHeight + menuMarginBottom;
        extraHeight =
            labelOffset != null &&
            (connectorVariant === ConnectorVariant.DEFAULT_LABEL ||
                connectorVariant === ConnectorVariant.BRANCH_HEAD ||
                connectorVariant === ConnectorVariant.BRANCH_HEAD_EMPTY)
                ? extraHeight - labelOffset
                : extraHeight - (addOffset + joinOffsetY);
    }

    return extraHeight > 0 ? extraHeight : 0;
}

/**
 * Get the ElementType of a node
 *
 * @param context - The flow render context
 * @param nodeModel - The node model
 * @returns the ElementType for the node
 */
function getElementType(context: FlowRenderContext, nodeModel: NodeModel): NodeType {
    return getElementMetadata(context.elementsMetadata, nodeModel.elementType).type;
}

/**
 * Calculates the extra height needed for a node in the case it has dynamic content
 *
 * @param context - The flow render context
 * @param guid - The guid of the node
 *
 * @return - The extra height needed
 */
function calculateExtraHeightForNode(context: FlowRenderContext, guid: Guid) {
    const { layoutConfig, dynamicNodeDimensionMap } = context;
    const dynamicDimensions: Dimension | undefined = dynamicNodeDimensionMap && dynamicNodeDimensionMap.get(guid);
    const halfIconWidth = layoutConfig.node.icon.w * (3 / 4);
    return dynamicDimensions ? dynamicDimensions.h - halfIconWidth : 0;
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
    const { nodeLayoutMap, layoutConfig, flowModel } = context;

    let layout;
    const { guid } = nodeModel;
    let layoutInfo = nodeLayoutMap[guid];

    // handle the layout for any branches
    const branchingInfo = calculateBranchingLayout(nodeModel as ParentNodeModel, context, offsetY);

    if (nodeModel.fault != null) {
        calculateBranchLayout(nodeModel as ParentNodeModel, FAULT_INDEX, context, 0);
    }

    const elementType = getElementType(context, nodeModel);
    // nodeModel.next == null => tail
    const nextNodeConnectorType = getNextNodeConnectorType(elementType);
    let nextNodeConnectorVariant =
        fulfillsBranchingCriteria(nodeModel, elementType) || elementType === NodeType.LOOP
            ? ConnectorVariant.POST_MERGE
            : !(nodeModel as ParentNodeModel).children && shouldSupportTimeTriggers(nodeModel)
            ? ConnectorVariant.DEFAULT_LABEL
            : ConnectorVariant.DEFAULT;

    if (nodeModel.next == null) {
        nextNodeConnectorVariant =
            nextNodeConnectorVariant === ConnectorVariant.POST_MERGE
                ? ConnectorVariant.POST_MERGE_TAIL
                : ConnectorVariant.BRANCH_TAIL;
    }

    const nextNodeConnectorHeight =
        nextNodeConnectorType != null
            ? getConnectorConfig(layoutConfig, nextNodeConnectorType, nextNodeConnectorVariant).h
            : 0;

    let height = branchingInfo.h;
    let width = branchingInfo.w;

    // For dynamically rendered nodes, use the rendered height as the basis for height calculations
    // shifted for half the icon size due to the difference between layout and display coordinates
    //
    // width can be used as is
    const dynamicDimensions: Dimension | undefined =
        context.dynamicNodeDimensionMap && context.dynamicNodeDimensionMap.get(nodeModel.guid);

    let extraHeightForNode = 0;
    if (dynamicDimensions) {
        extraHeightForNode = calculateExtraHeightForNode(context, nodeModel.guid);
        height = Math.max(height, extraHeightForNode);

        const halfIconWidth = layoutConfig.node.icon.w / 2;
        const dynamicWidth = dynamicDimensions.w + halfIconWidth;
        width = Math.max(width, dynamicWidth);
    }

    const isBranchingAllTerminals =
        fulfillsBranchingCriteria(nodeModel, elementType) &&
        areAllBranchesTerminals(nodeModel as ParentNodeModel, flowModel);

    if (nodeModel.next != null || !isBranchingAllTerminals) {
        height += nextNodeConnectorHeight;
    }

    const menuInfo = getMenuInfo(guid, context);
    const needToPosition = getMenuNeedToPosition(guid, context);
    const extraHeightForMenu =
        menuInfo != null && !needToPosition
            ? calculateExtraHeightForMenu({
                  menuInfo,
                  connectorType: nextNodeConnectorType!,
                  connectorHeight: menuInfo.type === MenuType.CONNECTOR ? nextNodeConnectorHeight : 0,
                  layoutConfig,
                  connectorVariant: nextNodeConnectorVariant,
                  hasNext: nodeModel.next != null,
                  joinOffsetY: branchingInfo.h
              })
            : 0;

    // add extra height to account for dynamic nodes and menus
    if (dynamicDimensions && menuInfo?.type === MenuType.NODE) {
        // when the menu height is greater than the node height, we need to add the difference
        height += Math.max(extraHeightForMenu - calculateExtraHeightForNode(context, guid), 0);
    } else {
        height += extraHeightForMenu;
    }

    const isNew = layoutInfo == null;

    if (isNew) {
        layout = Object.assign(createLayoutForNewNode(nodeModel, nodeLayoutMap), {
            offsetY,
            joinOffsetY: branchingInfo.h
        });
    }

    const connectorConfig = getConnectorConfig(layoutConfig, ConnectorType.STRAIGHT, nextNodeConnectorVariant);

    layoutInfo = layoutInfo || {
        layout
    };

    const addAlign = menuInfo != null && menuInfo.type === MenuType.NODE ? VerticalAlign.BOTTOM : VerticalAlign.TOP;

    const joinOffsetY = branchingInfo.h;

    const { addOffset, labelOffset } = getAddAndLabelOffsets(
        addAlign,
        height - joinOffsetY,
        connectorConfig,
        extraHeightForNode
    );

    layoutInfo = {
        prevLayout: isNew ? undefined : cloneLayout(layoutInfo.layout),
        layout: {
            w: Math.max(layoutConfig.node.w, width),
            h: height,
            y: offsetY,
            x: 0,
            joinOffsetY,
            offsetX: Math.max(branchingInfo.offsetX, layoutConfig.node.offsetX),
            addOffset,
            labelOffset
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

    if (type === NodeType.LOOP) {
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
    offsetY: number
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

    const nextNodeConnectorType = getNextNodeConnectorType(parentNodeType)!;
    const nextNodeConnectorVariant = getNextNodeConnectorVariant(branchHeadGuid, parentNodeType, parentNodeModel);

    let height = 0;

    if (nextNodeConnectorType) {
        const connectorConfig = getConnectorConfig(layoutConfig, nextNodeConnectorType, nextNodeConnectorVariant);
        height = connectorConfig.h;
        const { addOffset, labelOffset } = getAddAndLabelOffsets(VerticalAlign.TOP, height, connectorConfig, 0);
        branchLayout.addOffset = addOffset;
        branchLayout.labelOffset = labelOffset;
    }

    const menuInfo = getMenuInfo(getBranchLayoutKey(parentNodeModel.guid, childIndex), context);
    const parentMenuInfo = getMenuInfo(parentNodeModel.guid, context);

    if (menuInfo != null) {
        const menuKey = getBranchLayoutKey(parentNodeModel.guid, childIndex);
        const needToPosition = getMenuNeedToPosition(menuKey, context);

        height += needToPosition
            ? 0
            : calculateExtraHeightForMenu({
                  hasNext: branchHeadGuid != null,
                  menuInfo,
                  connectorType: nextNodeConnectorType,
                  connectorHeight: height,
                  layoutConfig,
                  connectorVariant: nextNodeConnectorVariant,
                  joinOffsetY: 0
              });
    } else if (parentMenuInfo && parentMenuInfo.type === MenuType.NODE) {
        // ensures that associated branch height is adjusted when parent node menu is maximized
        height += calculateExtraHeightForMenu({
            hasNext: branchHeadGuid != null,
            menuInfo: parentMenuInfo,
            connectorType: nextNodeConnectorType,
            connectorHeight: height,
            layoutConfig,
            connectorVariant: nextNodeConnectorVariant,
            joinOffsetY: 0
        });
        const connectorConfig = getConnectorConfig(layoutConfig, nextNodeConnectorType, nextNodeConnectorVariant);
        const { addOffset, labelOffset } = getAddAndLabelOffsets(VerticalAlign.BOTTOM, height, connectorConfig, 0);
        branchLayout.addOffset = addOffset;
        branchLayout.labelOffset = labelOffset;
    }

    const faultLayouts = [];

    let leftWidth = 0;
    let rightWidth = 0;

    let prevNode;
    while (node) {
        const { layout } = calculateNodeLayout(node, context, height);

        if (node.fault != null) {
            const faultLayoutObject = getBranchLayout(node.guid, FAULT_INDEX, nodeLayoutMap).layout;

            // extra height so that the fault doesn't overlap with the merge connectors
            faultLayoutObject.y = height + layoutConfig.grid.h;
            faultLayouts.push(faultLayoutObject);
        }

        layout.y = height;

        rightWidth = Math.max(layout.w - layout.offsetX, rightWidth);
        leftWidth = Math.max(leftWidth, layout.offsetX);
        height += layout.h;

        const next = node.next;
        prevNode = node;
        node = next ? resolveNode(flowModel, next) : null;
    }

    // Updating layout for all the Fault Branches in a given flow (straight line) such that they don't overlap
    faultLayouts.reverse().forEach((faultLayout) => {
        height = Math.max(faultLayout.y + faultLayout.h, height);
        faultLayout.x = rightWidth + faultLayout.offsetX;
        rightWidth += faultLayout.w;
    });

    // for ended nested branches, we need to some extra height so that they dont't overlap with the merge/loop after connectors
    if (prevNode != null && getElementType(context, prevNode) === NodeType.END) {
        height += getConnectorConfig(layoutConfig, ConnectorType.STRAIGHT, ConnectorVariant.BRANCH_TAIL).h / 2;
    }

    if (branchHeadGuid == null) {
        leftWidth = rightWidth = layoutConfig.branch.emptyWidth / 2;
    }

    return Object.assign(branchLayout, { w: leftWidth + rightWidth, h: height, offsetX: leftWidth });
}

/**
 * Get the variant for the next node connector
 *
 * @param parentNodeType - The parent node type
 * @param branchHeadGuid - The branch head guid
 * @returns The next node connector variant
 */
function getNextNodeConnectorVariant(
    branchHeadGuid: Guid | null,
    parentNodeType: NodeType,
    parentNodeModel: ParentNodeModel
) {
    let nextNodeConnectorVariant = branchHeadGuid == null ? ConnectorVariant.BRANCH_TAIL : ConnectorVariant.FAULT;

    if (fulfillsBranchingCriteria(parentNodeModel, parentNodeType) || parentNodeType === NodeType.LOOP) {
        nextNodeConnectorVariant =
            branchHeadGuid == null ? ConnectorVariant.BRANCH_HEAD_EMPTY : ConnectorVariant.BRANCH_HEAD;
    }

    return nextNodeConnectorVariant;
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

export { calculateFlowLayout, getLayoutChildOrFault };

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
