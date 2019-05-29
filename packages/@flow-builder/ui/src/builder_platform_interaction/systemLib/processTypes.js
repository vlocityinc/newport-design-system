let processTypes;
const processTypesFeatures = new Map();

/**
 * Sets the process types. This should be done during app initialization.
 *
 * @param {Object}
 *            data the data returned by the service
 */
export const setProcessTypes = (data) => {
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
export const getProcessFeatures = (processTypeName) => {
    return processTypesFeatures.get(processTypeName);
};