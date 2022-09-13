/*
 * TODO: IMPORTANT: These interfaces represent the metadata.
 * This is based on https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_visual_workflow.htm
 */
declare namespace Metadata {
    type ElementReferenceOrValue =
        | { booleanValue: boolean }
        | { dateTimeValue: Date }
        | { dateValue: Date }
        | { elementReference: string }
        | { numberValue: number }
        | { stringValue: string };

    type Value = {
        name: string;
        value?: ElementReferenceOrValue;
    };

    interface BaseElement {
        processMetadataValues?: Value[];
    }

    interface RecordFilter extends BaseElement {
        field: string;
        operator: string;
        value?: ElementReferenceOrValue;
    }

    interface Element extends BaseElement {
        name?: string;
        description?: string;
        isNew?: boolean;
    }

    interface Node extends Element {
        label: string;
        locationX: number;
        locationY: number;
    }

    interface AssignmentItem extends BaseElement {
        assignToReference: string;
        operator: string;
        value: ElementReferenceOrValue;
    }

    interface Assignment extends Node {
        assignmentItems: AssignmentItem[];
        connector: Connector;
    }

    interface ChoiceUserInput extends BaseElement {
        isRequired: boolean;
        promptText: string;
        validationRule: InputValidationRule;
    }
    interface Choice extends Element {
        choiceText: string;
        dataType: string;
        userInput: ChoiceUserInput;
        value: ElementReferenceOrValue;
    }

    interface DynamicChoiceSet extends Element {
        collectionReference: string;
        dataType: string;
        displayField: string;
        filters: RecordFilter[];
        limit: number;
        object: string;
        outputAssignments: OutputFieldAssignment[];
        picklistField: string;
        picklistObject: string;
        sortField: string;
        sortOrder: string;
        valueField: string;
    }

    interface InputValidationRule extends BaseElement {
        errorMessage: string;
        formulaExpression: string;
    }

    interface Screen extends Node {
        allowBack: boolean;
        allowFinish: boolean;
        allowPause: boolean;
        backButtonLabel: string;
        connector: Connector;
        fields: ScreenField[];
        helpText: string;
        nextOrFinishButtonLabel: string;
        pauseButtonLabel: string;
        pausedText: string;
        showFooter: boolean;
        showHeader: boolean;
    }

    interface ScreenField extends Element {
        storeOutputAutomatically?: boolean;
        extensionName?: string;
        fieldType: string;
        fields: ScreenField[];
        inputsNextBehavior?: 'Remember' | 'Recalculate';
    }

    interface Start extends Node {
        filters?: RecordFilter[];
        filterLogic: string;
        object?: string;
        recordTriggerType?: string;
        schedule: Schedule;
        triggerType: UI.FlowTriggerType;
        scheduledPaths?: ScheduledPath[];
        doesRequireRecordChangedToMeetCriteria?: boolean;
        connector: Connector;
        filterFormula?: string;
        timeZoneSidKey?: string;
    }

    interface ScheduledPath extends Element {
        name: string;
        timeSource: string;
        offsetUnit: string;
        offsetNumber: string;
        recordField?: string;
        pathType?: string;
        connector: Connector;
        label?: string;
        maxBatchSize?: string;
    }

    interface Connector extends BaseElement {
        targetReference: string;
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

    interface CollectionChoiceSetMetadata extends Element {
        displayField?: string;
        valueField?: string;
        collectionReference?: string;
    }

    interface Variable extends Element {
        apexClass: string;
        dataType: string;
        isCollection: boolean;
        isInput: boolean;
        isOutput: boolean;
        objectType: string;
        scale: number;
        value: ElementReferenceOrValue;
    }

    interface Constant extends Element {
        dataType: string;
        value: ElementReferenceOrValue;
    }

    interface TextTemplate extends Element {
        isViewedAsPlainText: boolean;
        text: string;
    }

    interface Stage extends Element {
        isActive: boolean;
        label: string;
        stageOrder: number;
    }

    interface InputFieldAssignment extends BaseElement {
        field: string;
        value: ElementReferenceOrValue;
    }

    interface OutputFieldAssignment extends BaseElement {
        assignToReference: string;
        field: string;
    }

    interface RecordUpdate extends Node {
        connector: Connector;
        faultConnector: Connector;
        filters: RecordFilter[];
        inputAssignments: InputFieldAssignment[];
        object: string;
        inputReference: string;
    }

    interface RecordLookup extends Node {
        assignNullValuesIfNoRecordFound: boolean;
        connector: Connector;
        faultConnector: Connector;
        filters: RecordFilter[];
        getFirstRecordOnly: boolean;
        limit: number;
        object: string;
        outputAssignments: OutputFieldAssignment[];
        outputReference: string;
        queriedFields: string[];
        sortField: string;
        sortOrder: SortOrder;
        storeOutputAutomatically: boolean;
    }

    interface RecordDelete extends Node {
        connector: Connector;
        faultConnector: Connector;
        filters: RecordFilter[];
        object: string;
        inputReference: string;
    }

    interface RecordCreate extends Node {
        assignRecordIdToReference: string;
        connector: Connector;
        faultConnector: Connector;
        inputAssignments: InputFieldAssignment[];
        inputReference: string;
        object: string;
        storeOutputAutomatically: boolean;
    }

    interface Formula extends Element {
        dataType: string;
        expression: string;
        scale: number;
    }

