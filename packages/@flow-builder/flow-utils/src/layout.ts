import { NodeModel, resolveNode, ParentNodeModel, NodeRef, getElementMetadata } from './model';
import { FlowRenderContext, LayoutConfig, ConnectorVariant } from './flowRendererUtils';
import MenuType from './MenuType';
import ElementType from './ElementType';
import ConnectorType from './ConnectorTypeEnum';

export interface LayoutInfo {
    x: number;
    y: number;
    w: number;
    h: number;
    joinOffsetY: number;
}

export interface NodeLayout {
    prevLayout?: LayoutInfo | undefined;
    layout: LayoutInfo;
}

export interface NodeLayoutMap {
    [key: string]: NodeLayout;
}

/**
 * Returns the default config for the layout
 *
 * @returns The default config for the layout
 */
export function getDefaultLayoutConfig(): LayoutConfig {
    const gridHeight = 24;

    return {
        grid: {
            w: 132,
            h: gridHeight
        },
        menu: {
            marginBottom: 2 * gridHeight
        },
        connector: {
            strokeWidth: 6,
            curveRadius: 16,
            menu: {
                w: 100,
                h: 360
            },
            types: {
                [ConnectorType.STRAIGHT]: {
                    addOffset: gridHeight * 3,
                    h: 6 * gridHeight
                },
                [ConnectorType.BRANCH_HEAD]: {
                    addOffset: gridHeight * 4.5,
                    labelOffset: gridHeight * 2,
                    h: 7 * gridHeight,
                    variants: {
                        [ConnectorVariant.EDGE]: {
                            svgMarginTop: gridHeight
                        },
                        [ConnectorVariant.CENTER]: { svgMarginBottom: -gridHeight }
                    }
                },
                [ConnectorType.BRANCH_EMPTY_HEAD]: {
                    addOffset: gridHeight * 4.5,
                    labelOffset: gridHeight * 2,
                    h: 6 * gridHeight,
                    variants: {
                        [ConnectorVariant.EDGE]: {
                            svgMarginTop: gridHeight,
                            svgMarginBottom: gridHeight
                        },
                        [ConnectorVariant.CENTER]: { svgMarginBottom: -gridHeight }
                    }
                },
                [ConnectorType.BRANCH_TAIL]: {
                    addOffset: gridHeight * 3,
                    h: 5 * gridHeight,
                    variants: {
                        [ConnectorVariant.EDGE]: {
                            svgMarginBottom: gridHeight
                        },
                        [ConnectorVariant.CENTER]: { svgMarginBottom: -gridHeight }
                    }
                },
                [ConnectorType.POST_MERGE]: {
                    addOffset: gridHeight * 2,
                    h: 5 * gridHeight,
                    svgMarginTop: gridHeight,
                    variants: {
                        [ConnectorVariant.EDGE]: { svgMarginBottom: gridHeight },
                        [ConnectorVariant.CENTER]: { svgMarginBottom: -gridHeight }
                    }
                }
            }
        },
        node: {
            w: 48,
            h: 48,
            menu: {
                [ElementType.DEFAULT]: {
                    w: 100,
                    h: 225
                },
                [ElementType.BRANCH]: {
                    w: 100,
                    h: 225
                },
                [ElementType.START]: {
                    w: 100,
                    h: 150
                },
                [ElementType.END]: {
                    w: 100,
                    h: 150
                }
            }
        }
    };
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
 * Default algorithm for calculating the NodeLayout information for nodes
 *
 * @param flowModel the FlowModel
 * @param nodeLayoutMap the NodeLayoutMap
 */
export function calculateFlowLayout(context: FlowRenderContext) {
    calculateBranchLayout(context.flowModel.root as ParentNodeModel, 0, 0, context);
}

function newDefaultLayout(): LayoutInfo {
    return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        joinOffsetY: 0
    };
}

