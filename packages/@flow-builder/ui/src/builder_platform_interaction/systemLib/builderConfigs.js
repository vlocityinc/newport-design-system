let builderConfigs;

/**
 * Sets the builder type -> builder config map. This should be done during app initialization.
 *
 * @param {Object}
 *            data the data returned by the builder config service
 */
export const setBuilderConfigs = data => {
    builderConfigs = data;
};

/**
 * Gets all available builder configs per builder type.
 *
 * @returns {Object} builder configs
 */
export const getBuilderConfigs = () => {
    return builderConfigs;
};
