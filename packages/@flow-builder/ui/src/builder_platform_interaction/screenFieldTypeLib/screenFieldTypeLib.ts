import { orgHasFlowScreenSections } from 'builder_platform_interaction/contextLib';
import { getSectionFieldType } from 'builder_platform_interaction/screenEditorUtils';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';

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
            logPerfTransactionEnd(
                SCREEN_FIELD_TYPES,
                {
                    numOfScreenFieldTypes: data.length
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
