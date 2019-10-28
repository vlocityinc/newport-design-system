import {
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import { setProcessTypeFeature } from 'builder_platform_interaction/systemLib';
import {
    logPerfTransactionEnd,
    logPerfTransactionStart
} from 'builder_platform_interaction/loggingUtils';
import { setInvocableActions } from 'builder_platform_interaction/invocableActionLib';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import {
    setEntities,
    setEventTypes
} from 'builder_platform_interaction/sobjectLib';
import {
    setGlobalVariables,
    setSystemVariables,
    setSupportedFeatures
} from 'builder_platform_interaction/systemLib';

/**
 * Preload data that is needed before a property editor can be opened (features, peripheral data).
 * It also prefetches actions, apex plugins and subflows for performance reasons but we don't need them to be loaded before we can open a Property Editor
 *
 * @param {string} processType the processType for the current flow
 * @param {Object} options
 * @param {Function} options.onFeaturesLoaded called when process type features have been loaded
 * @param {Function} onPeripheralDataLoaded called when peripheral data have been loaded
 * @param {Function} onActionsLoaded called when actions have been loaded
 * @param {Function} onApexPluginsLoaded called when apex plugins have been loaded
 * @param {Function} onSubflowsLoaded called when subflows have been loaded
 * @returns {Promise} resolved when all needed data has been loaded
 */
export function loadDataForProcessType(
    processType,
    {
        onFeaturesLoaded,
        onPeripheralDataLoaded,
        onActionsLoaded,
        onApexPluginsLoaded,
        onSubflowsLoaded
    } = {}
) {
    const promises = [];
    promises.push(loadProcessTypeFeatures(processType, onFeaturesLoaded));
    promises.push(loadPeripheralData(processType, onPeripheralDataLoaded));
    // currently, we prefetch actions, apex plugins and subflows for performance reasons but we don't need them to be loaded
    // before we can open a Property Editor
    loadActions(processType, onActionsLoaded);
    loadApexPlugins(onApexPluginsLoaded);
    loadSubflows(processType, onSubflowsLoaded);
    return Promise.all(promises);
}

function loadProcessTypeFeatures(processType, onFeaturesLoaded) {
    return fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPE_FEATURES, {
        flowProcessType: processType
    })
        .then(data => {
            setProcessTypeFeature(processType, data);
            if (onFeaturesLoaded) {
                onFeaturesLoaded({ data });
            }
        })
        .catch(error => {
            if (onFeaturesLoaded) {
                onFeaturesLoaded({ error });
            }
        });
}

export const setPeripheralDataForPropertyEditor = ({
    rules,
    operators,
    resourceTypes,
    eventTypes,
    globalVariables,
    systemVariables,
    entities,
    supportedFeatures
}) => {
    setRules(rules);
    setOperators(operators);
    setResourceTypes(resourceTypes);
    setEventTypes(eventTypes);
    setGlobalVariables(globalVariables);
    setSystemVariables(systemVariables);
    setEntities(entities);

    const supportedFeaturesSet = (supportedFeatures || []).reduce(
        (acc, feature) => acc.add(feature),
        new Set()
    );

    setSupportedFeatures(supportedFeaturesSet);
};

function loadPeripheralData(processType, onPeripheralDataLoaded) {
    logPerfTransactionStart(
        SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
    );
    return fetchOnce(
        SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR,
        {
            crudType: 'ALL',
            flowProcessType: processType
        },
        { background: true }
    )
        .then(data => {
            logPerfTransactionEnd(
                SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
            );
            setPeripheralDataForPropertyEditor(data);
            if (onPeripheralDataLoaded) {
                onPeripheralDataLoaded({ data });
            }
        })
        .catch(error => {
            if (onPeripheralDataLoaded) {
                onPeripheralDataLoaded({ error });
            }
        });
}

function loadActions(processType, onActionsLoaded) {
    return fetchOnce(
        SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS,
        {
            flowProcessType: processType
        },
        { background: true }
    )
        .then(data => {
            setInvocableActions(data);
            if (onActionsLoaded) {
                onActionsLoaded({ data });
            }
        })
        .catch(error => {
            if (onActionsLoaded) {
                onActionsLoaded({ error });
            }
        });
}

function loadApexPlugins(onApexPluginsLoaded) {
    return fetchOnce(
        SERVER_ACTION_TYPE.GET_APEX_PLUGINS,
        {},
        { background: true }
    )
        .then(data => {
            if (onApexPluginsLoaded) {
                onApexPluginsLoaded({ data });
            }
        })
        .catch(error => {
            if (onApexPluginsLoaded) {
                onApexPluginsLoaded({ error });
            }
        });
}

function loadSubflows(processType, onSubflowsLoaded) {
    return fetchOnce(
        SERVER_ACTION_TYPE.GET_SUBFLOWS,
        {
            flowProcessType: processType
        },
        { background: true }
    )
        .then(data => {
            if (onSubflowsLoaded) {
                onSubflowsLoaded({ data });
            }
        })
        .catch(error => {
            if (onSubflowsLoaded) {
                onSubflowsLoaded({ error });
            }
        });
}
