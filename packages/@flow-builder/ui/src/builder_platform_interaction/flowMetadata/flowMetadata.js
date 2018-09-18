export const FLOW_PROCESS_TYPE = {
    AUTO_LAUNCHED_FLOW : 'AutoLaunchedFlow',
    FLOW : 'Flow'
};

export const ELEMENT_TYPE = {
    ACTION_CALL: 'ACTION_CALL',
    ASSIGNMENT: 'ASSIGNMENT',
    VARIABLE: 'VARIABLE',
    DECISION: 'DECISION',
    DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES: 'DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES',
    APEX_PLUGIN_CALL: 'APEX_PLUGIN_CALL',
    APEX_CALL: 'APEX_CALL',
    EMAIL_ALERT: 'EMAIL_ALERT',
    CHOICE: 'CHOICE',
    CONSTANT: 'CONSTANT',
    DYNAMIC_CHOICE_SET: 'DYNAMIC_CHOICE_SET',
    FORMULA: 'FORMULA',
    STAGE: 'STAGE',
    TEXT_TEMPLATE: 'TEXT_TEMPLATE',
    LOOP: 'LOOP',
    OUTCOME: 'OUTCOME',
    RECORD_CREATE: 'RECORD_CREATE',
    RECORD_DELETE: 'RECORD_DELETE',
    RECORD_LOOKUP: 'RECORD_LOOKUP',
    RECORD_UPDATE: 'RECORD_UPDATE',
    SCREEN: 'SCREEN',
    STEP: 'STEP',
    SUBFLOW: 'SUBFLOW',
    START_ELEMENT: 'START_ELEMENT',
    WAIT: 'WAIT',
    WAIT_EVENT: 'WAIT_EVENT',
    FLOW_PROPERTIES: 'FLOW_PROPERTIES',
    DEFAULT: 'defaultElement'
};

export const CONNECTOR_TYPE = {
    REGULAR: 'REGULAR',
    FAULT: 'FAULT',
    DEFAULT: 'DEFAULT',
    START: 'START',
    LOOP_NEXT: 'LOOP_NEXT',
    LOOP_END: 'LOOP_END'
};

export const SUB_ELEMENT_TYPE = {
    ASSIGNMENT_ITEM: 'ASSIGNMENT_ITEM',
    CONDITION: 'CONDITION',
    RECORD_LOOKUP_FILTER_ITEM: 'RECORD_LOOKUP_FILTER_ITEM',
    RECORD_LOOKUP_FIELD: 'RECORD_LOOKUP_FIELD',
};

export const ACTION_TYPE = {
    APEX: 'apex',
    EMAIL_ALERT: 'emailAlert',
    QUICK_ACTION: 'quickAction',
    FLOW: 'flow',
    COMPONENT: 'component'
};

export const METADATA_KEY = {
    ACTION_CALLS: 'actionCalls',
    APEX_PLUGIN_CALLS: 'apexPluginCalls',
    ASSIGNMENTS: 'assignments',
    DECISIONS: 'decisions',
    WAITS: 'waits',
    FORMULAS: 'formulas',
    VARIABLES: 'variables',
    CONSTANTS: 'constants',
    TEXT_TEMPLATES: 'textTemplates',
    SUBFLOWS: 'subflows',
    RECORD_CREATE: 'recordCreates',
    RECORD_LOOKUP: 'recordLookups',
    RECORD_DELETE: 'recordDeletes',
    RECORD_UPDATE: 'recordUpdates',
    LOOPS: 'loops',
    SCREENS: 'screens'
};

/**
 * AND and OR are flow values which are used by the backend as well as being as used
 * on the frontend (combobox values).  CUSTOM_LOGIC is used only by the frontend as a
 * combobox value
 * @type {{AND: string, OR: string, ALWAYS: string, CUSTOM_LOGIC: string}}
 */
export const CONDITION_LOGIC = {
    AND: 'and',
    OR: 'or',
    CUSTOM_LOGIC: 'custom_logic',
    NO_CONDITIONS: 'no_conditions'
};

/**
 * The top level process metadata values to save with each flow. This includes the BuilderType
 * which helps us identify flow versions created by the Lightning Flow Builder.
 */
export const PROCESS_METADATA_VALUES = [
    {
        name: 'BuilderType',
        value: {
            stringValue: 'LightningFlowBuilder'
        }
    }
];

/**
 * List of Flow metadata fields that can be references to other Flow elements
 * i.e. fields whose values need to be converted from dev names to GUIDs when loading the flow into the UI client and vice versa.
 */
export const REFERENCE_FIELDS = new Set([
    'elementReference',
    'targetReference',
    'assignToReference',
    'assignNextValueToReference',
    'collectionReference',
    'inputReference',
    'outputReference',
    'assignRecordIdToReference',
    'leftValueReference',
    'outcomeReference',
    'childReference',
    'leftHandSide',
    'defaultValue',
    'source',
    'target',
    'rightHandSideGuid'
]);

/**
 * List of Flow metadata fields that can contain {!reference} tags referencing flow elements
 * These would also need to be replaced
 */
export const TEMPLATE_FIELDS = new Set([
    // TODO fill out more values and confirm that all FEROV stringValue fields allow this behaviour
    'stringValue', // field of a ferov
    'rightHandSide', // field of a ferov
    'expression',  // represents body of a formula
    'text',        // represents body of a text template
    'fieldText',   // body of screen field of type Display Text
    'helpText',     // help text for a screen or screen field
    'interviewLabel' // interview label for the flow properties
]);

export const EXPRESSION_RE = /\{!([^}]+)\}/g;
