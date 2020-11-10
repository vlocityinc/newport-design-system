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
    hasError: boolean;
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
    // optional as some elements are anonymous (start element, automatic fields...)
    name?: string;

    description?: string;

    // Maybe all elements have datatypes?  If so, remove `?`
    dataType?: Datatype;
    subtype?: string;
    isCollection?: boolean;

    isCanvasElement?: boolean;

    connector?: FlowConnector;
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

export interface ScreenField extends FlowElement {
    storeOutputAutomatically?: boolean;
    extensionName?: string;
    inputsOnNextNavToAssocScrn?: 'UseStoredValues' | 'ResetValues';
}

export interface BaseCanvasElementWithFilter extends BaseCanvasElement {
    filters?: Filter[];
    filterLogic?: string;
}

interface Filter {
    rowIndex: Guid;
    leftHandSide: string;
    rightHandSide: string;
    rightHandSideDataType: string;
    operator: string;
}

interface ElementReferenceOrValueMetadata {
    booleanValue: boolean;
    dateTimeValue: Date;
    dateValue: Date;
    elementReference: string;
    numberValue: number;
    stringValue: string;
}
interface RecordFilterMetadata {
    field: string;
    operator: string;
    value: ElementReferenceOrValueMetadata;
}

export interface StartUi extends BaseCanvasElementWithFilter, Schedule {
    doesRequireRecordChangedToMeetCriteria: boolean;
    triggerType?: string;
    object: string;
    objectIndex?: string;
    objectContainer?: string;
    isAssignable?: boolean;
    recordTriggerType?: string;
    timeTriggers?: TimeTrigger[];
    childReferences: ChildReference[];
    availableConnections: AvailableConnection[];
}

export interface StartMetadata extends NodeMetadata {
    connector: FlowConnector;
    filters?: RecordFilterMetadata[];
    filterLogic: string;
    object?: string;
    recordTriggerType?: string;
    schedule: Schedule;
    triggerType?: string;
    scheduledPaths?: ScheduledPathMetadata[];
    doesRequireRecordChangedToMeetCriteria?: boolean;
    childReferences: ChildReference[];
    availableConnections: AvailableConnection[];
}

interface Schedule {
    startDate: string;
    startTime: StartTime;
    recordTriggerType?: string;
    frequency: string;
}

interface StartTime {
    timeInMillis?: number;
}

export interface TimeTrigger extends ChildElement {
    timeSource: string;
    offsetUnit: string;
    offsetNumber: string;
}

export interface ScheduledPathMetadata extends ElementMetadata {
    timeSource: string;
    offsetUnit: string;
    offsetNumber: string;
    recordField?: string;
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

interface FlowProperties {
    isAutoLayoutCanvas: boolean;
    processType: string;
    [key: string]: string | undefined | null | number | boolean;
}

export interface StoreState {
    elements: FlowElements;
    connectors: FlowConnector[];
    canvasElements: Guid[];
    properties: FlowProperties;
}

export interface ElementMetadata {
    name?: string;
    description?: string;
}

export interface NodeMetadata extends ElementMetadata {
    label: string;
    locationX: number;
    locationY: number;
}

export interface ScreenMetadata extends NodeMetadata {
    fields: ScreenFieldMetadata[];
}

export interface ScreenFieldMetadata extends ElementMetadata {
    storeOutputAutomatically?: boolean;
    extensionName?: string;
    fieldType: string;
    fields: ScreenFieldMetadata[];
    inputsOnNextNavToAssocScrn?: 'UseStoredValues' | 'ResetValues';
}

export interface ElementConfig {
    bodyCssClass?: string;
    canBeDuplicated?: boolean;
    canHaveDefaultConnector?: boolean;
    canHaveFaultConnector?: boolean;
    canvasElement?: boolean;
    childReferenceKey?: { [key: string]: string };
    color?: string;
    description?: string;
    descriptor?: string | Descriptor;
    elementSubtype?: string;
    elementType?: string;
    factory?: Factory;
    configComponent?: string;
    icon?: string;
    isChildElement?: boolean;
    isDeletable?: boolean;
    isElementSubtype?: boolean;
    label?: string;
    labels?: LabelsObject;
    metadataFilter?: (args: any) => boolean;
    metadataKey?: string;
    modalSize?: string;
    name?: string;
    nodeConfig?: NodeConfig;
    nonHydratableProperties?: string[];
}

interface LabelsObject {
    singular: string;
    plural?: string;
    leftPanel?: string;
    newModal?: string;
    editModal?: string;
    editTrigger?: string;
    editSchedule?: string;
    editPlatform?: string;
    editObject?: string;
    editTriggerObjectLabel?: string;
    editObjectAndFiltersLabel?: string;
    editTimeTrigger?: string;
    connectorPickerHeader?: string;
    connectorPickerBodyText?: string;
    comboBoxLabel?: string;
    [propName: string]: any;
}

interface NodeConfig {
    canBeConnectorTarget?: boolean;
    description?: string;
    dragImageSrc?: string;
    dynamicNodeComponent?: string;
    dynamicNodeComponentSelector?: (args: any) => any;
    iconBackgroundColor?: string;
    iconName: string;
    iconShape?: string;
    iconSize?: string;
    maxConnections?: number;
    section?: string;
    utilityIconName?: string;
    value?: string;
}

interface Factory {
    uiToFlow?: Function;
    propertyEditor?: (args: any) => any;
    flowToUi?: (args: any, arg2?: any) => any;
    pasteElement?: (args: any) => any;
    duplicateElement?: Function;
    closePropertyEditor?: (args: any) => any;
}

interface Descriptor {
    [p: string]: string;
}

export interface Condition {
    leftValueReference?: string;
    operator: string;
    rightValue: {
        stringValue: string;
    };
}

export interface ComboboxItem {
    type: string;
    dataType: string;
    text?: string;
    subText?: string;
    displayText: string;
    iconName?: string | null | undefined;
    iconAlternativeText?: string;
    iconSize?: string;
    value: string;
}
