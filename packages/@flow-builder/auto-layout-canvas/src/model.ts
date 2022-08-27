import NodeType from './NodeType';

export enum GOTO_CONNECTION_SUFFIX {
    DEFAULT = 'default',
    FAULT = 'fault',
    IMMEDIATE = 'immediate',
    FOR_EACH = 'forEach'
}

export type Guid = string;
export type GoToSourceRef = string;

export interface FlowModel {
    [key: string]: NodeModel | ParentNodeModel | BranchHeadNodeModel | (ParentNodeModel & BranchHeadNodeModel);
}
export type NodeRef = Guid | null;
export interface HighlightInfo {
    highlightNext?: boolean;
    highlightLoopBack?: boolean;
    branchIndexesToHighlight?: number[];
    mergeBranchIndexesToHighlight?: number[];
}

/**
 * Represents the source of a connection
 */
export interface ConnectionSource {
    // the guid of the source element
    guid: Guid;

    // the child index of the source element for a branch head, null otherwise
    childIndex?: number | null;
}

export interface NodeModel {
    guid: Guid;
    label: string;
    elementType: string;
    elementSubtype?: string;
    maxConnections: number;
    isCanvasElement: boolean;
    canHaveFaultConnector: boolean;
    config: {
        isSelected: boolean;
        isHighlighted: boolean;
        isSelectable: boolean;
        hasError: boolean;
        highlightInfo?: HighlightInfo | null;
    };

    defaultConnectorLabel?: string;

    // The auto-layout node type corresponding to the element
    nodeType: NodeType;

    // connections
    prev: NodeRef;
    next: NodeRef;
    fault: NodeRef;

    // goto
    incomingGoTo?: GoToSourceRef[];

    // used for custom icons
    actionName?: string;
}

export interface StartNodeModel extends NodeModel {
    triggerType?: string;
    recordTriggerType?: string;
    object?: string;
    startDate?: string;
    startTime?: string;
    filters?: string;
    frequency?: string;
    filterLogic?: string;
    children?: NodeRef[];
    doesRequireRecordChangedToMeetCriteria?: boolean;
    shouldSupportScheduledPaths?: boolean;
}

export interface ParentNodeModel extends NodeModel {
    children: NodeRef[];
    childReferences: { childReference: string }[];
}

export interface BranchHeadNodeModel extends NodeModel {
    parent: Guid;
    childIndex: number;
    isTerminal: boolean;
}

export interface ElementsMetadata {
    [key: string]: ElementMetadata;
}

export interface ElementMetadata {
    type: NodeType;
    icon: string;
    section: string;
    description: string;
    iconShape: string;
    iconSize?: string;
    iconBackgroundColor: string;
    label: string;
    elementType: string;
    elementSubtype?: string;
    actionType?: string;
    actionName?: string;
    actionIsStandard?: boolean;
    dynamicNodeComponent?: string;
    dynamicNodeComponentSelector?: Function;

    /* name of the element's menu component */
    menuComponent?: string;
}

export interface IncomingGoTosMetadata {
    guid: string;
    childIndex: number;
    isCanvasElement: boolean;
    name: string;
    branchLabel: string;
    actionName: string;
    iconName: string;
    iconShape: string;
    iconBackgroundColor: string;
}

export const FAULT_INDEX = -1;
export const FOR_EACH_INDEX = 0;
export const START_IMMEDIATE_INDEX = 0;

const ELEMENT_METADATA_DEFAULT = {
    type: NodeType.DEFAULT,
    icon: 'standard:default'
};

/**
 * @param type - The node type
 * @returns - True if the node can have children
 */
function canHaveChildren(type: NodeType): boolean {
    return type === NodeType.LOOP || type === NodeType.BRANCH || type === NodeType.ROOT;
}

/**
 * @param flow - The flow model
 * @returns - The root node
 */
function getRootNode(flow: FlowModel): ParentNodeModel {
    return flow.root as ParentNodeModel;
}

/**
 * @param flow - The flow model
 * @param key - The guid node
 * @returns The element
 */
function resolveNode(flow: FlowModel, key: NodeRef): NodeModel {
    if (!key) {
        throw new Error('got null guid');
    }

    return flow[key] as NodeModel;
}

/**
 * @param elementsMetadata - Contains elementType -> data map
 * @param elementType - The current node's NodeType
 * @returns - The element metadata
 */
function getElementMetadata(elementsMetadata: ElementsMetadata, elementType: string): ElementMetadata {
    return elementsMetadata[elementType] || ELEMENT_METADATA_DEFAULT;
}

/**
 * Helper function that returns metadatakey
 *
 * @param node - node containing metadatakey information
 * @returns metadata key
 */
function getMetadataKey(
    node: { elementType: string; elementSubtype: string; actionName: string } | ElementMetadata | NodeModel
) {
    return node.actionName || node.elementSubtype || node.elementType;
}

export { resolveNode, getRootNode, canHaveChildren, getElementMetadata, getMetadataKey };
