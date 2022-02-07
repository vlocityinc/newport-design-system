/*
 * TODO: IMPORTANT: These interfaces represent our expected usages.
 * The "baseXXX" methods below and their usages in various factories have NOT been updated
 * and will need to be addressed via a separate refactoring (ideally as they are converted
 * to typescript).  Ideally, the interfaces and the baseXXX methods are combined in to classes with constructors
 */
declare namespace UI {
    type Guid = string;
    type ElementType = string;
    type ElementSubtype = string;
    type Datatype = string;

    type Ferov = {
        elementReference: string | null;
        value: string | null;
    };

    interface CanvasElementConfig {
        isHighlighted: boolean;
        isSelectable: boolean;
        isSelected: boolean;
        hasError: boolean;
    }

    interface ConnectorConfig {
        isSelected: boolean;
    }

    interface Element {
        // TODO: IMPORTANT: elementType should *NOT* be optional.  Once baseElement and its usages are cleaned up to always have
        // an elementType then it should be required here
        elementType?: ElementType;
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
        connector?: Connector;
        picklistObject?: string;
        picklistField?: string;
        isNew?: boolean;
        storeOutputAutomatically?: boolean;
    }

    interface HydratedValue {
        value: string | null;
        error: string | null;
    }

    // An element is hydrated when it is edited in a property editor
    interface HydratedElement {
        elementType?: ElementType;
        label?: HydratedValue;
        guid: Guid;
        name?: HydratedValue;
        description?: HydratedValue;
        dataType?: Datatype;
        subtype?: string;
        isCollection?: boolean;
        isCanvasElement?: boolean;
        connector?: Connector;
    }

    interface BaseCanvasElement extends Element {
        // This is the "label" in the property editor UI
        label: string | null;
        locationX: number;
        locationY: number;
        // TODO: eventually replace this with type checking
        isCanvasElement: boolean;
        connectorCount: number;
        config: CanvasElementConfig;
        elementSubtype: ElementSubtype;
        canHaveFaultConnector: boolean;
    }

    interface CanvasElement extends BaseCanvasElement {
        availableConnections?: AvailableConnection[];
        childReferences?: ChildReference[];
        elementType: string;
        maxConnections: number;
        canHaveCanvasEmbeddedElement?: boolean;
    }

    interface ChildElement extends Element {
        // This is the "label" in the property editor UI
        label?: string;
    }

    type ScreenFieldType = {
        name: string;
        fieldType: string;
        dataType?: string;
        label?: string;
        icon?: string;
        category?: string;
        type?: string;
        description?: string;
    };

    type ValidationRule = {
        formulaExpression: string | null;
        errorMessage: string | null;
    };

    type VisibilityRule = {
        conditionLogic: string;
        conditions: Array<Condition>;
    };

    interface Screen extends CanvasElement {
        allowHelp?: boolean;
        backLabel?: string | null;
        backLabelType?: string;
        fields?: ScreenField[];
        helpText?: string;
        nextOrFinishLabel?: string | null;
        nextOrFinishLabelType?: string;
        pauseLabel?: string | null;
        pauseLabelType?: string;
        pauseMessageType?: string;
        pausedText?: string;
        showFooter: boolean;
        showHeader: boolean;
        getFieldByGUID?: Function;
        findFieldByGUID?: Function;
        getFieldIndexesByGUID?: Function;
        findFieldIndexByGUID?: Function;
    }

    interface ScreenField extends Element {
        extensionName?: string;
        inputsOnNextNavToAssocScrn?: 'UseStoredValues' | 'ResetValues';
        fieldText?: string;
        fieldType: string;
        helpText: string;
        defaultValue?: Ferov;
        defaultValueDataType?: Datatype;
        defaultValueIndex: Guid;
        dataTypeMappings?: DataTypeMapping[];
        objectFieldReference?: string;
        type: ScreenFieldType;
        precision?: number;
        scale?: number;
        length?: number;
        validationRule?: ValidationRule;
        inputParameters: [];
        isRequired: boolean;
        isCreateable: boolean;
        isUpdateable: boolean;
        isVisible: boolean;
        outputParameters: [];
        choiceReferences: [];
        visibilityRule: VisibilityRule;
        dynamicTypeMappings: DataTypeMapping[];
        fields: ScreenField[];
    }

    interface DataTypeMapping {
        typeName: HydratedValue;
        typeValue: HydratedValue;
    }

    interface ActionCall extends Element {
        dataTypeMappings?: DataTypeMapping[];
        inputParameters: [];
    }

    interface BaseCanvasElementWithFilter extends BaseCanvasElement {
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

    interface Start extends BaseCanvasElementWithFilter, Schedule {
        doesRequireRecordChangedToMeetCriteria: boolean;
        triggerType?: string;
        haveSystemVariableFields?: boolean;
        object: string;
        objectIndex?: string;
        objectContainer?: string;
        isAssignable?: boolean;
        recordTriggerType?: string;
        scheduledPaths?: ScheduledPath[];
        childReferences: ChildReference[];
        availableConnections: AvailableConnection[];
        shouldSupportScheduledPaths: boolean;
        formulaFilter?: string;
    }

