// @ts-nocheck
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

let cachedDetails = [];
let invocableActions = [];

export type InvocableAction = {
    elementType: ELEMENT_TYPE;
    actionType: string | ValueWithError;
    actionName: string | ValueWithError;
};

export function setInvocableActions(actions) {
    invocableActions = actions;
}

export function getInvocableActions() {
    return invocableActions;
}

export function fetchDetailsForInvocableAction(
    { actionName, actionType },
    { background = false, disableErrorModal = false, messageForErrorModal = undefined } = {}
) {
    const key = `${actionName}-${actionType}`;
    if (cachedDetails[key]) {
        return Promise.resolve(cachedDetails[key]);
    }
    const params = { actionName, actionType };
    return fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_DETAILS, params, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then((details) => {
        cachedDetails[key] = details;
        return details;
    });
}

/**
 * Updates a data type and sets a subtype in generically-typed extension parameters
 * @param {*} parameters - Screen field parameters
 * @param {*} dynamicTypeMappings - A mapping of generic types to concrete types
 * @param {*} genericTypes  - Generic types
 */
export function applyDynamicTypeMappings(parameters, dynamicTypeMappings) {
    if (!dynamicTypeMappings || dynamicTypeMappings.length === 0) {
        return parameters;
    }

    return parameters
        .map((parameter) => ({
            parameter,
            dynamicTypeMapping: dynamicTypeMappings.find(
                (dynamicTypeMapping) => parameter.sobjectType === getValueFromHydratedItem(dynamicTypeMapping.typeName)
            )
        }))
        .map(({ parameter, dynamicTypeMapping }) => {
            if (dynamicTypeMapping && dynamicTypeMapping.typeValue) {
                parameter = Object.assign({}, parameter, {
                    sobjectType: getValueFromHydratedItem(dynamicTypeMapping.typeValue)
                });
            }
            return parameter;
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
export function getParametersForInvocableAction({ actionName, actionType, dataTypeMappings }) {
    const key = `${actionName}-${actionType}`;
    const params = cachedDetails[key] && cachedDetails[key].parameters;
    return applyDynamicTypeMappings(params, dataTypeMappings);
}

export function isAutomaticOutputHandlingSupported(flowProcessType) {
    const processTypeAutomaticOutPutHandlingSupport = getProcessTypeAutomaticOutPutHandlingSupport(flowProcessType);
    return processTypeAutomaticOutPutHandlingSupport === FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED;
}

export function clearInvocableActionCachedParameters() {
    cachedDetails = [];
}
