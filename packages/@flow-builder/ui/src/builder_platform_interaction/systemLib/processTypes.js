import {
    FLOW_PROCESS_TYPE,
    FLOW_SUPPORTED_FEATURES
} from 'builder_platform_interaction/flowMetadata';

let processTypes;
// TODO: Determine whether configurable start is supported through a service W-6356800
const processTypesFeatures = new Map([
    [
        FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW,
        [FLOW_SUPPORTED_FEATURES.CONFIGURABLE_START]
    ]
]);

/**
 * Sets the process types. This should be done during app initialization.
 *
 * @param {Object}
 *            data the data returned by the service
 */
export const setProcessTypes = data => {
    const parsedTypes = JSON.parse(data.processTypes);
    if (Array.isArray(parsedTypes)) {
        processTypes = parsedTypes;
    }
};

/**
 * Gets all available process types.
 *
 * @returns {Object} process types usable in menus
 */
export const getProcessTypes = () => {
    return processTypes;
};

/**
 * @param {String} processTypeName - the name of the process type
 * @param {Array} features - list of available features
 */
export const setProcessTypeFeature = (processTypeName, features) => {
    processTypesFeatures.set(processTypeName, features);
};

/**
 * @returns {Array|undefined} List of available features for the process type
 */
export const getProcessFeatures = processTypeName => {
    return processTypesFeatures.get(processTypeName);
};
