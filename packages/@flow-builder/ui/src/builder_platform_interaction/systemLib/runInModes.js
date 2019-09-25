let runInModes;

/**
 * Gets all available run in modes.
 *
 * @returns {Object} modes usable in menus
 */
export const getRunInModes = () => {
    return runInModes;
};

/**
 * Sets the run in modes. This should be done during app initialization.
 *
 * @param {Object}
 *            data the data returned by the service
 */
export const setRunInModes = data => {
    if (Array.isArray(data)) {
        runInModes = data;
    }
};
