import ConnectorType from './ConnectorTypeEnum';
import ConnectorLabelType from './ConnectorLabelTypeEnum';
import { SvgInfo, Geometry } from './svgUtils';
import {
    FlowModel,
    ElementsMetadata,
    ElementMetadata,
    NodeRef,
    NodeModel,
    BranchHeadNodeModel,
    ParentNodeModel,
    Guid
} from './model';
import MenuType from './MenuType';

export interface LayoutInfo {
    x: number;
    y: number;
    w: number;
    h: number;
    joinOffsetY: number;
    offsetX: number;
    addOffset: number;
}

export interface NodeLayout {
    prevLayout?: LayoutInfo | undefined;
    layout: LayoutInfo;
}

export interface NodeLayoutMap {
    [key: string]: NodeLayout;
}

export type NodeDimensionMap = Map<Guid, Dimension>;

export interface FlowRenderContext {
    flowModel: FlowModel;
    nodeLayoutMap: NodeLayoutMap;
    progress: number;
    interactionState: FlowInteractionState;
    elementsMetadata: ElementsMetadata;
    layoutConfig: LayoutConfig;
    isFault: boolean;
    isDeletingBranch: boolean;
    dynamicNodeDimensionMap: NodeDimensionMap;
}

export interface InteractionMenuInfo {
    key: Guid;
    type: MenuType;
    geometry?: Geometry;
    needToPosition: boolean;
}

export interface FlowInteractionState {
    menuInfo: InteractionMenuInfo | null;
    deletionPathInfo: {
        childIndexToKeep: number;
        elementGuidToDelete: Guid;
    } | null;
}

export interface FlowRenderInfo {
    geometry: Geometry;
    nodes: NodeRenderInfo[];
    isTerminal: boolean;
    layoutConfig: object;
    preConnector?: ConnectorRenderInfo;
}

export interface NodeRenderInfo {
    geometry: Geometry;
    label: string;
    metadata: ElementMetadata;
    config: { isSelected: boolean; isHighlighted: boolean; isSelectable: boolean; hasError: boolean };
    nextConnector?: ConnectorRenderInfo;
    flows: FlowRenderInfo[];
    faultFlow?: FlowRenderInfo;
    isNew?: boolean;
    logicConnectors: ConnectorRenderInfo[];
    conditionOptions?: Option[];
    defaultConnectorLabel?: string;
    guid: string;
    menuOpened: boolean;
    isTerminal: boolean;
    toBeDeleted: boolean;
    node?: NodeModel;
    dynamicNodeComponent?: string;
    dynamicNodeComponentSelector?: Function;
}

export interface Dimension {
    w: number;
    h: number;
}

export enum ConnectorVariant {
    DEFAULT = 'default',
    EDGE = 'edge',
    EDGE_BOTTOM = 'edgeBottom',
    CENTER = 'center',
    LOOP = 'loop',
    FAULT = 'fault',
    POST_MERGE = 'postMerge',
    POST_MERGE_TAIL = 'postMergeTail',
    BRANCH_TAIL = 'branchTail',
    BRANCH_HEAD = 'branchHead',
    BRANCH_HEAD_EMPTY = 'branchHeadEmpty',
    DEFAULT_LABEL = 'defaultLabel'
}
export enum VerticalAlign {
    TOP,
    BOTTOM
}

export interface ConnectorTypeLayoutConfig {
    h: number;
    addOffset: number;
    labelOffset?: number;
    variants?: {
        [key in ConnectorVariant]?: any;
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
        icon: {
            w: number;
            h: number;
        };
        strokeWidth: number;
        curveRadius: number;
        menu: Dimension;
        types: {
            [key in ConnectorType]?: ConnectorTypeLayoutConfig;
        };
    };
    node: {
        icon: {
            w: number;
            h: number;
        };
        w: number;
        offsetX: number;
    };
    branch: {
        defaultWidth: number;
        emptyWidth: number;
    };
}

export interface Option {
    label: string;
    value: Guid;
}

export interface MenuInfo {
    guid: NodeRef;
    menuOpened: boolean;
}

export interface ConnectorAddInfo {
    offsetY: number;
    menuOpened: boolean;
}

export interface SelectInfo {
    value: NodeRef;
    options: Option[];
}

export interface ConnectorConnectionInfo {
    prev?: NodeRef;
    next?: NodeRef;
    parent?: NodeRef;
    childIndex?: number;
}

