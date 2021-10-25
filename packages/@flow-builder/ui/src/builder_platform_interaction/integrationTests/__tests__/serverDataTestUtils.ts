import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { setContext } from 'builder_platform_interaction/contextLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
import { contractFields } from 'serverData/GetFieldsForEntity/contractFields.json';
import { recommendationFields } from 'serverData/GetFieldsForEntity/recommendationFields.json';
import { objectWithAllPossibleFieldsFields } from 'serverData/GetFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { systemVariablesForFlow } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { systemVariablesForAutoLaunchedFlow } from 'serverData/GetSystemVariables/systemVariablesForAutoLaunchedFlow.json';
import { getCarFromApexActionDetails } from 'serverData/GetInvocableActionDetails/getCarFromApexActionDetails.json';
import { submitForApprovalActionDetails } from 'serverData/GetInvocableActionDetails/submitForApprovalActionDetails.json';
import { chatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { invocableActionsForFlow } from 'serverData/GetAllInvocableActionsForType/invocableActionsForFlow.json';
import { invocableActionsForAutoLaunchedFlow } from 'serverData/GetAllInvocableActionsForType/invocableActionsForAutoLaunchedFlow.json';
import { invocableActionsForOrchestrator } from 'serverData/GetAllInvocableActionsForType/invocableActionsForOrchestrator.json';
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
import { supportedFeaturesListForFieldServiceMobileFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForFieldServiceMobileFlow.json';
import { resourceTypesForFlow } from 'serverData/GetResourceTypes/resourceTypesForFlow.json';
import { resourceTypesForAutoLaunchedFlow } from 'serverData/GetResourceTypes/resourceTypesForAutoLaunchedFlow.json';
import { eventTypes } from 'serverData/GetEventTypes/eventTypes.json';
import { flowExtensionListParams } from 'serverData/GetFlowExtensionListParams/flowExtensionListParams.json';
import { flowExtensionsForFlow } from 'serverData/GetFlowExtensions/flowExtensionsForFlow.json';
import { flowExtensionsForContactRequestFlow } from 'serverData/GetFlowExtensions/flowExtensionsForContactRequestFlow.json';
import { flowExtensionsForFieldServiceMobile } from 'serverData/GetFlowExtensions/flowExtensionsForFieldServiceMobile.json';
import { supportedFeaturesListForContactRequestFlow } from 'serverData/GetSupportedFeaturesList/supportedFeaturesListForContactRequestFlow.json';
import { setAuraFetch, setAuraGetCallback } from 'builder_platform_interaction/serverDataLib';
import { mockSubflows } from 'mock/calloutData';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { flowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';
import { flowWithNoActiveVersion } from 'serverData/GetFlowInputOutputVariables/flowWithNoActiveVersion.json';
import { flowWithAllTypesVariables } from 'serverData/GetFlowInputOutputVariables/flowWithAllTypesVariables.json';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { flowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';
import { flowEntries } from 'serverData/GetFlowEntries/flowEntries.json';
import { paletteForFlow } from 'serverData/GetPalette/paletteForFlow.json';
import { paletteForAutoLaunchedFlow } from 'serverData/GetPalette/paletteForAutoLaunchedFlow.json';
import { supportedElementsForFlow } from 'serverData/GetSupportedElements/supportedElementsForFlow.json';
import { supportedElementsForAutoLaunchedFlow } from 'serverData/GetSupportedElements/supportedElementsForAutoLaunchedFlow.json';
import { supportedElementsForRecommendationFlow } from 'serverData/GetSupportedElements/supportedElementsForRecommendationFlow.json';
import { localActionSampleActionDetails } from 'serverData/GetInvocableActionDetails/localActionSampleActionDetails.json';
import { lightningWithApexNoSObjectActionDetails } from 'serverData/GetInvocableActionDetails/lightningWithApexNoSObjectActionDetails.json';
import { lightningWithApexContainsSObjectActionDetails } from 'serverData/GetInvocableActionDetails/lightningWithApexContainsSObjectActionDetails.json';
import { context } from 'serverData/GetContext/context.json';
import { allTypesApexActionDetails } from 'serverData/GetInvocableActionDetails/allTypesApexActionDetails.json';
import { objectManagerUrls } from 'serverData/GetObjectManagerUrls/objectManagerUrls.json';
import { automaticFieldBetaUrls } from 'serverData/GetAutomaticFieldBetaUrls/automaticFieldBetaUrls.json';

const auraFetch = (actions) => async (actionName, shouldExecuteCallback, callback, params) => {
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

export const getSubflows =
    (flowProcessTypeToSubflows) =>
    ({ flowProcessType }) => {
        const subflows = flowProcessTypeToSubflows[flowProcessType] || [];
        return {
            data: subflows
        };
    };

export const getFlowInputOutputVariables =
    (flowNameToFlowInputOutputVariables) =>
    ({ flowName }) => {
        const flowInputOutputVariables = flowNameToFlowInputOutputVariables[flowName];
        if (flowInputOutputVariables != null) {
            return { data: flowInputOutputVariables };
        }
        return { error: 'Unknown flow' };
    };

const getAllInvocableActionsForType =
    (flowProcessTypeToInvocableActions) =>
    ({ flowProcessType }) => {
        const invocableActions = flowProcessTypeToInvocableActions[flowProcessType] || [];
        return {
            data: invocableActions
        };
    };

const getFieldsForEntity =
    (entityApiNameToEntityFields) =>
    ({ entityApiName }) => {
        const fields = entityApiNameToEntityFields[entityApiName];
        if (fields != null) {
            return { data: fields };
        }
        return { error: 'Unknown entity' };
    };

export const getTemplates =
    (allTemplates) =>
    ({ processTypes }) => {
        const matchingTemplates = allTemplates.filter((template) => processTypes.includes(template.ProcessType));
        return { data: matchingTemplates };
    };

const getInvocableActionDetails = (invocableActionParameters) => (params) => {
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

const createGetter = (data) => () => ({ data });

export const createGetterByProcessType =
    (map, defaultValue = []) =>
    ({ flowProcessType }) => ({
        data: map[flowProcessType] || defaultValue
    });

const getFlowExtensionListParams = (flowExtensionListParameters) => (params) => ({
    data: params.names.reduce((obj, name) => {
        obj[name] = flowExtensionListParameters[name];
        return obj;
    }, {})
});

const getFlowExtensionDetails = (flowExtDetails) => (params) => ({
    data: params.names.reduce((obj, name) => {
        obj[name] = flowExtDetails[name];
        return obj;
    }, {})
});

const retrieveFlow =
    (flowIdToFlow) =>
    ({ flowId }) => {
        const flow = flowIdToFlow[flowId];
        if (flow != null) {
            return { data: flow };
        }
        return { error: 'Unknown flow' };
    };

const allAuraActions = {
    'c.retrieveFlow': retrieveFlow({
        '301xx000003GhbnAAC': flowWithAllElements
    }),
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
        [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: supportedFeaturesListForContactRequestFlow,
        [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE]: supportedFeaturesListForFieldServiceMobileFlow
    }),
    'c.getFieldsForEntity': getFieldsForEntity({
        Account: accountFields,
        User: userFields,
        FeedItem: feedItemFields,
        Contract: contractFields,
        Object_with_all_possible_fields__c: objectWithAllPossibleFieldsFields,
        Recommendation: recommendationFields
    }),
    'c.getAllInvocableActionsForType': getAllInvocableActionsForType({
        [FLOW_PROCESS_TYPE.FLOW]: invocableActionsForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: invocableActionsForAutoLaunchedFlow,
        [FLOW_PROCESS_TYPE.ORCHESTRATOR]: invocableActionsForOrchestrator
    }),
    'c.getInvocableActionDetails': getInvocableActionDetails({
        apex: {
            GetCarAction: getCarFromApexActionDetails,
            generateDraftAccount: getAccountFromApexActionDetails,
            GetAccount: getAccountFromApexAnonymousOutputActionDetails,
            InvocableGetAccountName: getAccountNameFromApexAnonymousOutputActionDetails,
            GetAccountName: getStringFromApexActionDetails,
            GetAccounts: getAccountsFromApexAnonymousOutputActionDetails,
            InvocableGetAccountsNames: getAccountsNamesFromApexAnonymousOutputActionDetails,
            ApexTypeCollectionAction: getCarsFromApexActionDetails,
            AllTypesApexAction: allTypesApexActionDetails
        },
        'submit-submit': submitForApprovalActionDetails,
        'chatterPost-chatterPost': chatterPostActionDetails,
        'quickAction-Case.LogACall': logACallActionDetails,
        component: {
            'c:localActionSample': localActionSampleActionDetails,
            'c:LightningComponentWithApexNoSObject': lightningWithApexNoSObjectActionDetails,
            'c:LightningWithApexContainsSObject': lightningWithApexContainsSObjectActionDetails
        }
    }),
    'c.getFlowExtensionListParams': getFlowExtensionListParams(flowExtensionListParams),
    'c.getFlowExtensionDetails': getFlowExtensionDetails(flowExtensionDetails),
    'c.getFlowExtensions': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: flowExtensionsForFlow,
        [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW]: flowExtensionsForContactRequestFlow,
        [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE]: flowExtensionsForFieldServiceMobile
    }),
    'c.getApexPlugins': createGetter([]),
    'c.getApexTypes': createGetter(apexTypesForFlow),
    'c.getSubflows': getSubflows({
        [FLOW_PROCESS_TYPE.FLOW]: mockSubflows
    }),
    'c.getFlowInputOutputVariables': getFlowInputOutputVariables({
        flowWithAllTypesVariables,
        mynamespace__subflow: flowWithAllTypesVariables,
        flowWithActiveAndLatest,
        flowWithNoActiveVersion
    }),
    'c.retrieveHeaderUrls': createGetter([]),
    'c.getProcessTypes': createGetter([]),
    'c.getRunInModes': createGetter([]),
    'c.getFlowEntries': createGetter(flowEntries),
    'c.getPalette': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: paletteForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: paletteForAutoLaunchedFlow
    }),
    'c.getSupportedElements': createGetterByProcessType({
        [FLOW_PROCESS_TYPE.FLOW]: supportedElementsForFlow,
        [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW]: supportedElementsForAutoLaunchedFlow,
        [FLOW_PROCESS_TYPE.RECOMMENDATION_STRATEGY]: supportedElementsForRecommendationFlow
    }),
    'c.getTriggerTypeInfo': createGetter([]),
    'c.getObjectManagerUrls': createGetter(objectManagerUrls),
    'c.getAutomaticFieldBetaUrls': createGetter(automaticFieldBetaUrls),
    'c.getContext': createGetter(context)
};

/**
 * @param actions
 */
export function initializeAuraFetch(actions = {}) {
    setAuraFetch(
        auraFetch({
            ...allAuraActions,
            ...actions
        })
    );
    setAuraGetCallback((callback) => callback);
}

/**
 * @param contextOptions
 * @param contextOptions.devMode
 */
export function initializeContext({ devMode = false } = {}) {
    const modifiedContext = { ...context, devMode };
    setContext(modifiedContext);
}
