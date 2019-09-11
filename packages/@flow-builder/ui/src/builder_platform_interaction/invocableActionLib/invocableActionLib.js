import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';

let cachedParameters = [];
let invocableActions = [];

export function setInvocableActions(actions) {
    invocableActions = actions;
}

export function getInvocableActions() {
    return invocableActions;
}

export function fetchParametersForInvocableAction(
    { actionName, actionType },
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    const key = `${actionName}-${actionType}`;
    if (cachedParameters[key]) {
        return Promise.resolve(cachedParameters[key]);
    }
    const params = { actionName, actionType };
    return fetchOnce(
        SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS,
        params,
        {
            background,
            disableErrorModal,
            messageForErrorModal
        }
    ).then(parameters => {
        cachedParameters[key] = parameters;
        return parameters;
    });
}

/**
 * Grabs the parameters for a specific invocable action from the cache
 *
 * @param {Object} actionId - the action identifier
 * @param {string} actionId.actionName - the action name
 * @param {string} actionId.actionType - the action type
 * @returns {Object} the action parameters
 */
export function getParametersForInvocableAction({ actionName, actionType }) {
    const key = `${actionName}-${actionType}`;
    return cachedParameters[key];
}

export function isAutomaticOutputHandlingSupported(flowProcessType) {
    const processTypeAutomaticOutPutHandlingSupport = getProcessTypeAutomaticOutPutHandlingSupport(
        flowProcessType
    );
    return (
        processTypeAutomaticOutPutHandlingSupport ===
        FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
    );
}

export function clearInvocableActionCachedParameters() {
    cachedParameters = [];
}
