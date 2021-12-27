import ConnectorType from './ConnectorTypeEnum';
import {
    ConnectorTypeLayoutConfig,
    ConnectorVariant,
    createDefaultLayout,
    Dimension,
    FlowRenderContext,
    getBranchLayoutKey,
    getConnectorConfig,
    InteractionMenuInfo,
    LayoutConfig,
    LayoutInfo,
    NodeLayout,
    NodeLayoutMap,
    VerticalAlign
} from './flowRendererUtils';
import MenuType from './MenuType';
import {
    FAULT_INDEX,
    FlowModel,
    getElementMetadata,
    Guid,
    NodeModel,
    NodeRef,
    ParentNodeModel,
    resolveNode,
    StartNodeModel
} from './model';
import { areAllBranchesTerminals, fulfillsBranchingCriteria, hasGoToOnBranchHead, hasGoToOnNext } from './modelUtils';
import NodeType from './NodeType';

export const NO_OFFSET = 0;

/**
 * Computes the offset of the (+) button and branch label relative to the top of the connector
 *
 * @param addAndLabelAlign - The alignment for the add button (top or bottom) and the branch label
 * @param height - The height of the connector
 * @param config - The config for the connector
 * @param extraNodeHeight - The extra height for custom nodes
 * @returns The offset of the add button and branch label relative to the top of the connector
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

/**
 * @param key - The guid of the node element
 * @param context - The flow rendering context
 * @returns The menu to position
 */
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
 * @param obj - An object
 * @param obj.menuInfo - The menu info for a node
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
}

/**
 * @param parentGuid - The parent elment guid
 * @param childIndex - The child index
 * @param nodeLayoutMap - The node layout map
 * @returns - The branch layout
 */
function getBranchLayout(parentGuid: string, childIndex: number, nodeLayoutMap: NodeLayoutMap): NodeLayout {
    const key = getBranchLayoutKey(parentGuid, childIndex);
    return nodeLayoutMap[key];
}

/**
 * Set the branch layout
 *
 * @param parentGuid - The parent elment guid
 * @param childIndex - The child index
 * @param nodeLayoutMap - The node layout map
 * @param nodeLayout - The node layout
 */
function setBranchLayout(parentGuid: string, childIndex: number, nodeLayoutMap: NodeLayoutMap, nodeLayout: NodeLayout) {
    const key = getBranchLayoutKey(parentGuid, childIndex);
    nodeLayoutMap[key] = nodeLayout;
}

/**
 * Clone the branch layout
 *
 * @param layout - the layout to clone
 * @returns - The cloned layout
 */
function cloneLayout(layout?: LayoutInfo): LayoutInfo {
    return layout ? { ...layout } : createDefaultLayout();
}

/**
 * Get the type of the next node connector
 *
 * @param flowModel - The flow model
 * @param nodeModel - Model of the source node
 * @param elementType - The current node's NodeType
 * @returns The ConnectorType of the next node connector or null if there is no next node connector
 */
function getNextNodeConnectorType(
    flowModel: FlowModel,
    nodeModel: NodeModel,
    elementType: NodeType
): ConnectorType | null {
    if (hasGoToOnNext(flowModel, nodeModel.guid)) {
        return ConnectorType.GO_TO;
    }
    return elementType === NodeType.END || elementType === NodeType.ROOT ? null : ConnectorType.STRAIGHT;
}

/**
 * Get the variant for the next node connector
 *
 * @param nodeModel - Model of the source node
 * @param elementType - The current node's NodeType
 * @returns Variant of the next node connector
 */
function getNextNodeConnectorVariant(nodeModel: NodeModel, elementType: NodeType): ConnectorVariant {
    let nextNodeConnectorVariant =
        fulfillsBranchingCriteria(nodeModel, elementType) || elementType === NodeType.LOOP
            ? ConnectorVariant.POST_MERGE
            : !(nodeModel as ParentNodeModel).children && (nodeModel as StartNodeModel).shouldSupportScheduledPaths
            ? ConnectorVariant.DEFAULT_LABEL
            : ConnectorVariant.DEFAULT;

    if (nodeModel.next == null) {
        nextNodeConnectorVariant =
            nextNodeConnectorVariant === ConnectorVariant.POST_MERGE
                ? ConnectorVariant.POST_MERGE_TAIL
                : ConnectorVariant.BRANCH_TAIL;
    }

    return nextNodeConnectorVariant;
}

/**
 * Get the type of the branch head connector
 *
 * @param flowModel - The flow model
 * @param parentNodeModel - Model of the parent node
 * @param childIndex - The branch index we are evaluating for
 * @param parentNodeType - Parent Node's NodeType
 * @returns The ConnectorType of the branch head connector
 */
function getBranchHeadConnectorType(
    flowModel: FlowModel,
    parentNodeModel: ParentNodeModel,
    childIndex: number,
    parentNodeType: NodeType
): ConnectorType | null {
    if (hasGoToOnBranchHead(flowModel, parentNodeModel.guid, childIndex)) {
        return ConnectorType.GO_TO;
    }
    return parentNodeType === NodeType.END || parentNodeType === NodeType.ROOT ? null : ConnectorType.STRAIGHT;
}