    interface Schedule {
        startDate: string;
        startTime: StartTime;
        recordTriggerType?: string;
        frequency: string;
    }

    type StartTime = {
        timeInMillis?: number;
    };

    interface ScheduledPath extends ChildElement {
        timeSource?: string;
        offsetUnit?: string;
        offsetNumber?: string;
        pathType?: string;
        maxBatchSize?: string;
    }

    type ConnectorType = string;

    interface AvailableConnection {
        type: ConnectorType;
        childReference?: Guid;
    }

    interface ChildReference {
        childReference: Guid;
    }

    interface Connector {
        guid: Guid;
        source: Guid;
        target: Guid;
        type: ConnectorType;
        label: string | null;
        childSource?: Guid;
        isGoTo?: boolean;
        config: ConnectorConfig;
    }

    type StringKeyedMap<T> = { [key: string]: T };
    type Elements = StringKeyedMap<Element>;
    type HydratedElements = StringKeyedMap<HydratedElement>;

    interface Properties {
        isAutoLayoutCanvas: boolean;
        processType: string;

        [key: string]: string | undefined | null | number | boolean;
    }

    type EntityDefinition = {
        apiName: string;
        createable: boolean;
        custom: boolean;
        deletable: boolean;
        entityLabel: string;
        entityLabelPlural: string;
        queryable: boolean;
        updateable: boolean;
        durableId?: string;
    };

    type StoredEntities = {
        allEntities: EntityDefinition[];
        allEntitiesMap: UI.StringKeyedMap<EntityDefinition>;
        queryableEntities: EntityDefinition[];
        createableEntities: EntityDefinition[];
        deletableEntities: EntityDefinition[];
        updateableEntities: EntityDefinition[];
        workflowEnabledEntities: EntityDefinition[];
    };

    type PeripheralData = {
        entities?: StoredEntities;
    };

    interface StoreState {
        elements: Elements;
        connectors: Connector[];
        canvasElements: Guid[];
        properties: Properties;
        peripheralData?: PeripheralData;
    }

    interface ElementConfig {
        bodyCssClass?: string;
        canBeDuplicated?: boolean;
        canHaveDefaultConnector?: boolean;
        canHaveFaultConnector?: boolean;
        canvasElement?: boolean;
        areChildElementsSupported?: boolean;
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
        modalSize?: string | ModalSize;
        name?: string;
        nodeConfig?: NodeConfig;
        nonHydratableProperties?: string[];
        getChildrenItems?: (element: Element) => StringKeyedMap<any>;
        hasOwnPropertyEditor?: boolean;
        propertyEditorPanelSize?: string;
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
        editScheduledPath?: string;
        connectorPickerHeader?: string;
        connectorPickerBodyText?: string;
        comboBoxLabel?: string;

        [propName: string]: any;
    }

    interface NodeConfig {
        canBeConnectorTarget?: boolean;
        description?: string;
        orchestratorDescription?: string;
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
        initialization?: (args: Metadata.Start) => Start; // This is only applicable to Start element as it is a unique case.
        uiToFlow?: Function;
        propertyEditor?: (args: any) => any;
        flowToUi?: (args: any, arg2?: any, arg3?: string | null | undefined) => any;
        pasteElement?: (args: any) => any;
        duplicateElement?: Function;
        closePropertyEditor?: (args: any) => any;
    }

    interface Descriptor {
        [p: string]: string;
    }

    interface ModalSize {
        [p: string]: string;
    }

    interface Condition {
        leftValueReference?: string;
        leftHandSide?: {
            value: string;
            error?: string;
        };
        operator: string;
        rightValue: {
            stringValue: string;
        };
    }

    interface ComboboxItem {
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

    interface NewResourceInfo {
        userProvidedText?: string | null;
        resourceTypes?: Array<string> | null;
        dataType?: string | null;
        newResourceTypeLabel?: string | null;
        newResource?: {} | null;
        preValidationNeeded?: boolean;
    }

    type LegalNotice = {
        header: string;
        shown?: boolean;
        dismissed?: boolean;
    };
    interface CollectionChoiceSetElement extends Element {
        displayField?: string;
        displayFieldIndex?: string;
        valueField?: string;
        valueFieldIndex?: string;
        collectionReference?: string;
        collectionReferenceIndex?: string;
    }

    interface FlowScreenExtension {
        name: string;
        extensionType: string;
        fieldType: string;
        label: string;
        icon: string;
        category: string;
        marker: string;
        source: string;
        description: string;
    }

    interface FlowExtensionParameter {
        apiName: string;
        dataType: string;
        subtype: string;
        availableValues: any[];
        description: string;
        hasDefaultValue: boolean;
        isRequired: boolean;
        label: string;
        isInput: boolean;
        isOutput: boolean;
        maxOccurs: number;
        defaultValue?: any;
    }
    interface ScreenFieldInputParameter {
        name: HydratedValue;
        value: HydratedValue;
        valueDataType: string;
    }
    interface MenuItem {
        element: { guid: string };
        label: string;
        isDraggable: boolean;
    }

    interface FlowTestData {
        label: string;
        name: string;
        description?: string;
        runPathValue: string;
        testTriggerType: string;
    }
}
