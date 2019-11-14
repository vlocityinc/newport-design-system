import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { feedItemFields } from 'serverData/GetFieldsForEntity/feedItemFields.json';
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

export const auraFetch = actions => async (
    actionName,
    shouldExecuteCallback,
    callback,
    params
) => {
    await ticks(10);
    if (!shouldExecuteCallback()) {
        return undefined;
    }
    let result;
    if (actions[actionName]) {
        result = actions[actionName](params);
    } else {
        result = { error: 'Unknown actionName' };
    }
    callback(result);
    return undefined;
};

export const getSubflows = flowProcessTypeToSubflows => ({
    flowProcessType
}) => {
    const subflows = flowProcessTypeToSubflows[flowProcessType];
    return {
        data: subflows != null ? subflows : []
    };
};

export const getFlowInputOutputVariables = flowNameToFlowInputOutputVariables => ({
    flowName
}) => {
    const flowInputOutputVariables =
        flowNameToFlowInputOutputVariables[flowName];
    if (flowInputOutputVariables != null) {
        return { data: flowInputOutputVariables };
    }
    return { error: 'Unknown flow' };
};

export const getAllInvocableActionsForType = flowProcessTypeToInvocableActions => ({
    flowProcessType
}) => {
    const invocableActions = flowProcessTypeToInvocableActions[flowProcessType];
    return {
        data: invocableActions != null ? invocableActions : []
    };
};

export const getFieldsForEntity = entityApiNameToEntityFields => ({
    entityApiName
}) => {
    const fields = entityApiNameToEntityFields[entityApiName];
    if (fields != null) {
        return { data: fields };
    }
    return { error: 'Unknown entity' };
};

export const getTemplates = allTemplates => ({ processTypes }) => {
    const matchingTemplates = allTemplates.filter(template =>
        processTypes.includes(template.ProcessType)
    );
    return { data: matchingTemplates };
};

export const getFlowExtensions = flowProcessTypeToExtensions => ({
    flowProcessType
}) => {
    const extensions = flowProcessTypeToExtensions[flowProcessType];
    return {
        data: extensions != null ? extensions : []
    };
};

export const getInvocableActionDetails = invocableActionParameters => params => {
    let invocableActionParametersForAction;
    const invocableActionParametersForType =
        invocableActionParameters[params.actionType];
    if (invocableActionParametersForType) {
        invocableActionParametersForAction =
            invocableActionParametersForType[params.actionName];
    } else {
        invocableActionParametersForAction =
            invocableActionParameters[
                params.actionType + '-' + params.actionName
            ];
    }
    return invocableActionParametersForAction
        ? { data: invocableActionParametersForAction }
        : { error: 'Cannot find invocable action parameters' };
};

export const getAllAuraActions = processType => ({
    'c.getSystemVariables':
        processType === FLOW_PROCESS_TYPE.FLOW
            ? systemVariablesForFlow
            : systemVariablesForAutoLaunchedFlow,
    'c.getFieldsForEntity': getFieldsForEntity({
        Account: accountFields,
        User: userFields,
        FeedItem: feedItemFields
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
    })
});
