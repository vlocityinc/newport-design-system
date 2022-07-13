// @ts-nocheck
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { ParameterListRowItem } from 'builder_platform_interaction/elementFactory';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

let cachedDetails = [];
let standardInvocableActions = [];
let dynamicInvocableActions = [];

export type InvocableAction = {
    elementType: ELEMENT_TYPE;
    actionType: string | ValueWithError;
    actionName: string | ValueWithError;
    inputParameters: ParameterListRowItem[];
    outputParameters: ParameterListRowItem[];
    displayText?: string | ValueWithError;
    name?: string | ValueWithError;
    label?: string | ValueWithError;
};
/**
 * Set standard invocable actions.
 *
 * @param actions - The standard actions to set
 */
export function setStandardInvocableActions(actions) {
    standardInvocableActions = actions;
}

/**
 * Set dynamic invocable actions.
 *
 * @param actions - The dynamic actions to set
 */
export function setDynamicInvocableActions(actions) {
    dynamicInvocableActions = actions;
}

/**
 * @returns standard invocable actions
 */
export function getStandardInvocableActions() {
    return standardInvocableActions;
}

/**
 * @returns dynamic invocable actions
 */
export function getDynamicInvocableActions() {
    return dynamicInvocableActions;
}

/**
 * @returns invocable actions
 */
export function getInvocableActions(): InvocableAction[] {
    return standardInvocableActions.concat(dynamicInvocableActions);
}

/**
 * @returns invocable actions and corresponding custom icon resource
 */
export function getActionIconMap() {
    return standardInvocableActions
        .concat(dynamicInvocableActions)
        .filter((action) => action.iconName)
        .reduce((acc, action) => {
            acc[action.name] = action.iconName;
            return acc;
        }, {});
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
    const key = getActionKey(actionName, actionType);

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
 * Get the key for an action
 *
 * @param actionName - The action name
 * @param actionType - The action type
 * @returns  the action key, or undefined if not a valid action
 */
export function getActionKey(actionName?: string, actionType?: string): string | undefined {
    if (actionName == null || actionType == null) {
        return undefined;
    }

    return `${actionName}-${actionType}`;
}

/**
 * Updates a data type and sets a subtype in generically-typed extension parameters
 *
 * @param {*} parameters - Screen field parameters
 * @param {*} dynamicTypeMappings - A mapping of generic types to concrete types
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
    const key = getActionKey(actionName, actionType);
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
