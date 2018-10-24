/**
 * @enum {string} MERGE_WARNING_TYPE
 */
export const MERGE_WARNING_TYPE = {
        NOT_AVAILABLE : 'notAvailable', // variable is not available in the subflow or parameter is not available in the action or apex plugin
        DATA_TYPE_CHANGED : 'dataTypeChanged',
        ONLY_AVAILABLE_IN_LATEST : 'onlyAvailableInLatest',
        ONLY_AVAILABLE_IN_ACTIVE : 'onlyAvailableInActive',
        DUPLICATE : 'duplicate'
};