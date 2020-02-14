import ElementType from './ElementType';
import MenuType from './MenuType';

export interface FlowModel {
    [key: string]: NodeModel;
}
export interface FlowInteractionState {
    menuInfo: {
        key: string;
        type: MenuType;
    } | null;
}

export interface NodeModel {
    guid: string;
    label: string;
    elementType: string;
    prev?: string;
    next?: string;
    children?: string[];
    parent?: string;
    fault?: string;
    childIndex?: number;
    maxConnections: number;
    config: { isSelected: boolean; isHighlighted: boolean; canSelect: boolean };
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
    return type === ElementType.LOOP || type === ElementType.DECISION || type === ElementType.ROOT;
}

function getRootNode(flow: FlowModel) {
    return flow.root;
}

function resolveNode(flow: FlowModel, guid?: string): NodeModel {
    if (!guid) {
        throw new Error('got null guid');
    }

    return flow[guid] as NodeModel;
}

function getElementMetadata(elementsMetadata: ElementsMetadata, elementType: string): ElementMetadata {
    return elementsMetadata[elementType] || ELEMENT_METADATA_DEFAULT;
}

export { resolveNode, getRootNode, canHaveChildren, getElementMetadata };
