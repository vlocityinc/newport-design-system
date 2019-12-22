import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { contractFields } from 'serverData/GetFieldsForEntity/contractFields.json';
import { systemVariablesForFlow } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { systemVariablesForAutoLaunchedFlow } from 'serverData/GetSystemVariables/systemVariablesForAutoLaunchedFlow.json';
import { getCarFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getCarFromApexActionDetails.json';
import { submitForApprovalActionDetails } from 'serverData/GetInvocableActionDetails/submitForApprovalActionDetails.json';
import { chatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { invocableActionsForFlow } from 'serverData/GetAllInvocableActionsForType/invocableActionsForFlow.json';
import { invocableActionsForAutoLaunchedFlow } from 'serverData/GetAllInvocableActionsForType/invocableActionsForAutoLaunchedFlow.json';
import { getAccountFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getAccountFromApexActionDetails.json';
import { logACallActionDetails } from 'serverData/GetInvocableActionDetails/logACallActionDetails.json';
import { getAccountFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountFromApexAnonymousOutputActionDetails.json';
import { getAccountNameFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountNameFromApexAnonymousOutputActionDetails.json';
import { getStringFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getStringFromApexActionDetails.json';
import { getAccountsFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountsFromApexAnonymousOutputActionDetails.json';
import { getAccountsNamesFromApexAnonymousOutputActionDetails } from 'serverData/GetInvocableActionDetails/getAccountsNamesFromApexAnonymousOutputActionDetails.json';
import { getCarsFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getCarsFromApexActionDetails.json';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { globalVariablesForAutoLaunchedFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForAutoLaunchedFlow.json';
import { allEntities } from 'serverData/GetEntities/allEntities.json';
import { operators } from 'serverData/GetOperators/operators.json';
import { supportedFeaturesListForFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForFlow.json';
import { supportedFeaturesListForAutoLaunchedFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForAutoLaunchedFlow.json';
import { resourceTypesForFlow } from 'serverData/GetResourceTypes/resourceTypesForFlow.json';
import { resourceTypesForAutoLaunchedFlow } from 'serverData/GetResourceTypes/resourceTypesForAutoLaunchedFlow.json';
import { eventTypes } from 'serverData/GetEventTypes/eventTypes.json';
import { flowExtensionListParams } from 'serverData/GetFlowExtensionListParams/flowExtensionListParams.json';
import { flowExtensionsForFlow } from 'serverData/GetFlowExtensions/flowExtensionsForFlow.json';
import { flowExtensionsForContactRequestFlow } from 'serverData/GetFlowExtensions/flowExtensionsForContactRequestFlow.json';
import { supportedFeaturesListForContactRequestFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForContactRequestFlow.json';
import { setAuraFetch, setAuraGetCallback } from 'builder_platform_interaction/serverDataLib';

const auraFetch = actions => async (actionName, shouldExecuteCallback, callback, params) => {
    await ticks(10);
    if (!shouldExecuteCallback()) {
        return;
    }
    let result;
    if (actions[actionName]) {
        result = actions[actionName](params);
    } else {
        result = { error: `Unknown actionName ${actionName}` };
    }
    callback(result);
};

export const getSubflows = flowProcessTypeToSubflows => ({ flowProcessType }) => {
    const subflows = flowProcessTypeToSubflows[flowProcessType] || [];
    return {
        data: subflows
    };
};

export const getFlowInputOutputVariables = flowNameToFlowInputOutputVariables => ({ flowName }) => {
    const flowInputOutputVariables = flowNameToFlowInputOutputVariables[flowName];
    if (flowInputOutputVariables != null) {
        return { data: flowInputOutputVariables };
    }
    return { error: 'Unknown flow' };
};

export const getAllInvocableActionsForType = flowProcessTypeToInvocableActions => ({ flowProcessType }) => {
    const invocableActions = flowProcessTypeToInvocableActions[flowProcessType] || [];
    return {
        data: invocableActions
    };
};

const getFieldsForEntity = entityApiNameToEntityFields => ({ entityApiName }) => {
    const fields = entityApiNameToEntityFields[entityApiName];
    if (fields != null) {
        return { data: fields };
    }
    return { error: 'Unknown entity' };
};

export const getTemplates = allTemplates => ({ processTypes }) => {
    const matchingTemplates = allTemplates.filter(template => processTypes.includes(template.ProcessType));
    return { data: matchingTemplates };
};

export const getInvocableActionDetails = invocableActionParameters => params => {
    let invocableActionParametersForAction;
    const invocableActionParametersForType = invocableActionParameters[params.actionType];
    if (invocableActionParametersForType) {
        invocableActionParametersForAction = invocableActionParametersForType[params.actionName];
    } else {
        invocableActionParametersForAction = invocableActionParameters[params.actionType + '-' + params.actionName];
    }
    return invocableActionParametersForAction
        ? { data: invocableActionParametersForAction }
        : { error: 'Cannot find invocable action parameters' };
};

const createGetter = data => () => ({ data });

export const createGetterByProcessType = (map, defaultValue = []) => ({ flowProcessType }) => ({
    data: map[flowProcessType] || defaultValue
});

const getFlowExtensionListParams = flowExtensionListParameters => params => ({
    data: params.names.reduce((obj, name) => {
        obj[name] = flowExtensionListParameters[name];
        return obj;
    }, {})
});

const allAuraActions = {
    'c.retrieveAllRules': createGetter(rules),
    'c.getOperators': createGetter(operators),
    'c.getEventTypes': createGetter(eventTypes),
    'c.getEntities': createGetter(allEntities),
    'c.getResourceTypes': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: resourceTypesForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: resourceTypesForAutoLaunchedFlow
    }),
    'c.getSystemVariables': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: systemVariablesForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: systemVariablesForAutoLaunchedFlow
    }),
    'c.getAllGlobalVariables': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: globalVariablesForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: globalVariablesForAutoLaunchedFlow
    }),
    'c.getSupportedFeaturesList': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: supportedFeaturesListForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: supportedFeaturesListForAutoLaunchedFlow,
        [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: supportedFeaturesListForContactRequestFlow
    }),
    'c.getFieldsForEntity': getFieldsForEntity({
        Account: accountFields,
        User: userFields,
        FeedItem: feedItemFields,
        Contract: contractFields
    }),
    'c.getAllInvocableActionsForType': getAllInvocableActionsForType({
        [FLOW_PROCESS_TYPE.FLOW]: invocableActionsForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: invocableActionsForAutoLaunchedFlow
    }),
    'c.getInvocableActionDetails': getInvocableActionDetails({
        apex: {
            GetCarAction: getCarFromApexActionDetails,
            generateDraftAccount: getAccountFromApexActionDetails,
            getAccounts: getAccountFromApexAnonymousOutputActionDetails,
            InvocableGetAccountName: getAccountNameFromApexAnonymousOutputActionDetails,
            GetAccountName: getStringFromApexActionDetails,
            GetAccounts: getAccountsFromApexAnonymousOutputActionDetails,
            InvocableGetAccountsNames: getAccountsNamesFromApexAnonymousOutputActionDetails,
            ApexTypeCollectionAction: getCarsFromApexActionDetails
        },
        'submit-submit': submitForApprovalActionDetails,
        'chatterPost-chatterPost': chatterPostActionDetails,
        'quickAction-Case.LogACall': logACallActionDetails
    }),
    'c.getFlowExtensionListParams': getFlowExtensionListParams(flowExtensionListParams),
    'c.getFlowExtensions': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: flowExtensionsForFlow,
        [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: flowExtensionsForContactRequestFlow
    }),
    'c.getApexPlugins': createGetter([]),
    'c.getSubflows': createGetter([]),
    'c.getApexTypes': createGetter([]),
    'c.getBuilderConfigs': createGetter({})
};

export function initializeAuraFetch(actions = {}) {
    setAuraFetch(
        auraFetch({
            ...allAuraActions,
            ...actions
        })
    );
    setAuraGetCallback(callback => callback);
}