    interface ApexPluginCallInputParameter extends BaseElement {
        name: string;
        value: ElementReferenceOrValue;
    }

    interface ApexPluginCallOutputParameter extends BaseElement {
        assignToReference: string;
        name: string;
    }

    interface ApexPluginCall extends Node {
        apexClass: string;
        connector: Connector;
        faultConnector: Connector;
        inputParameters: ApexPluginCallInputParameter[];
        outputParameters: ApexPluginCallOutputParameter[];
    }

    interface DataTypeMapping extends BaseElement {
        typeName: string;
        typeValue: string;
    }

    interface ActionCallInputParameter extends BaseElement {
        name: string;
        value: ElementReferenceOrValue;
    }

    interface ActionCallOutputParameter extends BaseElement {
        assignToReference: string;
        name: string;
    }

    interface ActionCall extends Node {
        actionName: string;
        actionType: string;
        connector: Connector;
        dataTypeMappings: DataTypeMapping[];
        faultConnector: Connector;
        inputParameters: ActionCallInputParameter[];
        outputParameters: ActionCallOutputParameter[];
        storeOutputAutomatically: boolean;
    }

    interface CollectionProcessor extends Node {
        collectionReference: string;
        collectionProcessorType: string;
        limit: number;
    }

    interface Condition extends BaseElement {
        leftValueReference: string;
        operator: string;
        rightValue: ElementReferenceOrValue;
    }

    interface Decision extends Node {
        defaultConnector: Connector;
        defaultConnectorLabel: string;
        rules: FlowRule[];
    }

    interface FlowRule extends BaseElement {
        conditionLogic: string;
        conditions: Condition[];
        connector: Connector;
        label: string;
        doesRequireRecordChangedToMeetCriteria: boolean;
    }

    interface Loop extends Node {
        nextValueConnector: Connector;
        noMoreValuesConnector: Connector;
        collectionReference: string;
        assignNextValueToReference: string;
        iterationOrder: SortOrder;
    }

    interface SubflowInputAssignment extends BaseElement {
        name: string;
        value: ElementReferenceOrValue;
    }

    interface SubflowOutputAssignment extends BaseElement {
        assignToReference: string;
        name: string;
    }

    interface Subflow extends Node {
        flowName: string;
        inputAssignments: SubflowInputAssignment[];
        outputAssignments: SubflowOutputAssignment[];
        storeOutputAutomatically: boolean;
    }

    interface Wait extends Node {
        defaultConnector: Connector;
        defaultConnectorLabel: string;
        faultConnector: Connector;
        waitEvents: WaitEvent[];
    }

    interface WaitEvent extends BaseElement {
        conditionLogic: string;
        conditions: Condition[];
        connector: Connector;
        eventType: string;
        inputParameters: WaitEventInputParameter[];
        outputParameters: WaitEventOutputParameter[];
        label: string;
    }

    interface WaitEventInputParameter extends BaseElement {
        name: string;
        value: ElementReferenceOrValue;
    }

    interface WaitEventOutputParameter extends BaseElement {
        assignToReference: string;
        name: string;
    }

    interface Metadata {
        actionCalls: ActionCall[];
        apexPluginCalls: ApexPluginCall[];
        assignments: Assignment[];
        choices: Choice[];
        collectionProcessors: CollectionProcessor[];
        constants: Constant[];
        decisions: Decision[];
        dynamicChoiceSets: DynamicChoiceSet[];
        formulas: Formula[];
        loops: Loop[];
        recordCreates: RecordCreate[];
        recordDeletes: RecordDelete[];
        recordLookups: RecordLookup[];
        recordUpdates: RecordUpdate[];
        recordRollbacks: Node[];
        screens: Screen[];
        stages: Stage[];
        start: Start;
        subflows: Subflow[];
        textTemplates: TextTemplate[];
        variables: Variable[];
        waits: Wait[];
    }

    type FlowTestReferenceOrValue = ElementReferenceOrValue | { sobjectValue: string };

    interface FlowTestParameter {
        leftValueReference: string;
        type: string;
        value: FlowTestReferenceOrValue;
    }

    interface FlowTestCondition {
        leftValueReference: string;
        operator: string;
        rightValue: FlowTestReferenceOrValue;
    }

    interface FlowTestAssertion {
        conditions: FlowTestCondition[];
        errorMessage?: string;
    }

    interface FlowTestPoint {
        assertions: FlowTestAssertion[];
        elementApiName: string;
        parameters: FlowTestParameter[];
    }

    interface FlowTestMetadata {
        description?: string;
        flowApiName: string;
        label: string;
        testPoints: FlowTestPoint[];
    }

    type SortOrder = 'Asc' | 'Desc';

    interface Field {
        apiName: string;
        isCustom: boolean;
        isPolymorphic: boolean;
        isRelatedRecordChild: boolean;
        sobjectName: string;
        referenceToNames: string[];
    }

    interface Transform {
        connector: Connector;
        apexClass: string;
        dataType: string;
        isCollection: boolean;
        objectType: string;
        scale: number;
        outputValue: string;
        transformValue: TransformValue[];
    }

    interface TransformValue {
        inputReference: string;
        transformActions: TransformAction;
    }

    interface TransformAction {
        transformType: TransformActionType;
        outputFieldApiName: string;
        value: string;
    }

    type TransformActionType = 'Map';
}
