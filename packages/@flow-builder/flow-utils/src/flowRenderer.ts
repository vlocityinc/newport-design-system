import { createConnectorToNextNode, createTopChildConnector, createBottomChildConnector } from './connectorLib';
import ConnectorType from './ConnectorTypeEnum';
import {
    FlowModel,
    NodeModel,
    ParentNodeModel,
    ElementsMetadata,
    resolveNode,
    getRootNode,
    FlowInteractionState,
    getElementMetadata
} from './model';
import { LayoutInfo, NodeLayoutMap, calculateFlowLayout, getBranchLayoutKey } from './layout';

import { FlowRenderInfo, NodeRenderInfo, getLayout, getBranchLayout, getStyle } from './flowRendererUtils';
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

function newEmptyFlow(key: string): FlowRenderInfo {
    return {
        key,
        nodes: [],
        style: '',
        y: 0,
        x: 0,
        h: 0,
        shouldRender: true
    };
}

export default class FlowRenderer {
    private flowModel: FlowModel = {};
    private nodeLayoutMap: NodeLayoutMap = {};
    private progress = 0;
    private interactionState: FlowInteractionState = {
        menuInfo: null
    };
    private elementsMetadata: ElementsMetadata;

    constructor(elementsMetadata: ElementsMetadata) {
        this.elementsMetadata = elementsMetadata;
    }

    setFlowModel(flowModel: FlowModel) {
        this.flowModel = flowModel;
        calculateFlowLayout(this.flowModel, this.nodeLayoutMap, this.interactionState, this.elementsMetadata);

        return this;
    }

    renderFlow(progress: number, isFault: boolean = false): FlowRenderInfo {
        this.progress = progress;
        const rootNode = getRootNode(this.flowModel);
        return this.renderFlowHelper(rootNode as ParentNodeModel, 0, isFault);
    }

    toggleMenu(menuEventDetail: MenuEventDetail): void {
        const { guid, parent, childIndex, type } = menuEventDetail;
        const key = parent ? getBranchLayoutKey(parent, childIndex) : guid;

        let menuInfo = this.interactionState.menuInfo;

        if (!menuInfo) {
            menuInfo = {
                key,
                type
            };
        } else {
            menuInfo = null;
        }

        this.interactionState = { ...this.interactionState, menuInfo };
    }

    private getLayout(node: NodeModel): LayoutInfo {
        return getLayout(node.guid, this.progress, this.nodeLayoutMap);
    }

    private getBranchLayout(parent: NodeModel, childIndex: number): LayoutInfo {
        return getBranchLayout(parent.guid, childIndex, this.progress, this.nodeLayoutMap);
    }

    private renderSimpleNode(node: NodeModel): NodeRenderInfo {
        const { x, y, h } = this.getLayout(node);

        const menuOpened =
            this.isMenuOpened(node.guid, MenuType.CONNECTOR) || this.isMenuOpened(node.guid, MenuType.NODE);

        const metadata = getElementMetadata(this.elementsMetadata, node.elementType);

        const label =
            metadata.type === ElementType.END || metadata.type === ElementType.START ? '' : node.label || node.guid;
        return {
            guid: node.guid,
            label,
            metadata,
            style: getStyle({
                top: y,
                left: x
            }),
            h,
            y,
            config: node.config,
            markerType: '',
            hasFault: node.fault != null,
            flows: [],
            shouldRender: true,
            menuOpened,
            isNew: this.nodeLayoutMap[node.guid].prevLayout == null && this.progress === 0
        };
    }

    private renderNode(node: NodeModel, parentNode: NodeModel, isFault: boolean): NodeRenderInfo {
        let nodeRenderInfo;

        const metadata = getElementMetadata(this.elementsMetadata, node.elementType);

        switch (metadata.type) {
            case ElementType.DECISION:
                nodeRenderInfo = this.renderDecisionNode(node as ParentNodeModel, isFault);
                break;
            case ElementType.LOOP:
                nodeRenderInfo = this.renderLoopNode(node as ParentNodeModel, isFault);
                break;
            default:
                nodeRenderInfo = this.renderSimpleNode(node);
        }

        // TODO
        // if (node.fault) {
        //     this.renderFault(node);
        // }

        if (metadata.type !== ElementType.END && !nodeRenderInfo.isTerminal) {
            const { x, y, joinOffsetY } = this.getLayout(node);

            const nextNodeLayout = node.next ? getLayout(node.next, this.progress, this.nodeLayoutMap) : null;

            const height = nextNodeLayout
                ? nextNodeLayout.y - (y + joinOffsetY)
                : this.getLayout(parentNode).joinOffsetY - (y + joinOffsetY);

            nodeRenderInfo.nextConnector = createConnectorToNextNode(
                node,
                ConnectorType.STRAIGHT,
                x,
                y,
                height,
                joinOffsetY,
                isFault,
                this.isMenuOpened(node.guid, MenuType.CONNECTOR)
            );
        }

        return nodeRenderInfo;
    }

    private isMenuOpened(key: string, menuType: MenuType) {
        if (!this.interactionState.menuInfo) {
            return false;
        } else {
            const menuInfo = this.interactionState.menuInfo;
            return menuInfo.key === key && menuInfo.type === menuType;
        }
    }

