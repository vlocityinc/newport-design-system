import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

export function createFlowProperties(flowProperties = {}) {
    const name = flowProperties.fullName || flowProperties.name;
    const { versionNumber = null, lastModifiedDate = null } = flowProperties;
    const metadataProperties = flowProperties.metadata || flowProperties;
    const {
        label = '',
        description = '',
        interviewLabel = '',
        processType = 'AutoLaunchedFlow',
        status = 'Draft'
    } = metadataProperties;

    return Object.assign(
        {},
        {
            label,
            name,
            description,
            versionNumber,
            lastModifiedDate,
            interviewLabel,
            processType,
            status,
            elementType
        }
    );
}

export function createFlowPropertiesMetadataObject(flowProperties) {
    const {
        label,
        description,
        interviewLabel,
        processType,
        status
    } = flowProperties;

    return Object.assign(
        {},
        {
            label,
            description,
            interviewLabel,
            processType,
            status
        }
    );
}
