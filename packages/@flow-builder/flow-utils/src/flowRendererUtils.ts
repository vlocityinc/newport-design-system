import { LayoutInfo, NodeLayoutMap, getBranchLayoutKey } from './layout';
import ConnectorType from './ConnectorTypeEnum';
import { FlowModel, ElementsMetadata, ElementMetadata, NodeRef, guid } from './model';
import MenuType from './MenuType';
import ElementType from './ElementType';

export interface FlowRenderContext {
    flowModel: FlowModel;
    nodeLayoutMap: NodeLayoutMap;
    progress: number;
    interactionState: FlowInteractionState;
    elementsMetadata: ElementsMetadata;
    layoutConfig: LayoutConfig;
}

export interface FlowInteractionState {
    menuInfo: {
        key: guid;
        type: MenuType;
    } | null;
}

export interface FlowRenderInfo {
    key: string;
    geometry: Geometry;
    nodes: NodeRenderInfo[];
    isTerminal: boolean;
    layoutConfig: object;
    preConnector?: ConnectorRenderInfo;
}

export interface NodeRenderInfo {
    key: string;
    geometry: Geometry;
    label: string;
    metadata: ElementMetadata;
    config: { isSelected: boolean; isHighlighted: boolean; canSelect: boolean };
    hasFault: boolean;
    nextConnector?: ConnectorRenderInfo;
    flows: FlowRenderInfo[];
    isNew?: boolean;
    logicConnectors: ConnectorRenderInfo[];
    conditionOptions?: Option[];
    defaultConnectorLabel?: string;
    guid: string;
    menuOpened: boolean;
    isTerminal: boolean;
}

export interface Dimension {
    w: number;
    h: number;
}

export enum ConnectorVariant {
    EDGE = 'edge',
    CENTER = 'center'
}

interface ConnectorTypeLayoutConfig {
    h: number;
    addOffset: number;
    labelOffset?: number;
    variants?: {
        [key in ConnectorVariant]: any;
    };
    svgMarginTop?: number;
    svgMarginBottom?: number;
}

export interface LayoutConfig {
    grid: {
        w: number;
        h: number;
    };
    menu: {
        marginBottom: number;
    };
    connector: {
        strokeWidth: number;
        curveRadius: number;
        menu: Dimension;
        types: {
            [key in ConnectorType]?: ConnectorTypeLayoutConfig;
        };
    };
    node: {
        w: number;
        h: number;
        menu: {
            [key in ElementType]?: Dimension | undefined;
        };
    };
}

export interface Geometry {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
}

export interface Option {
    label: string;
    value: guid;
}

export interface MenuInfo {
    guid: NodeRef;
    menuOpened: boolean;
}

export interface ConnectorAddInfo {
    geometry: Geometry;
    menuOpened: boolean;
    prev?: NodeRef;
    next?: NodeRef;
    parent?: NodeRef;
    childIndex?: number;
}

export interface SvgInfo {
    geometry: Geometry;
    path: string;
}

export interface SelectInfo {
    value: NodeRef;
    options: Option[];
}

export interface ConnectorRenderInfo {
    key: string;
    type?: ConnectorType;
    geometry?: Geometry;

    svgInfo?: SvgInfo;
    addInfo?: ConnectorAddInfo;

    branchLabelGeometry?: Geometry;
    conditionOptions?: Option[];
    conditionValue?: guid;

    connectorType: ConnectorType;
    isFault?: boolean;
    isNew?: boolean;
}

export function getStyle({ left, bottom, top, width, height, zIndex }: any) {
    return `left: ${left}px; bottom: ${bottom}px; top: ${top}px; height: ${height}px; width: ${width}px; z-index: ${zIndex} `;
}

export function getStyleFromGeometry({ x, y, w, h }: Geometry): string {
    return getStyle({
        left: x,
        top: y,
        width: w,
        height: h
    });
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
