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

    outcomeReferences?: Array<{ outcomeReference: string }>;
    waitEventReferences?: Array<{ waitEventReference: string }>;
    defaultConnectorLabel?: string;

    // connections
    prev: NodeRef;
    next: NodeRef;
    fault: NodeRef;
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
export interface ElementMetadata {
    type: ElementType;
    icon: string;
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