export function getBranchLayoutKey(parentGuid: string, childIndex: number) {
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
    return layout ? { ...layout } : newDefaultLayout();
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
    } else if (elementType === ElementType.BRANCH) {
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
    layoutConfig
}: {
    menuType: MenuType;
    elementType?: ElementType;
    connectorType?: ConnectorType;
    connectorHeight: number;
    layoutConfig: LayoutConfig;
}): number {
    const menuHeight = getMenuHeight({ menuType, elementType, layoutConfig });
    const menuMarginBottom = layoutConfig.menu.marginBottom;
    const menuTriggerOffset =
        menuType === MenuType.CONNECTOR ? layoutConfig.connector.types[connectorType!]!.addOffset : 0;

    let menuSpacingToNextNode = connectorHeight - menuTriggerOffset - menuHeight;

    // TODO: FLC cleanup
    if (connectorType === ConnectorType.BRANCH_EMPTY_HEAD || connectorType === ConnectorType.BRANCH_TAIL) {
        menuSpacingToNextNode += layoutConfig.grid.h;
    }

    return menuSpacingToNextNode < menuMarginBottom ? menuMarginBottom - menuSpacingToNextNode : 0;
}

/**
 * Calculates the layout for a node
 *
 * @param nodeModel - The node model
 * @param offsetY  -
 * @param context - The flow rendering context
 * @returns A NodeLayout for the node
 */
