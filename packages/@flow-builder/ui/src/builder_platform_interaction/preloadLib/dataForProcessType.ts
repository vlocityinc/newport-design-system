// @ts-nocheck
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { $LABEL, setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import {
    getFlowSystemVariableComboboxItem,
    getGlobalVariableTypeComboboxItems
} from 'builder_platform_interaction/expressionUtils';
import { getAllCachedExtensionTypes, setFlowExtensions } from 'builder_platform_interaction/flowExtensionLib';
import { setInvocableActions } from 'builder_platform_interaction/invocableActionLib';
import { setOperators, setRules } from 'builder_platform_interaction/ruleLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import {
    RUNTIME,
    setEntities,
    setEventTypes,
    setWorkflowEnabledEntities
} from 'builder_platform_interaction/sobjectLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { setSubflows } from 'builder_platform_interaction/subflowsLib';
import {
    addLabelVariables,
    cacheVersioningDataForAllProcessTypes,
    getBuilderType,
    initVersioningInfoForProcessType,
    setGlobalVariables,
    setProcessTypeFeature,
    setSystemVariables,
    setVersioningDataInitialized
} from 'builder_platform_interaction/systemLib';

export const loadActions = (flowProcessType, flowTriggerType) =>
    fetchOnce(
        SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS,
        { flowProcessType, flowTriggerType },
        { background: true }
    ).then(setInvocableActions);

export const loadApexPlugins = () => fetchOnce(SERVER_ACTION_TYPE.GET_APEX_PLUGINS, {}, { background: true });

export const loadSubflows = (flowProcessType, flowDefinitionId) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_SUBFLOWS, { flowProcessType, flowDefinitionId }, { background: true }).then(
        setSubflows
    );

export const loadRules = (flowProcessType, flowTriggerType, recordTriggerType) =>
    fetchOnce(
        SERVER_ACTION_TYPE.GET_RULES,
        { flowProcessType, flowTriggerType, recordTriggerType },
        { disableErrorModal: true }
    ).then(setRules);

export const loadOperators = (flowProcessType, flowTriggerType, recordTriggerType) =>
    fetchOnce(
        SERVER_ACTION_TYPE.GET_OPERATORS,
        { flowProcessType, flowTriggerType, recordTriggerType },
        { disableErrorModal: true }
    ).then(setOperators);

export const loadEventTypes = () =>
    fetchOnce(SERVER_ACTION_TYPE.GET_EVENT_TYPES, { eventType: RUNTIME }, { disableErrorModal: true }).then((data) => {
        setEventTypes(data, RUNTIME);
    });

export const loadEventType = (type, apiName) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_EVENT_TYPE, { eventTypeApiName: apiName }, { disableErrorModal: true })
        .then((data) => {
            setEventTypes([data], type);
        })
        .catch(() => {
            setEventTypes([], type);
        });

export const loadEntities = (crudType) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_ENTITIES, { crudType }, { disableErrorModal: true }).then(setEntities);

export const loadEntity = (entityApiName) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_ENTITY, { entityApiName }, { disableErrorModal: true })
        .then((data) => {
            setEntities([data]);
        })
        .catch(() => {
            setEntities([]);
        });

export const loadWorkflowEnabledEntities = () =>
    fetchOnce(SERVER_ACTION_TYPE.GET_WORKFLOW_ENABLED_ENTITIES, {}, { disableErrorModal: true }).then(
        setWorkflowEnabledEntities
    );

export const loadResourceTypes = (flowProcessType) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_RESOURCE_TYPES, { flowProcessType }, { disableErrorModal: true }).then(
        setResourceTypes
    );

let globalVariablesPromise;

export const loadGlobalVariables = (flowProcessType): Promise<any> => {
    // exclude the labels only if we are sure we don't have any $Label references
    const excludeLabels = !JSON.stringify(Store.getStore().getCurrentState()).includes($LABEL);

    const actionType = excludeLabels
        ? SERVER_ACTION_TYPE.GET_ALL_GLOBAL_VARIABLES_EXCLUDE_LABELS
        : SERVER_ACTION_TYPE.GET_ALL_GLOBAL_VARIABLES;

    globalVariablesPromise = fetchOnce(actionType, { flowProcessType }, { disableErrorModal: true }).then((data) => {
        setGlobalVariables(data);
        getGlobalVariableTypeComboboxItems().forEach((item) => addToParentElementCache(item.displayText, item));
    });

    // loads the global variable labels asynchronously
    if (excludeLabels) {
        loadGlobalLabelVariables(flowProcessType);
    }
    return globalVariablesPromise;
};

/**
 * Loads the global variable labels
 *
 * @param flowProcessType - The process type
 * @returns A promise that is resolved when the load is complete
 */
const loadGlobalLabelVariables = (flowProcessType): Promise<void> => {
    const labelsOnlyPromise = fetchOnce(
        SERVER_ACTION_TYPE.GET_ALL_GLOBAL_VARIABLES_ONLY_LABELS,
        { flowProcessType },
        { disableErrorModal: true, background: true }
    );

    return globalVariablesPromise
        .then(() => labelsOnlyPromise)
        .then((data) => {
            const labels = data.globalVariables;
            if (labels?.length > 0) {
                addLabelVariables(data);
            }
        });
};

export const loadSystemVariables = (flowProcessType) =>
    fetchOnce(
        SERVER_ACTION_TYPE.GET_SYSTEM_VARIABLES,
        {
            flowProcessType
        },
        { disableErrorModal: true }
    ).then((data) => {
        const item = getFlowSystemVariableComboboxItem();
        // system variables are treated like sobjects in the menu data so this category is a "parent element" as well
        addToParentElementCache(item.displayText, item);
        setSystemVariables(data);
    });

export const loadProcessTypeFeatures = (flowProcessType) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPE_FEATURES, {
        flowProcessType
    }).then((data) => {
        setProcessTypeFeature(flowProcessType, data);
    });

export const loadPalette = (flowProcessType, flowTriggerType) =>
    fetchOnce(SERVER_ACTION_TYPE.GET_PALETTE, {
        flowProcessType,
        flowTriggerType
    });

export const loadVersioningData = () =>
    fetchOnce(SERVER_ACTION_TYPE.GET_VERSIONING_INFO, { builderType: getBuilderType() }, { background: true })
        .then((data) => {
            if (data) {
                cacheVersioningDataForAllProcessTypes(data);
                initVersioningInfoForProcessType(getProcessType());
            }
            setVersioningDataInitialized(true);
        })
        .catch(() => {
            setVersioningDataInitialized(true);
        });

export const loadFlowExtensions = (flowProcessType, flowEnvironments) => {
    // Flow environments is an array so the array is sorted then the values are concatenate and used as cache key
    const sortedEnv = flowEnvironments?.sort((a, b) => a.localeCompare(b));
    return fetchOnce(
        SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS,
        { flowProcessType, flowEnvironments, flowEnvironmentKey: sortedEnv?.join() },
        { background: true }
    ).then((data) => {
        setFlowExtensions(data);
        return getAllCachedExtensionTypes();
    });
};
