let builderConfigs;
let builderType;

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
 * Get a builder config for a builder type.
 *
 * @param {string} builderType builder type
 * @returns {Object} builder config
 */
export const getBuilderConfig = () => (builderConfigs && builderType ? builderConfigs[builderType] : null);

export function setBuilderType(value) {
    builderType = value;
}

export const getBuilderType = () => builderType;
