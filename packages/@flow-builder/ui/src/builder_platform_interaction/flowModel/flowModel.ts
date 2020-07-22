/*
 * TODO: IMPORTANT: These interfaces represent our expected usages.
 * The "baseXXX" methods below and their usages in various factories have NOT been updated
 * and will need to be addressed via a separate refactoring (ideally as they are converted
 * to typescript).  Ideally, the interfaces and the baseXXX methods are combined in to classes with constructors
 */

export type Guid = string;
export type FlowElementType = string;
export type FlowElementSubtype = string;
export type Datatype = string;

export interface CanvasElementConfig {
    isHighlighted: boolean;
    isSelectable: boolean;
    isSelected: boolean;
}
export interface FlowConnectorConfig {
    isSelected: boolean;
}

export interface FlowElement {
    // TODO: IMPORTANT: elementType should *NOT* be optional.  Once baseElement and its usages are cleaned up to always have
    // an elementType then it should be required here
    elementType?: FlowElementType;
    label?: string | null;

    guid: Guid;

    // This is the "api name" in the property editor UI
    name: string;

    description?: string;

    // Maybe all elements have datatypes?  If so, remove `?`
    dataType?: Datatype;

    isCanvasElement?: boolean;
}

export interface BaseCanvasElement extends FlowElement {
    // This is the "label" in the property editor UI
    label: string | null;
    locationX: number;
    locationY: number;
    // TODO: eventually replace this with type checking
    isCanvasElement: boolean;
    connectorCount: number;
    config: CanvasElementConfig;
    elementSubtype: FlowElementSubtype;
}

export interface CanvasElement extends BaseCanvasElement {
    availableConnections?: AvailableConnection[];
    childReferences?: ChildReference[];
    elementType: string;
    maxConnections: number;
}

export interface ChildElement extends FlowElement {
    // This is the "label" in the property editor UI
    label?: string;
}

export type ConnectorType = string;

export interface AvailableConnection {
    type: ConnectorType;
    childReference?: Guid;
}

export interface ChildReference {
    childReference: Guid;
}

export interface AutoLayoutCanvasElement extends CanvasElement {
    children?: (Guid | null)[];
    next?: Guid | null;
    prev?: Guid | null;
    isTerminal?: boolean;
    parent?: Guid;
    childIndex?: number;
    fault?: Guid | null;
}

export interface FlowConnector {
    source: Guid;
    target: Guid;
    type: ConnectorType;
    label: string | null;
    childSource?: Guid;
}

export type StringKeyedMap<T> = { [key: string]: T };
export type FlowElements = StringKeyedMap<FlowElement>;

export interface StoreState {
    elements: FlowElements;
    connectors: FlowConnector[];
    canvasElements: Guid[];
}
