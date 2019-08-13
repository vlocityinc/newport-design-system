import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import { getFlowDataType } from 'builder_platform_interaction/dataTypeLib';

const cachedParameters = [];
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

/**
 * Get the invocable action parameter description as a complex type field description
 *
 * @param {object} invocableActionParamDescription - the invocable action parameter description as returned by getParametersForInvocableAction
 * @returns {object} - the invocable action parameter description as a complex type field description (as expected by menudata or merge field validation)
 */
export function getInvocableActionParamDescriptionAsComplexTypeFieldDescription(
    invocableActionParamDescription
) {
    return {
        ...invocableActionParamDescription,
        apiName: invocableActionParamDescription.name,
        dataType: getFlowDataType(invocableActionParamDescription.dataType),
        isCollection: invocableActionParamDescription.maxOccurs > 1
    };
}
