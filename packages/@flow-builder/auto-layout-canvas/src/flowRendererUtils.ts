import ConnectorType from './ConnectorTypeEnum';
import ConnectorLabelType from './ConnectorLabelTypeEnum';
import { SvgInfo, Geometry } from './svgUtils';
import {
    FlowModel,
    ElementsMetadata,
    ElementMetadata,
    NodeRef,
    ParentNodeModel,
    Guid,
    ConnectionSource
} from './model';
import { isBranchTerminal } from './modelUtils';
import MenuType from './MenuType';

export interface LayoutInfo {
    x: number;
    y: number;
    w: number;
    h: number;
    joinOffsetY: number;
    offsetX: number;
    addOffset: number;
    labelOffset: number;
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
        shouldDeleteBeyondMergingPoint: boolean;
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
    metadata: ElementMetadata;
    nextConnector?: ConnectorRenderInfo;
    flows: FlowRenderInfo[];
    faultFlow?: FlowRenderInfo;
    isNew?: boolean;
    logicConnectors: ConnectorRenderInfo[];
    guid: string;
    menuOpened: boolean;
    isTerminal: boolean;
    toBeDeleted: boolean;
    dynamicNodeComponent?: string;
    dynamicNodeComponentSelector?: Function;
}

export interface Dimension {
    w: number;
    h: number;
}

export enum ConnectorVariant {
    DEFAULT = 'default',
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
export interface ConnectorRenderInfo {
    type: ConnectorType;
    labelType: ConnectorLabelType;
    geometry: Geometry;
    svgInfo: SvgInfo;
    addInfo?: ConnectorAddInfo;
    source: ConnectionSource;
    isFault: boolean;
    labelOffsetY?: number;
    labelOffsetX?: number;
    isNew?: boolean;
    toBeDeleted: boolean;
    isHighlighted: boolean;
}

/**
 * Return the branch layout key
 *
 * @param parentGuid - The parent element guid
 * @param childIndex - The child index
 * @returns - The branch layout key
 */
function getBranchLayoutKey(parentGuid: string, childIndex: number) {
    return `${parentGuid}:${childIndex}`;
}

/**
 * returns the layout from the key
 *
 * @param key - The branch layout key
 * @param progress - The rendering progress
 * @param nodeLayoutMap - Node layout map
 * @returns The layout
 */
function getLayoutByKey(key: string, progress: number, nodeLayoutMap: NodeLayoutMap): LayoutInfo {
    const { prevLayout, layout } = nodeLayoutMap[key];

    return !prevLayout || progress === 1 ? layout : tween(prevLayout, layout, progress);
}

/**
 * Tweens value
 *
 * @param prevValue - The previous value
 * @param value - The next value
 * @param progress - The rendering progress
 * @returns The tween value
 */
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
    const { x, y, w, h, offsetX, joinOffsetY, addOffset, labelOffset } = layout;

    return {
        x: tweenValue(prevLayout.x, x, progress),
        y: tweenValue(prevLayout.y, y, progress),
        w: tweenValue(prevLayout.w, w, progress),
        h: tweenValue(prevLayout.h, h, progress),
        offsetX: tweenValue(prevLayout.offsetX, offsetX, progress),
        joinOffsetY: tweenValue(prevLayout.joinOffsetY, joinOffsetY, progress),
        addOffset: prevLayout.addOffset !== 0 ? tweenValue(prevLayout.addOffset, addOffset, progress) : addOffset,
        labelOffset:
            prevLayout.labelOffset !== 0 ? tweenValue(prevLayout.labelOffset, labelOffset, progress) : labelOffset
    };
}

/**
 * Creates the default layout
 *
 * @returns The default layout
 */
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

/**
 * Get the layout
 *
 * @param nodeGuid - The node guid
 * @param progress - The Rendering progress
 * @param nodeLayoutMap - The node layout map
 * @returns The layout
 */
function getLayout(nodeGuid: string, progress: number, nodeLayoutMap: NodeLayoutMap): LayoutInfo {
    if (!nodeLayoutMap[nodeGuid]) {
        // An example of this scenario is when the user tries to paste rapidly on the canvas
        return createDefaultLayout();
    }
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
    if (!nodeLayoutMap[key]) {
        // An example of this scenario is when the user tries to paste rapidly on the canvas
        return createDefaultLayout();
    }
    return getLayoutByKey(key, progress, nodeLayoutMap);
}

/**
 * Get the config for a connector type and variants
 *
 * @param layoutConfig - The layout config
 * @param connectorType - The connector type
 * @param connectorVariants - A list of variants
 * @returns A connector layout config for the connector
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
 * @returns the number of outcomes that merge back
 */
const getMergeOutcomeCount = (flowModel: FlowModel, branchingElement: ParentNodeModel) =>
    branchingElement.children.reduce((count, child, index) => {
        return !isBranchTerminal(flowModel, branchingElement, index) ? count + 1 : count;
    }, 0);

export {
    getBranchLayoutKey,
    getBranchLayout,
    tween,
    createDefaultLayout,
    getLayout,
    getConnectorConfig,
    getMergeOutcomeCount
};