/**
 * Get the variant for the next node connector
 *
 * @param branchHeadGuid - The branch head guid
 * @param parentNodeModel - Model of the parent node
 * @param parentNodeType - Parent Node's NodeType
 * @returns Variant of the branch head connector
 */
function getBranchHeadConnectorVariant(
    branchHeadGuid: Guid | null,
    parentNodeModel: ParentNodeModel,
    parentNodeType: NodeType
) {
    let nextNodeConnectorVariant = branchHeadGuid == null ? ConnectorVariant.BRANCH_TAIL : ConnectorVariant.FAULT;

    if (fulfillsBranchingCriteria(parentNodeModel, parentNodeType) || parentNodeType === NodeType.LOOP) {
        nextNodeConnectorVariant =
            branchHeadGuid == null ? ConnectorVariant.BRANCH_HEAD_EMPTY : ConnectorVariant.BRANCH_HEAD;
    }

    return nextNodeConnectorVariant;
}

/**
 * Calculates the extra height needed so that an opened menu doens't overlap over its next node
 *
 * @param obj - An object
 * @param obj.menuInfo - The menu info for a node
 * @param obj.elementType - The element type
 * @param obj.connectorType - The connector type
 * @param obj.connectorVariant - The connector variant
 * @param obj.connectorHeight - The connector height
 * @param obj.layoutConfig - the Layout config
 * @param obj.hasNext - true if the element as next
 * @param obj.joinOffsetY - The join offset Y
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
    return getElementMetadata(context.elementsMetadata, nodeModel.elementSubtype || nodeModel.elementType).type;
}

/**
 * Calculates the extra height needed for a node in the case it has dynamic content
 *
 * @param context - The flow render context
 * @param guid - The guid of the node
 * @returns - The extra height needed
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
    const nextNodeConnectorType = getNextNodeConnectorType(flowModel, nodeModel, elementType);
    const nextNodeConnectorVariant = getNextNodeConnectorVariant(nodeModel, elementType);

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

    const connectorConfig = getConnectorConfig(
        layoutConfig,
        nextNodeConnectorType ? nextNodeConnectorType : ConnectorType.STRAIGHT,
        nextNodeConnectorVariant
    );

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
            if (hasGoToOnBranchHead(context.flowModel, nodeModel.guid, i)) {
                // When all branches are empty and merge together, and one of them has a goTo connection
                // we add some extra height to add some space between the goTo connector and the merge point
                h = Math.max(
                    h,
                    branchLayout.h +
                        getConnectorConfig(context.layoutConfig, ConnectorType.STRAIGHT, ConnectorVariant.BRANCH_TAIL)
                            .h /
                            2
                );
            } else {
                h = Math.max(h, branchLayout.h);
            }
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
 * @param childIndex - the index of the child or fault
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

    const nextNodeConnectorType = getBranchHeadConnectorType(flowModel, parentNodeModel, childIndex, parentNodeType)!;
    const nextNodeConnectorVariant = getBranchHeadConnectorVariant(branchHeadGuid, parentNodeModel, parentNodeType);

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

    const faultLayouts: LayoutInfo[] = [];

    let leftWidth = 0;
    let rightWidth = 0;
    let prevNode;

    let hasGoToOnTail = false;

    // Iterating down the nodes and calculating the node layout only if there' no GoTo connection from the branch
    if (!hasGoToOnBranchHead(flowModel, parentNodeModel.guid, childIndex)) {
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

            hasGoToOnTail = hasGoToOnNext(flowModel, node.guid);
            node = next && !hasGoToOnTail ? resolveNode(flowModel, next) : null;
        }
    }

    // Updating layout for all the Fault Branches in a given flow (straight line) such that they don't overlap
    faultLayouts.reverse().forEach((faultLayout) => {
        height = Math.max(faultLayout.y + faultLayout.h, height);
        faultLayout.x = rightWidth + faultLayout.offsetX;
        rightWidth += faultLayout.w;
    });

    // for ended nested branches, we need to some extra height so that they dont't overlap with the merge/loop after connectors
    if ((prevNode != null && getElementType(context, prevNode) === NodeType.END) || hasGoToOnTail) {
        height += getConnectorConfig(layoutConfig, ConnectorType.STRAIGHT, ConnectorVariant.BRANCH_TAIL).h / 2;
    }

    if (branchHeadGuid == null) {
        leftWidth = rightWidth = layoutConfig.branch.emptyWidth / 2;
    }

    let widthWithGoToOnBranchHead = layoutConfig.node.w;
    if (parentNodeModel.nodeType === NodeType.LOOP && parentNodeModel.children[0] != null) {
        // Adding extra width to push out the After Last connector when there's a GoTo another element present
        // in the For-Each branch. This is needed to avoid long labels from overlapping with the After Last connector
        widthWithGoToOnBranchHead += layoutConfig.branch.extraWidthForAfterLast;
        rightWidth += layoutConfig.branch.extraWidthForAfterLast;
    }

    return hasGoToOnBranchHead(flowModel, parentNodeModel.guid, childIndex)
        ? Object.assign(branchLayout, { w: widthWithGoToOnBranchHead, h: height, offsetX: layoutConfig.node.offsetX })
        : Object.assign(branchLayout, { w: leftWidth + rightWidth, h: height, offsetX: leftWidth });
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
