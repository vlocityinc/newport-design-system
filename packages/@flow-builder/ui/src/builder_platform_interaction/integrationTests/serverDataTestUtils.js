import { ticks } from 'builder_platform_interaction/builderTestUtils';

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
    }
    return invocableActionParametersForAction
        ? { data: invocableActionParametersForAction }
        : { error: 'Cannot find invocable action parameters' };
};
