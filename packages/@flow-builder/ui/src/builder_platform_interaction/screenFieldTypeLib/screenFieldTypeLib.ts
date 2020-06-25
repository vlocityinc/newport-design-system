import { logPerfTransactionStart, logPerfTransactionEnd } from 'builder_platform_interaction/loggingUtils';
import { SERVER_ACTION_TYPE, fetchOnce } from 'builder_platform_interaction/serverDataLib';

const SCREEN_FIELD_TYPES = 'SCREEN_FIELD_TYPES';

let supportedScreenFieldTypes: Array<string> = [];

/**
 * Sets the names of all screen field types
 */
export function setSupportedScreenFieldTypes(fieldTypes: Array<any>) {
    supportedScreenFieldTypes = fieldTypes.map(fieldType => fieldType.name);
}

/**
 * Return the names of all screen field types
 */
export function getSupportedScreenFieldTypes(): Array<string> {
    return supportedScreenFieldTypes;
}

/**
 * Get the supported screen field types
 */
export function getScreenFieldTypes(flowProcessType: string, flowTriggerType: string): Promise<any> {
    logPerfTransactionStart(SCREEN_FIELD_TYPES, null, null);
    const param = { flowProcessType, flowTriggerType };
    return fetchOnce(SERVER_ACTION_TYPE.GET_SUPPORTED_SCREEN_FIELD_TYPES, param)
        .then(data => {
            logPerfTransactionEnd(
                SCREEN_FIELD_TYPES,
                {
                    numOfScreenFieldTypes: data.length
                },
                null
            );
            setSupportedScreenFieldTypes(data);
            return data;
        })
        .catch((/* error */) => {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        });
}
