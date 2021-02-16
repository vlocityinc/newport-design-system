import NodeType from './NodeType';

export type Guid = string;

export interface FlowModel {
    [key: string]: NodeModel | ParentNodeModel | BranchHeadNodeModel | (ParentNodeModel & BranchHeadNodeModel);
}
export type NodeRef = Guid | null;
export interface HighlightInfo {
    highlightNext?: boolean;
    highlightLoopBack?: boolean;
    branchIndexesToHighlight?: Array<number>;
}

export interface NodeModel {
    guid: Guid;
    label: string;
    elementType: string;
    maxConnections: number;
    isCanvasElement: boolean;
    config: {
        isSelected: boolean;
        isHighlighted: boolean;
        isSelectable: boolean;
        hasError: boolean;
        highlightInfo?: HighlightInfo | null;
    };

    childReferences?: Array<{ childReference: string }>;
    defaultConnectorLabel?: string;

    // The auto-layout node type corresponding to the element
    nodeType: NodeType;

    // connections
    prev: NodeRef;
    next: NodeRef;
    fault: NodeRef;

    // goto
    incomingGoTo: Array<Guid>;
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
    doesRequireRecordChangedToMeetCriteria?: boolean;
}

export interface ParentNodeModel extends NodeModel {
    children: NodeRef[];
}

export interface BranchHeadNodeModel extends NodeModel {
    parent: Guid;
    childIndex: number;
    isTerminal: boolean;
}

export interface ElementsMetadata {
    [key: string]: ElementMetadata;
}

export interface MenuItem {
    guid: string;
    icon: string;
    iconContainerClass: string;
    iconClass: string;
    iconSize: string;
    iconVariant: string;
    label: string;
    elementType: string;
    rowClass: string;
    value?: string;
    dataType?: string;
}

export interface MenuSection {
    guid: string;
    heading: string;
    items: MenuItem[];
    label: string;
    separator: boolean;
}

export interface ElementMetadata {
    type: NodeType;
    icon: string;
    section: string;
    description: string;
    iconShape: string;
    iconBackgroundColor: string;
    label: string;
    elementType: string;
    elementSubtype?: string;
    isSupported: boolean;
    dynamicNodeComponent?: string;
    dynamicNodeComponentSelector?: Function;
}

export const FAULT_INDEX = -1;
export const LOOP_BACK_INDEX = 0;
export const START_IMMEDIATE_INDEX = 0;

const ELEMENT_METADATA_DEFAULT = {
    type: NodeType.DEFAULT,
    icon: 'standard:default'
};

function canHaveChildren(type: NodeType): boolean {
    return type === NodeType.LOOP || type === NodeType.BRANCH || type === NodeType.ROOT;
}

function getRootNode(flow: FlowModel): ParentNodeModel {
    return flow.root as ParentNodeModel;
}

function resolveNode(flow: FlowModel, key: NodeRef): NodeModel {
    if (!key) {
        throw new Error('got null guid');
    }

    return flow[key] as NodeModel;
}

function getElementMetadata(elementsMetadata: ElementsMetadata, elementType: string): ElementMetadata {
    return elementsMetadata[elementType] || ELEMENT_METADATA_DEFAULT;
}

export { resolveNode, getRootNode, canHaveChildren, getElementMetadata };
