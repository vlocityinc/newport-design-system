import { orgHasFlowScreenSections } from 'builder_platform_interaction/contextLib';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { getSectionFieldType } from 'builder_platform_interaction/screenEditorUtils';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { Store } from 'builder_platform_interaction/storeLib';

const SCREEN_FIELD_TYPES = 'SCREEN_FIELD_TYPES';
const { logPerfTransactionStart, logPerfTransactionEnd } = loggingUtils;

/**
 * Get the supported screen field types
 *
 * @param flowProcessType - Flow Process Type
 * @param flowTriggerType - Flow Trigger Type
 * @param flowEnvironments - Selected Flow Environments
 * @returns Promise object represents the return value from the server
 *         side action
 */
export function getSupportedScreenFieldTypes(
    flowProcessType: string,
    flowTriggerType?: string,
    flowEnvironments?: string[]
): Promise<any> {
    logPerfTransactionStart(SCREEN_FIELD_TYPES, null, null);
    // Flow environments is an array so the array is sorted then the values are concatenate and used as cache key
    const sortedEnv = flowEnvironments?.sort((a, b) => a.localeCompare(b));
    const param = { flowProcessType, flowTriggerType, flowEnvironments, flowEnvironmentKey: sortedEnv?.join() };
    return fetchOnce(SERVER_ACTION_TYPE.GET_SUPPORTED_SCREEN_FIELD_TYPES, param)
        .then((data) => {
            const { properties, canvasElements, connectors } = Store.getStore().getCurrentState();
            logPerfTransactionEnd(
                SCREEN_FIELD_TYPES,
                {
                    numOfScreenFieldTypes: data.length,
                    flowId: properties.definitionId,
                    processType: flowProcessType,
                    triggerType: flowTriggerType,
                    numOfNodes: Object.values(canvasElements).length,
                    numOfConnectors: Object.values(connectors).length
                },
                null
            );

            if (orgHasFlowScreenSections()) {
                return data;
            }

            // if flowSectionsAndColumns perm is off, remove section from supported screen field types
            // so that it will not show up in the screen left palette
            const sectionFieldType = getSectionFieldType().fieldType;
            return data.filter((type) => type.name !== sectionFieldType);
        })
        .catch((/* error */) => {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        });
}

/**
 * Determine whether automatic fields are supported
 *
 * @param supportedScreenFieldTypes List of supported screen field types for the current flow
 * @returns Whether automatic fields are supported or not
 */
export function isAutomaticFieldsSupported(supportedScreenFieldTypes): boolean {
    return supportedScreenFieldTypes?.some(
        (supportedType) => supportedType.name === FlowScreenFieldType.ObjectProvided
    );
}
