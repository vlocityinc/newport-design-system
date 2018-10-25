let processTypes;

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