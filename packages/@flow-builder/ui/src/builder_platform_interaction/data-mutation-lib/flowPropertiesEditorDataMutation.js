/**
 * Mutate a flowProperties object for use in the flowProperties property editor
 * @param {Object} flowProperties FlowProperties to mutate
 * @returns {Object} flowProperties The mutated FlowProperties
 */
export const mutateFlowProperties = flowProperties => {
    if (flowProperties.hasOwnProperty('fullName')) {
        flowProperties.name = flowProperties.fullName;
        delete flowProperties.fullName;
    }
    return flowProperties;
};

/**
 * Remove any mutations we made on the FlowProperties object
 * @param {Object} flowProperties FlowProperties to demutate
 * @returns {Object} flowProperties The demutated FlowProperties
 */
export const demutateFlowProperties = (flowProperties) => {
    if (flowProperties.hasOwnProperty('name')) {
        flowProperties.fullName = flowProperties.name;
        delete flowProperties.name;
    }
    return flowProperties;
};