export interface ConnectorRenderInfo {
    type: ConnectorType;
    labelType: ConnectorLabelType;
    geometry: Geometry;
    svgInfo: SvgInfo;
    addInfo?: ConnectorAddInfo;
    connectionInfo: ConnectorConnectionInfo;
    isFault: boolean;
    labelOffsetY?: number;
    connectorBadgeLabel?: string;
    isNew?: boolean;
    toBeDeleted: boolean;
}

function getBranchLayoutKey(parentGuid: string, childIndex: number) {
    return `${parentGuid}:${childIndex}`;
}

function getLayoutByKey(key: string, progress: number, nodeLayoutMap: NodeLayoutMap): LayoutInfo {
    const { prevLayout, layout } = nodeLayoutMap[key];

    return !prevLayout || progress === 1 ? layout : tween(prevLayout, layout, progress);
}

export function tweenValue(prevValue: number, value: number, progress: number): number {
    const delta = (value - prevValue) * progress;
    return prevValue + delta;
}

/**
 * Tweens LayoutInfo values
 *
 * @param prevLayout - The previous LayoutInfo
 * @param layout - The current LayoutInfo
 * @param progress - The rendering progress
 * @returns A LayoutInfo that with the tweened values
 */
function tween(prevLayout: LayoutInfo, layout: LayoutInfo, progress: number): LayoutInfo {
    const { x, y, w, h, offsetX, joinOffsetY, addOffset } = layout;

    return {
        x: tweenValue(prevLayout.x, x, progress),
        y: tweenValue(prevLayout.y, y, progress),
        w: tweenValue(prevLayout.w, w, progress),
        h: tweenValue(prevLayout.h, h, progress),
        offsetX: tweenValue(prevLayout.offsetX, offsetX, progress),
        joinOffsetY: tweenValue(prevLayout.joinOffsetY, joinOffsetY, progress),
        addOffset: prevLayout.addOffset !== 0 ? tweenValue(prevLayout.addOffset, addOffset, progress) : addOffset
    };
}

function getLayout(nodeGuid: string, progress: number, nodeLayoutMap: NodeLayoutMap): LayoutInfo {
    return getLayoutByKey(nodeGuid, progress, nodeLayoutMap);
}

/**
 * Get a LayoutInfo for a branch
 *
 * @param parentGuid - A branching element guid
 * @param childIndex  - A branch index
 * @param progress - Rendering progress
 * @param nodeLayoutMap - The node layout map
 * @returns A LayoutInfo for the branch
 */
function getBranchLayout(
    parentGuid: Guid,
    childIndex: number,
    progress: number,
    nodeLayoutMap: NodeLayoutMap
): LayoutInfo {
    const key = getBranchLayoutKey(parentGuid, childIndex);
    return getLayoutByKey(key, progress, nodeLayoutMap);
}

/**
 * Get the config for a connector type and variants
 *
 * @param layoutConfig - The layout config
 * @param connectorType - The connector type
 * @param connectorVariants - A list of variants
 * @return A connector layout config for the connector
 */
function getConnectorConfig(
    layoutConfig: LayoutConfig,
    connectorType: ConnectorType,
    ...connectorVariants: ConnectorVariant[]
): ConnectorTypeLayoutConfig {
    let connectorConfig = layoutConfig.connector.types[connectorType]!;

    // go through variants and override values
    connectorVariants.forEach((connectorVariant: ConnectorVariant) => {
        const variantConfig = connectorConfig.variants![connectorVariant];
        if (variantConfig != null) {
            connectorConfig = { ...connectorConfig, ...variantConfig } as ConnectorTypeLayoutConfig;
        }
    });

    return connectorConfig;
}

/**
 * For a branching element, get the number of outcomes that merge back
 *
 * @param flowModel - The flow model
 * @param branchingElement - THe branching element
 * @return the number of outcomes that merge back
 */
const getMergeOutcomeCount = (flowModel: FlowModel, branchingElement: ParentNodeModel) =>
    branchingElement.children.reduce((count, child) => {
        return child == null || !(flowModel[child] as BranchHeadNodeModel).isTerminal ? count + 1 : count;
    }, 0);

export { getBranchLayoutKey, getBranchLayout, tween, getLayout, getConnectorConfig, getMergeOutcomeCount };