function calculateNodeLayout(nodeModel: NodeModel, offsetY: number, context: FlowRenderContext): NodeLayout {
    const { nodeLayoutMap, elementsMetadata, layoutConfig } = context;

    let layout;
    const { guid } = nodeModel;
    let layoutInfo = nodeLayoutMap[guid];

    // handle the layout for any branches
    const childCount = getLayoutChildren(nodeModel).length;
    const { branchHeight, width } = calculateBranchingHeightAndWidth(childCount, nodeModel, offsetY, context);
    setBranchOffsets(width, childCount, nodeModel, nodeLayoutMap, offsetY);

    const nodeMetadata = getElementMetadata(elementsMetadata, nodeModel.elementType);
    const nextNodeConnectorType = getNextNodeConnectorType(nodeMetadata.type, nodeModel.guid, nodeModel.next, false);
    const nextNodeConnectorHeight =
        nextNodeConnectorType != null ? getConnectorHeight(nextNodeConnectorType, layoutConfig) : 0;

    let height =
        nextNodeConnectorHeight +
        branchHeight +
        (nodeMetadata.type === ElementType.END ? getConnectorHeight(ConnectorType.BRANCH_TAIL, layoutConfig) : 0);

    const menuType = getMenuType(guid, context);

    height +=
        menuType != null
            ? getExtraHeightForMenu({
                  menuType,
                  elementType: nodeMetadata.type,
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
        layout = createLayoutForNewNode(nodeModel, nodeLayoutMap, layout, offsetY);
    }

    layoutInfo = layoutInfo || { layout };
    layoutInfo = {
        prevLayout: isNew ? undefined : cloneLayout(layoutInfo.layout),
        layout: { w: width, h: height, y: offsetY, x: 0, joinOffsetY: branchHeight }
    };

    nodeLayoutMap[nodeModel.guid] = layoutInfo;

    return layoutInfo;
}

function createLayoutForNewNode(nodeModel: NodeModel, nodeLayoutMap: NodeLayoutMap, layout: any, offsetY: number) {
    // if we just inserted a node, set its layout to
    // the next node's previous layout (ie, the next node's location before
    // it was pushed down by the connector menu)

    const next = nodeModel.next;
    const nextLayoutInfo = next ? nodeLayoutMap[next] : null;
    if (nextLayoutInfo != null) {
        layout = cloneLayout(nextLayoutInfo.prevLayout);
    } else {
        layout = { ...newDefaultLayout(), y: offsetY };
    }
    return layout;
}

function calculateBranchingHeightAndWidth(
    childCount: number,
    nodeModel: NodeModel,
    offsetY: number,
    context: FlowRenderContext
) {
    let width = 0;
    let branchHeight = 0;
    for (let i = 0; i < childCount; i++) {
        const branchLayout = calculateBranchLayout(nodeModel, i, offsetY, context);
        branchHeight = Math.max(branchHeight, branchLayout.h);
        width += branchLayout.w;
    }

    return { branchHeight, width };
}

/**
 * Sets the xy-offsets for branches
 *
 * @param width
 * @param childCount
 * @param nodeModel
 * @param nodeLayoutMap
 * @param offsetY
 */
function setBranchOffsets(
    width: number,
    childCount: number,
    nodeModel: NodeModel,
    nodeLayoutMap: NodeLayoutMap,
    offsetY: number
) {
    let offsetX = -width / 2;

    for (let i = 0; i < childCount; i++) {
        const branchLayout = getBranchLayout(nodeModel.guid, i, nodeLayoutMap).layout;
        branchLayout.x = offsetX + branchLayout.w / 2;
        branchLayout.y = offsetY;
        offsetX += branchLayout.w;
    }
}

// function resetLayouts(
//     node: NodeModel | null,
//     flowModel: FlowModel,
//     nodeLayoutMap: NodeLayoutMap
// ) {
//     while (node) {
//         nodeLayoutMap[node.guid] = {
//             layout: newDefaultLayout()
//         };
//         node = node.next ? resolveNode(flowModel, node.next) : null;
//     }
// }

export function getLayoutChildren(node: NodeModel): NodeRef[] {
    return (node as ParentNodeModel).children || [];
}

/**
 * Calculates the layout of a branch and each of its nodes recursively and adds
 * the layout to the FlowRenderContext's nodeLayoutMap
 *
 * @param parent - The branching element
 * @param childIndex - The index of the branch
 * @param offsetY - The y-offset of the branching node in its flow
 * @param context - The flow rendering context
 * @returns The LayoutInfo for the branch
 */
function calculateBranchLayout(
    parent: NodeModel,
    childIndex: number,
    offsetY: number,
    context: FlowRenderContext
): LayoutInfo {
    const { flowModel, nodeLayoutMap, elementsMetadata, layoutConfig } = context;

    const prevLayout = getBranchLayout(parent.guid, childIndex, nodeLayoutMap)
        ? getBranchLayout(parent.guid, childIndex, nodeLayoutMap).layout
        : { ...newDefaultLayout(), y: offsetY };

    const branchLayout = newDefaultLayout();

    setBranchLayout(parent.guid, childIndex, nodeLayoutMap, {
        prevLayout,
        layout: branchLayout
    });

    let width = layoutConfig.grid.w * 2;

    const parentMetadata = getElementMetadata(elementsMetadata, parent.elementType);
    const child = getLayoutChildren(parent)[childIndex];
    let node: NodeModel | null = child != null ? resolveNode(flowModel, child) : null;

    const nextNodeConnectorType: ConnectorType = getNextNodeConnectorType(parentMetadata.type, child, null, true)!;
    let height = getConnectorHeight(nextNodeConnectorType, layoutConfig);

    const menuType = getMenuType(getBranchLayoutKey(parent.guid, childIndex), context);

    height +=
        menuType != null
            ? getExtraHeightForMenu({
                  menuType,
                  connectorType: nextNodeConnectorType,
                  connectorHeight: height,
                  layoutConfig
              })
            : 0;

    while (node) {
        const { layout } = calculateNodeLayout(node, height, context);

        layout.y = height;
        const { w, h } = layout;
        width = Math.max(width, w);
        height += h;

        const next = node.next;
        node = next ? resolveNode(flowModel, next) : null;
    }

    // set the branch dimensions
    branchLayout.w = width;
    branchLayout.h = height;

    return branchLayout;
}
