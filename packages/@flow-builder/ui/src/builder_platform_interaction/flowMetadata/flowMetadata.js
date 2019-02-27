export const FLOW_PROCESS_TYPE = {
    ACTION_CADENCE_FLOW : 'ActionCadenceFlow',
    ACTION_PLAN : 'ActionPlan',
    APPOINTMENTS : 'Appointments',
    AUTO_LAUNCHED_FLOW : 'AutoLaunchedFlow',
    CHECKOUT_FLOW : 'CheckoutFlow',
    CONTACT_REQUEST_FLOW : 'ContactRequestFlow',
    CUSTOM_EVENT : 'CustomEvent',
    FIELD_SERVICE_MOBILE : 'FieldServiceMobile',
    FIELD_SERVICE_WEB : 'FieldServiceWeb',
    FLOW : 'Flow',
    FORM : 'Form',
    INVOCABLE_PROCESS : 'InvocableProcess',
    LOGIN_FLOW : 'LoginFlow',
    JOURNEY_BUILDER_INTEGRATION : 'JourneyBuilderIntegration',
    MANAGED_CONTENT_FLOW : 'ManagedContentFlow',
    ORCHESTRATION_FLOW : 'OrchestrationFlow',
    SURVEY : 'Survey',
    TRANSACTION_SECURITY_FLOW : 'TransactionSecurityFlow',
    USER_PROVISIONING_FLOW : 'UserProvisioningFlow',
    WORKFLOW : 'Workflow'
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
    RECORD_CHOICE_SET: 'RECORD_CHOICE_SET',
    PICKLIST_CHOICE_SET: 'PICKLIST_CHOICE_SET',
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
    WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS: 'WAIT_WITH_MODIFIED_AND_DELETED_WAIT_EVENTS',
    WAIT_EVENT: 'WAIT_EVENT',
    FLOW_PROPERTIES: 'FLOW_PROPERTIES',
    SCREEN_FIELD: 'SCREEN_FIELD',
    SCREEN_WITH_MODIFIED_AND_DELETED_SCREEN_FIELDS: 'SCREEN_WITH_MODIFIED_AND_DELETED_SCREEN_FIELDS',
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
    RECORD_CREATES: 'recordCreates',
    RECORD_LOOKUPS: 'recordLookups',
    RECORD_DELETES: 'recordDeletes',
    RECORD_UPDATES: 'recordUpdates',
    LOOPS: 'loops',
    SCREENS: 'screens',
    STAGES: 'stages',
    CHOICES: 'choices',
    STEPS: 'steps',
    DYNAMIC_CHOICE_SETS: 'dynamicChoiceSets'
};

