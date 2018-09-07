export const SERVER_ACTION_TYPE = {
    GET_FLOW: 'getFlow',
    SAVE_FLOW: 'saveFlow',
    GET_RULES: 'getRules',
    GET_LEFT_PANEL_ELEMENTS: 'getElements',
    GET_INVOCABLE_ACTIONS: 'getInvocableActions',
    GET_APEX_PLUGINS: 'getApexPlugins',
    GET_SUBFLOWS: 'getSubflows',
    GET_INVOCABLE_ACTION_PARAMETERS: 'getInvocableActionParameters',
    GET_ENTITIES: 'getEntities',
    GET_ENTITY_FIELDS: 'getEntityFields',
    GET_ORG_ACCESSIBLE_ENTITY_FIELDS: 'getOrgAcessibleEntityFields',
    GET_GLOBAL_VARIABLE_TYPES: 'getGlobalVariableTypes',
    GET_GLOBAL_VARIABLES: 'getGlobalVariables',
    GET_HEADER_URLS: 'getHeaderUrls',
    GET_RESOURCE_TYPES: 'getResourceTypes',
    GET_FLOW_EXTENSIONS: 'getFlowExtensions',
    GET_FLOW_EXTENSION_PARAMS: 'getFlowExtensionParams',
    GET_FLOW_EXTENSION_LIST_PARAMS: 'getFlowExtensionListParams',
    GET_USER_PREFERENCES: 'getUserPreferences',
    SET_USER_PREFERENCES: 'setUserPreferences',
    GET_CONTEXT: 'getContext',
    GET_OPERATORS: 'getOperators',
};

const actionConfig = {
    [SERVER_ACTION_TYPE.GET_FLOW]: 'c.retrieveFlow',
    [SERVER_ACTION_TYPE.SAVE_FLOW]: 'c.saveFlow',
    [SERVER_ACTION_TYPE.GET_RULES]: 'c.retrieveAllRules',
    [SERVER_ACTION_TYPE.GET_LEFT_PANEL_ELEMENTS]: 'c.retrieveElementsPalette',
    [SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS]: 'c.getAllInvocableActionsForType',
    [SERVER_ACTION_TYPE.GET_APEX_PLUGINS]: 'c.getApexPlugins',
    [SERVER_ACTION_TYPE.GET_SUBFLOWS]: 'c.getSubflows',
    [SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS]: 'c.getInvocableActionParameters',
    [SERVER_ACTION_TYPE.GET_ENTITIES]: 'c.getEntities',
    [SERVER_ACTION_TYPE.GET_ENTITY_FIELDS]: 'c.getFieldsForEntity',
    [SERVER_ACTION_TYPE.GET_ORG_ACCESSIBLE_ENTITY_FIELDS]: 'c.getOrgAccessibleFieldsForEntity',
    [SERVER_ACTION_TYPE.GET_GLOBAL_VARIABLE_TYPES]: 'c.getGlobalVariableTypes',
    [SERVER_ACTION_TYPE.GET_GLOBAL_VARIABLES]: 'c.getGlobalVariables',
    [SERVER_ACTION_TYPE.GET_HEADER_URLS]: 'c.retrieveHeaderUrls',
    [SERVER_ACTION_TYPE.GET_RESOURCE_TYPES]: 'c.getResourceTypes',
    [SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS]: 'c.getFlowExtensions',
    [SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_PARAMS]: 'c.getFlowExtensionParams',
    [SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_LIST_PARAMS]: 'c.getFlowExtensionListParams',
    [SERVER_ACTION_TYPE.GET_USER_PREFERENCES]: 'c.getUserPreferences',
    [SERVER_ACTION_TYPE.SET_USER_PREFERENCES]: 'c.setUserPreferences',
    [SERVER_ACTION_TYPE.GET_CONTEXT]: 'c.getContext',
    [SERVER_ACTION_TYPE.GET_OPERATORS]: 'c.getOperators',
};

let auraFetch;

/**
 * Set the generic function to get server data
 * @param {Function} fn aura fetch function
 */
export function setAuraFetch(fn) {
    auraFetch = fn;
}

/**
 * Makes the call to get server data and executes callback if component is still connected.
 * @param {String} serverActionType type of action to be executed
 * @param {Function} callback function to be executed after getting response from server
 * @param {Object} params any parameters to make server call
 * @param {Object} storable set to true if results need to be cached, Background set to true if request needs to be run as background action
 * @return {Function} setComponentDisconnected this should be called in disconnected callback of a component
 */
export function fetch(serverActionType, callback, params, { background = false, storable = false } = {}) {
    let executeCallback = true;

    function shouldExecuteCallback() {
        return executeCallback;
    }

    function stopCallbackExecution() {
        executeCallback = false;
    }

    if (actionConfig[serverActionType] && auraFetch) {
        auraFetch(actionConfig[serverActionType], shouldExecuteCallback, callback, params, background, storable);
    }
    return stopCallbackExecution;
}