export const FLOW_PROCESS_TYPE = {
    AUTO_LAUNCHED_FLOW : 'AutoLaunchedFlow',
    FLOW : 'Flow'
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
    VARIABLES: 'variables',
    SUBFLOWS: 'subflows',
    RECORD_CREATE: 'recordCreates',
    RECORD_LOOKUP: 'recordLookups',
    RECORD_DELETE: 'recordDeletes',
    RECORD_UPDATE: 'recordUpdates'
};

/**
 * AND and OR are flow values which are used by the backend as well as being as used
 * on the frontend (combobox values).  CUSTOM_LOGIC is used only by the frontend as a
 * combobox value
 * @type {{AND: string, OR: string, CUSTOM_LOGIC: string}}
 */
export const CONDITION_LOGIC = {
    AND: 'and',
    OR: 'or',
    CUSTOM_LOGIC: 'custom_logic'
};
