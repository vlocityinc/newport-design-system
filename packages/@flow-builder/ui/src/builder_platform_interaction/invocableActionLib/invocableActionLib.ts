// @ts-nocheck
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { ParameterListRowItem } from 'builder_platform_interaction/elementFactory';

let cachedDetails = [];
let invocableActions = [];

export type InvocableAction = {
    elementType: ELEMENT_TYPE;
    actionType: string | ValueWithError;
    actionName: string | ValueWithError;
    inputParameters: ParameterListRowItem[];
    outputParameters: ParameterListRowItem[];
    displayText?: string | ValueWithError;
};

/**
 * @param actions
 */
export function setInvocableActions(actions) {
    invocableActions = actions;
}

/**
 *
 */
export function getInvocableActions() {
    return invocableActions;
}

/**
 * @param root0
 * @param root0.actionName
 * @param root0.actionType
 * @param root1
 * @param root1.background
 * @param root1.disableErrorModal
 * @param root1.messageForErrorModal
 */
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
 *
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
 * @param actionId.dataTypeMappings
 * @returns {Object} the action parameters
 */
export function getParametersForInvocableAction({ actionName, actionType, dataTypeMappings }) {
    const key = `${actionName}-${actionType}`;
    const params = cachedDetails[key] && cachedDetails[key].parameters;
    return applyDynamicTypeMappings(params, dataTypeMappings);
}

/**
 * @param flowProcessType
 */
export function isAutomaticOutputHandlingSupported(flowProcessType) {
    const processTypeAutomaticOutPutHandlingSupport = getProcessTypeAutomaticOutPutHandlingSupport(flowProcessType);
    return processTypeAutomaticOutPutHandlingSupport === FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED;
}

/**
 *
 */
export function clearInvocableActionCachedParameters() {
    cachedDetails = [];
}
