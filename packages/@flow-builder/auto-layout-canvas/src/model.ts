import ElementType from './ElementType';

export type Guid = string;

export interface FlowModel {
    [key: string]: NodeModel;
}
export type NodeRef = Guid | null;

export interface NodeModel {
    guid: Guid;
    label: string;
    elementType: string;
    maxConnections: number;
    config: { isSelected: boolean; isHighlighted: boolean; isSelectable: boolean };

    childReferences?: Array<{ childReference: string }>;
    defaultConnectorLabel?: string;

    // connections
    prev: NodeRef;
    next: NodeRef;
    fault: NodeRef;
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
}

export interface MenuSection {
    guid: string;
    heading: string;
    items: MenuItem[];
    label: string;
    separator: boolean;
}

export interface ElementMetadata {
    type: ElementType;
    icon: string;
    section: string;
    description: string;
    iconShape: string;
    iconBackgroundColor: string;
    label: string;
    elementType: ElementType;
    isSupported: boolean;
}

export const FAULT_INDEX = -1;

const ELEMENT_METADATA_DEFAULT = {
    type: ElementType.DEFAULT,
    icon: 'standard:default'
};

function canHaveChildren(type: ElementType): boolean {
    return type === ElementType.LOOP || type === ElementType.BRANCH || type === ElementType.ROOT;
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