export const UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE = {
    [ELEMENT_TYPE.ACTION_CALL]: "ACTIONCALL",
    [ELEMENT_TYPE.ASSIGNMENT]: "ASSIGNMENT",
    [ELEMENT_TYPE.VARIABLE]: "VARIABLE",
    [ELEMENT_TYPE.DECISION]: "DECISION",
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: "APEXPLUGIN",
    [ELEMENT_TYPE.APEX_CALL]: "ACTIONCALL",
    [ELEMENT_TYPE.EMAIL_ALERT]: "ACTIONCALL",
    [ELEMENT_TYPE.CHOICE]: "CHOICE",
    [ELEMENT_TYPE.CONSTANT]: "CONSTANT",
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: "CHOICELOOKUP",
    [ELEMENT_TYPE.PICKLIST_CHOICE_SET]: "CHOICELOOKUP",
    [ELEMENT_TYPE.FORMULA]: "FORMULA",
    [ELEMENT_TYPE.STAGE]: "STAGE",
    [ELEMENT_TYPE.TEXT_TEMPLATE]: "TEXTTEMPLATE",
    [ELEMENT_TYPE.LOOP]: "LOOP",
    [ELEMENT_TYPE.RECORD_CREATE]: "RECORDCREATE",
    [ELEMENT_TYPE.RECORD_DELETE]: "RECORDDELETE",
    [ELEMENT_TYPE.RECORD_LOOKUP]: "RECORDQUERY",
    [ELEMENT_TYPE.RECORD_UPDATE]: "RECORDUPDATE",
    [ELEMENT_TYPE.SCREEN]: "SCREEN",
    [ELEMENT_TYPE.SCREEN_FIELD]: "SCREENFIELD",
    [ELEMENT_TYPE.STEP]: "STEP",
    [ELEMENT_TYPE.SUBFLOW]: "SUBFLOW",
    [ELEMENT_TYPE.WAIT]: "WAIT",
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

// Property names in wait event
export const WAIT_EVENT_FIELDS = {
    EVENT_TYPE : 'eventType',
    INPUT_PARAMETERS : 'inputParameters',
    OUTPUT_PARAMETERS : 'outputParameters',
};

/**
 * The time event types of wait events. For time events, these can be either absolute (alarmEvent)
 * or direct record time (dateRefAlarmEvent)
 * @typedef {String} WaitTimeEventType
 */
export const WAIT_TIME_EVENT_TYPE = {
    ABSOLUTE_TIME: 'AlarmEvent',
    DIRECT_RECORD_TIME: 'DateRefAlarmEvent'
};

/**
 * Acceptable values for wait time offset units
 * @type {{hours, days}}
 */
export const WAIT_TIME_EVENT_OFFSET_UNIT = {
    HOURS: 'Hours',
    DAYS: 'Days'
};

/**
 * All the input and output parameter names for various event types.
 * Note: We might need additional parameters for standard event.
 * TODO: W-5531948 once we fetch the event parameters from service we might not need it.
 */
export const WAIT_TIME_EVENT_PARAMETER_NAMES = {
    ABSOLUTE_BASE_TIME: 'AlarmTime',
    SALESFORCE_OBJECT: 'TimeTableColumnEnumOrId',
    DIRECT_RECORD_BASE_TIME: 'TimeFieldColumnEnumOrId',
    RECORD_ID: 'EntityObjectId',
    EVENT_DELIVERY_STATUS: 'Status',
    RESUME_TIME: 'AlarmTime',
    OFFSET_NUMBER: 'TimeOffset',
    OFFSET_UNIT: 'TimeOffsetUnit',
};

/**
 * Map of input and output parameter names for an event type.
 * Note: We might need additional info for standard event type.
 * TODO: W-5531948 once we fetch the event parameters from service we might not need it.
 */
export const WAIT_TIME_EVENT_FIELDS = {
    [WAIT_TIME_EVENT_TYPE.ABSOLUTE_TIME]: {
        [WAIT_EVENT_FIELDS.INPUT_PARAMETERS]: [
            WAIT_TIME_EVENT_PARAMETER_NAMES.ABSOLUTE_BASE_TIME,
            WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_NUMBER,
            WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT,
        ],
        [WAIT_EVENT_FIELDS.OUTPUT_PARAMETERS]: [
            WAIT_TIME_EVENT_PARAMETER_NAMES.RESUME_TIME,
            WAIT_TIME_EVENT_PARAMETER_NAMES.EVENT_DELIVERY_STATUS,
        ],
    },
    [WAIT_TIME_EVENT_TYPE.DIRECT_RECORD_TIME]: {
        [WAIT_EVENT_FIELDS.INPUT_PARAMETERS]: [
            WAIT_TIME_EVENT_PARAMETER_NAMES.SALESFORCE_OBJECT,
            WAIT_TIME_EVENT_PARAMETER_NAMES.DIRECT_RECORD_BASE_TIME,
            WAIT_TIME_EVENT_PARAMETER_NAMES.RECORD_ID,
            WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_NUMBER,
            WAIT_TIME_EVENT_PARAMETER_NAMES.OFFSET_UNIT,
        ],
        [WAIT_EVENT_FIELDS.OUTPUT_PARAMETERS]: [
            WAIT_TIME_EVENT_PARAMETER_NAMES.RESUME_TIME,
            WAIT_TIME_EVENT_PARAMETER_NAMES.EVENT_DELIVERY_STATUS,
        ],
    },
};

/**
 * List of Flow metadata fields that can be references to other Flow elements
 * i.e. fields whose values need to be converted from dev names to GUIDs when loading the flow into the UI client and vice versa.
 */
export const REFERENCE_FIELDS = new Set([
    'elementReference',
    'targetReference',
    'assignToReference',
    'assignRecordIdToReference',
    'leftValueReference',
    'outcomeReference',
    'childReference',
    'source',
    'target',
    'leftHandSide',
    'rightHandSide', // rightHandSide is a reference when used in output assignments, like in Get Records
    'assignNextValueToReference',
    'collectionReference',
    'outputReference',
    'inputReference',
    'choiceReference',
    'defaultSelectedChoiceReference',
    'fieldReference',
    'waitEventReference',
]);

/**
 * List of Flow metadata fields that can contain {!reference} tags referencing flow elements
 * These would also need to be replaced
 */
export const TEMPLATE_FIELDS = new Set([
    'stringValue', // field of a ferov
    'expression',  // represents body of a formula
    'text',        // represents body of a text template
    'fieldText',   // body of screen field of type Display Text
    'helpText',     // help text for a screen or screen field
    'pausedText', // Paused text for screens
    'interviewLabel', // interview label for the flow properties
    'errorMessage', // errorMessage field in validationRule Object for choice editor and screenField
    'formulaExpression', // used in validation Rule Object for choice editor and screenField
    'choiceText', // used in Choice Editor
    'promptText', // used in Choice Editor
]);

export const EXPRESSION_RE = /\{!([^}]+)\}/g;

export const FLOW_STATUS = {
    ACTIVE: 'Active',
    OBSOLETE: 'Obsolete',
    DRAFT: 'Draft',
    INVALID_DRAFT: 'InvalidDraft',
};