    private renderFlowHelper(parentNode: ParentNodeModel, childIndex: number, isFault: boolean): FlowRenderInfo {
        const { x, h } = this.getBranchLayout(parentNode, childIndex);

        let node: NodeModel | null = resolveNode(this.flowModel, parentNode.children[childIndex]);

        const nodeRenderInfos = [];
        let isTerminal = false;

        while (node) {
            const nodeRenderInfo = this.renderNode(node, parentNode, isFault);
            nodeRenderInfos.push(nodeRenderInfo);
            const metadata = getElementMetadata(this.elementsMetadata, node.elementType);
            isTerminal = metadata.type === ElementType.END || (node.next == null && !!nodeRenderInfo.isTerminal);
            node = node.next ? resolveNode(this.flowModel, node.next) : null;
        }

        return {
            key: `nested_flow_${parentNode.guid}_${childIndex}`,
            nodes: nodeRenderInfos,
            style: getStyle({ top: 0, left: x }),
            y: 0,
            h,
            shouldRender: true,
            isTerminal,
            x
        };
    }

    // TODO
    // renderFault(node: NodeModel) {
    //     if (!node.opened) {
    //         return;
    //     }

    //     const faultNode = resolveNode(this.flowModel, node.fault);
    //     const nodeLayout = this.getLayout(node);
    //     const { prevLayout, layout } = this.nodeLayoutMap[faultNode.guid];

    //     const offsetX =
    //         prevLayout!.x === 0 ? layout.x : this.getLayout(faultNode).x;
    //     const key = `hconn_${node.guid}_fault}`;
    //     const isFault = true;

    //     this.addConnector(
    //         {
    //             key,
    //             connectorType: 'horizontal',
    //             sourceX: 0,
    //             sourceY: nodeLayout.y,
    //             svgWidth: offsetX,
    //             svgHeight: 0
    //         },
    //         isFault
    //     );

    //     return this.renderNestedFlow(node, -1);
    // }

    private renderDecisionNode(node: ParentNodeModel, isFault: boolean): NodeRenderInfo {
        const nodeRenderInfo = this.renderSimpleNode(node);

        const { maxConnections } = node;

        const nodeLayout = this.getLayout(node);
        const { x } = nodeLayout;

        let isTerminal = true;

        for (let i = 0; i < maxConnections; i++) {
            const flowRenderInfo = node.children![i]
                ? this.renderDecisionNodeChild(node, i)
                : newEmptyFlow(getBranchLayoutKey(node.guid, i));

            nodeRenderInfo.flows.push(flowRenderInfo);

            flowRenderInfo.preConnector = createTopChildConnector(
                this.nodeLayoutMap,
                node,
                ConnectorType.TOP_CHILD_CONNECTOR,
                i,
                x,
                0,
                this.progress,
                this.isMenuOpened(getBranchLayoutKey(node.guid, i), MenuType.CONNECTOR),
                'guid1',
                [
                    {
                        label: 'Guid 1',
                        value: 'guid1'
                    },
                    {
                        label: 'Default Outcome',
                        value: 'guid2'
                    }
                ]
            );

            if (!flowRenderInfo.isTerminal) {
                flowRenderInfo.postConnector = createBottomChildConnector(
                    this.nodeLayoutMap,
                    node,
                    ConnectorType.BOTTOM_CHILD_CONNECTOR,
                    i,
                    x,
                    0,
                    this.progress
                );

                isTerminal = false;
            }
        }

        nodeRenderInfo.isTerminal = isTerminal;

        return nodeRenderInfo;
    }

    private renderDecisionNodeChild(node: ParentNodeModel, i: number): FlowRenderInfo {
        return this.renderNestedFlow(node, i);
    }

    private renderNestedFlow(parent: ParentNodeModel, childIndex: number): FlowRenderInfo {
        const isFault = parent.fault != null;

        // TODO
        // // for a fault we don't want any animation of the nested flow position
        // const childLayout = isFault
        //     ? this._nodeLayoutMap[node.guid].layout
        //     : this.getLayout(node, this.progress);

        return this.renderFlowHelper(parent, childIndex, isFault);

        // TODO: cleanup this stuff
        // nestedFlow.flowRenderInfo.connectors = nestedFlow.flowRenderInfo.connectors.concat(
        //     extraConnectors
        // );
    }

    private renderLoopNode(node: ParentNodeModel, isFault: boolean): NodeRenderInfo {
        const nodeRenderInfo = this.renderSimpleNode(node);

        const nodeLayout = this.getLayout(node);
        const { x, y, h, w } = nodeLayout;
        const childNode = resolveNode(this.flowModel, node.children[0]);
        const childLayout = this.getLayout(childNode);

        // TODO: FIX ME
        const connectors = [];

        connectors.push({
            key: `loop-left_${node.guid}`,
            connectorType: 'loop-left',
            sourceX: x - childLayout.w / 2,
            sourceY: y,
            svgWidth: w / 2,
            isFault,
            svgHeight: h,
            shouldRender: true
        });

        connectors.push({
            key: `loop-right_${node.guid}`,
            connectorType: 'loop-right',
            sourceX: x,
            sourceY: y,
            svgWidth: w / 2,
            svgHeight: childLayout.h,
            isFault,
            shouldRender: true
        });

        nodeRenderInfo.flows.push(this.renderNestedFlow(node, 0));

        return nodeRenderInfo;
    }
}
