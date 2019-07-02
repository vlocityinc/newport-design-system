let features;

/**
 * Sets the supported features. This should be done during app initialization.
 *
 * @param {Set} supportedFeatures Set of supportedFeatures
 */
export const setSupportedFeatures = supportedFeatures => {
    features = supportedFeatures;
};

/**
 * Gets all the supported features
 *
 * @returns {Set} set of supported features
 */
export const getSupportedFeatures = () => {
    return features;
};
