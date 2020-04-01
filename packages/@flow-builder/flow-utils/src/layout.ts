import {
    NodeModel,
    FlowModel,
    ElementsMetadata,
    resolveNode,
    canHaveChildren,
    FlowInteractionState,
    getElementMetadata,
    ParentNodeModel
} from './model';
import MenuType from './MenuType';
import ElementType from './ElementType';

const SPACING_WIDTH = 132;
const SPACING_HEIGHT = 72;

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

function getMenuHeight(key: string, flowInteractionState: FlowInteractionState): number {
    const menuInfo = flowInteractionState.menuInfo;

    if (menuInfo && menuInfo.key === key) {
        // TODO: remove hardcoded heights
        return menuInfo.type === MenuType.CONNECTOR ? 276 : 200;
    }

    return 0;
}

/**
 * Default algorithm for calculating the NodeLayout information for nodes
 *
 * @param flowModel the FlowModel
 * @param nodeLayoutMap the NodeLayoutMap
 */
export function calculateFlowLayout(
    flowModel: FlowModel,
    nodeLayoutMap: NodeLayoutMap,
    flowInteractionState: FlowInteractionState,
    elementsMetadata: ElementsMetadata
) {
    const parent = flowModel.root;
    calculateBranchLayout(
        flowModel,
        parent as ParentNodeModel,
        0,
        nodeLayoutMap,
        0,
        flowInteractionState,
        elementsMetadata
    );
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

function calculateNodeLayout(
    flowModel: FlowModel,
    nodeModel: NodeModel,
    offsetY: number,
    nodeLayoutMap: NodeLayoutMap,
    flowInteractionState: FlowInteractionState,
    elementsMetadata: ElementsMetadata
): NodeLayout {
    let width = 0;
    let height = 0;
    let joinOffsetY = 0;

    let layout;
    const { elementType, guid } = nodeModel;
    let layoutInfo = nodeLayoutMap[guid];

    const metadata = getElementMetadata(elementsMetadata, elementType);
    const childCount = canHaveChildren(metadata.type) ? nodeModel.maxConnections : 0;

    for (let i = 0; i < childCount; i++) {
        const branchLayout = calculateBranchLayout(
            flowModel,
            nodeModel as ParentNodeModel,
            i,
            nodeLayoutMap,
            offsetY,
            flowInteractionState,
            elementsMetadata
        );

        height = Math.max(height, branchLayout.h);
        width += branchLayout.w;
    }

    joinOffsetY = height;

    if (layoutInfo) {
        layout = layoutInfo.layout;
        height += getMenuHeight(nodeModel.guid, flowInteractionState);
    }

    let offsetX = 0;
    for (let i = 0; i < childCount; i++) {
        const branchLayout = getBranchLayout(nodeModel.guid, i, nodeLayoutMap).layout;
        branchLayout.x = offsetX - width / 2 + branchLayout.w / 2;
        branchLayout.y = offsetY;
        offsetX += branchLayout.w;
    }

    // TOD0: cleanup
    height += metadata.type === ElementType.LOOP ? SPACING_HEIGHT : 0;

    // if we just inserted a node, set its layout to
    // the next node's previous layout (ie, the next node's location before
    // it was pushed down by the connector menu)
    let isNew = false;
    if (layoutInfo == null && nodeModel.next) {
        const next = nodeModel.next;
        isNew = true;
        const nextLayoutInfo = nodeLayoutMap[next];
        if (nextLayoutInfo) {
            layout = cloneLayout(nextLayoutInfo.prevLayout);
        }
    }

    layout = layout || { ...newDefaultLayout(), y: offsetY };
    layoutInfo = layoutInfo || { layout };

    layoutInfo = {
        prevLayout: isNew ? undefined : cloneLayout(layoutInfo.layout),
        layout: { w: width, h: height, y: offsetY, x: 0, joinOffsetY }
    };

    nodeLayoutMap[nodeModel.guid] = layoutInfo;

    return layoutInfo;
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

function calculateBranchLayout(
    flowModel: FlowModel,
    parent: ParentNodeModel,
    childIndex: number,
    nodeLayoutMap: NodeLayoutMap,
    offsetY: number,
    flowInteractionState: FlowInteractionState,
    elementsMetadata: ElementsMetadata
): LayoutInfo {
    const prevLayout = getBranchLayout(parent.guid, childIndex, nodeLayoutMap)
        ? getBranchLayout(parent.guid, childIndex, nodeLayoutMap).layout
        : { ...newDefaultLayout(), y: offsetY };

    const branchLayout = newDefaultLayout();

    setBranchLayout(parent.guid, childIndex, nodeLayoutMap, {
        prevLayout,
        layout: branchLayout
    });

    let width = SPACING_WIDTH * 2;
    let height = 0;

    const root = parent.children[childIndex];
    let node: NodeModel | null = root != null ? resolveNode(flowModel, root) : null;

    let elementType = node != null ? getElementMetadata(elementsMetadata, node.elementType).type : null;

    if (elementType && elementType !== ElementType.START) {
        height = SPACING_HEIGHT * 2;
    }

    // Added for decision top connector length
    if (node == null || (node.prev == null && elementType && elementType !== ElementType.START)) {
        // TODO: Move this number as a const in the connectorLib
        height = 192;
    }

    height += getMenuHeight(getBranchLayoutKey(parent.guid, childIndex), flowInteractionState);

    while (node) {
        const { layout } = calculateNodeLayout(
            flowModel,
            node,
            height,
            nodeLayoutMap,
            flowInteractionState,
            elementsMetadata
        );

        let { w } = layout;
        const { h } = layout;

        // TODO: clean this up
        if (elementType === ElementType.LOOP) {
            w += 2 * SPACING_WIDTH;
        }

        width = Math.max(width, w);
        height += h;

        // The height of the branch joining connector in the case of decision should be relatively shorter
        if (elementType === ElementType.BRANCH) {
            // TODO: Move this number as a const in the connectorLib
            height += 84;
        } else if (elementType !== ElementType.END || parent.guid !== ElementType.ROOT) {
            height += SPACING_HEIGHT * 2;
        }

        node = node.next ? resolveNode(flowModel, node.next) : null;
        elementType = node != null ? getElementMetadata(elementsMetadata, node.elementType).type : null;
    }

    // set the branch dimensions
    branchLayout.w = width;
    branchLayout.h = height;

    return branchLayout;

    // TODO
    // node = startNode;
    // while (node) {
    // if (node.fault) {
    //     const faultNode = resolveNode(flowModel, node.fault);
    //     if (!node.opened) {
    //         resetLayouts(faultNode, flowModel, nodeLayoutMap);
    //     } else {
    //         calculateBranchLayout(flowModel, faultNode, nodeLayoutMap);
    //         const faultLayout = nodeLayoutMap[faultNode.guid].layout;
    //         faultLayout.offsetX = width / 2 + faultLayout.w / 2;
    //     }
    // }
    //     node = node.next ? resolveNode(flowModel, node.next) : null;
    // }
}
