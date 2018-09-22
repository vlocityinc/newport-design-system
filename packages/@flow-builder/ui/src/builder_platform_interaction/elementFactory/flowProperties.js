import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

/**
 * Either creates a new flow properties or create a new copy of existing flow properties
 * @param {Object} flowProperties existing flowProperties which needs to be copied
 * @return {Object} new flow properties which is created
 */
export function createFlowProperties(flowProperties = {}) {
    const name = flowProperties.fullName || flowProperties.name || '';
    const { versionNumber = null, lastModifiedDate = null } = flowProperties;
    const {
        label = '',
        description = '',
        interviewLabel = '',
        processType = 'AutoLaunchedFlow',
        status = 'Draft'
    } = flowProperties.metadata || flowProperties;

    return {
            label,
            name,
            description,
            versionNumber,
            lastModifiedDate,
            interviewLabel,
            processType,
            status,
            elementType
    };
}

/**
 * Create a new copy of flow properties in shape as expected by flow metadata.
 * @param {Object} flowProperties existing flow properties
 * @return {Object} new flow properties
 */
export function createFlowPropertiesMetadataObject(flowProperties) {
    if (!flowProperties) {
        throw new Error('Flow Properties is not defined');
    }
    const {
        label,
        description,
        interviewLabel,
        processType,
        status
    } = flowProperties;

    return {
            label,
            description,
            interviewLabel,
            processType,
            status
    };
}
