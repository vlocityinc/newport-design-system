import { LayoutInfo, NodeLayoutMap, getBranchLayoutKey } from './layout';
import ConnectorType from './ConnectorTypeEnum';
import { ElementMetadata } from './model';

export interface FlowRenderInfo {
    key: string;
    nodes: NodeRenderInfo[];
    style: string;
    y: number;
    x: number;
    h: number;
    shouldRender: boolean;
    preConnector?: ConnectorRenderInfo;
    postConnector?: ConnectorRenderInfo;
    isTerminal?: boolean;
}

export interface NodeRenderInfo {
    guid: string;
    label: string;
    metadata: ElementMetadata;
    style: string;
    y: number;
    h: number;
    config: { isSelected: boolean; isHighlighted: boolean; canSelect: boolean };
    markerType: string;
    hasFault: boolean;
    shouldRender: boolean;
    nextConnector?: ConnectorRenderInfo;
    flows: FlowRenderInfo[];
    menuOpened?: boolean;
    isNew?: boolean;
    isTerminal?: boolean;
}

export interface ConnectorRenderInfo {
    key: string;
    connectorType: ConnectorType;
    sourceX: number;
    sourceY: number;
    svgWidth?: number;
    svgHeight?: number;
    sourceGuid?: string;
    targetGuid?: string;
    canAddNode?: boolean;
    isFault?: boolean;
    shouldRender?: boolean;
    menuOpened?: boolean;
    offsetY?: number;
    childIndex?: number;
    parent?: string;
    style?: string;
    isNew?: boolean;
    selectedChildGuid?: string;
    childReferences?: Array<{ label: string; value: string }>;
}

export function getStyle({ left, top, zIndex }: any) {
    return `left: ${left}px; top: ${top}px; z-index: ${zIndex} `;
}

function tweenValue(prevValue: number, value: number, progress: number) {
    const delta = (value - prevValue) * progress;
    return prevValue + delta;
}

export function tween(prevLayout: LayoutInfo, layout: LayoutInfo, progress: number) {
    return {
        x: tweenValue(prevLayout.x, layout.x, progress),
        y: tweenValue(prevLayout.y, layout.y, progress),
        w: tweenValue(prevLayout.w, layout.w, progress),
        h: tweenValue(prevLayout.h, layout.h, progress),
        joinOffsetY: tweenValue(prevLayout.joinOffsetY, layout.joinOffsetY, progress)
    };
}

export function getLayout(nodeGuid: string, progress: number, nodeLayoutMap: NodeLayoutMap) {
    return getLayoutByKey(nodeGuid, progress, nodeLayoutMap);
}

export function getBranchLayout(
    parentGuid: string,
    childIndex: number,
    progress: number,
    nodeLayoutMap: NodeLayoutMap
) {
    const key = getBranchLayoutKey(parentGuid, childIndex);
    return getLayoutByKey(key, progress, nodeLayoutMap);
}

function getLayoutByKey(key: string, progress: number, nodeLayoutMap: NodeLayoutMap): LayoutInfo {
    const { prevLayout, layout } = nodeLayoutMap[key];

    return !prevLayout || progress === 1 ? layout : tween(prevLayout, layout, progress);
}
