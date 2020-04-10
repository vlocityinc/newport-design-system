import ElementType from './ElementType';

export type guid = string;

export interface FlowModel {
    [key: string]: NodeModel;
}
export type NodeRef = guid | null;

export interface NodeModel {
    guid: guid;
    label: string;
    elementType: string;
    fault: NodeRef;
    maxConnections: number;
    config: { isSelected: boolean; isHighlighted: boolean; canSelect: boolean };

    outcomeReferences?: Array<{ outcomeReference: string }>;
    waitEventReferences?: Array<{ waitEventReference: string }>;
    defaultConnectorLabel?: string;

    // link properties
    prev: NodeRef;
    next: NodeRef;
}

export interface ParentNodeModel extends NodeModel {
    children: NodeRef[];
}

export interface BranchHeadNodeModel extends NodeModel {
    parent: NodeRef;
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

const ELEMENT_METADATA_DEFAULT = {
    type: ElementType.DEFAULT,
    icon: 'standard:default'
};

function canHaveChildren(type: ElementType): boolean {
    return type === ElementType.LOOP || type === ElementType.BRANCH || type === ElementType.ROOT;
}

function getRootNode(flow: FlowModel): NodeModel {
    return flow.root;
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
