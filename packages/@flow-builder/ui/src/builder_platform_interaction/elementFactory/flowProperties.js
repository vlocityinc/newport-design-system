import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

/**
 * The top level process metadata values to save with each flow. This includes the BuilderType
 * which helps us identify flow versions created by the Lightning Flow Builder.
 */
const LIGHTNING_FLOW_BUILDER = 'LightningFlowBuilder';
const BUILDER_TYPE = 'BuilderType';
const PROCESS_METADATA_VALUES = [
    {
        name: BUILDER_TYPE,
        value: {
            stringValue: LIGHTNING_FLOW_BUILDER
        }
    }
];

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
        status = 'Draft',
        processMetadataValues,
        hasUnsavedChanges = false
    } = flowProperties.metadata || flowProperties;

    let { isLightningFlowBuilder = true } = flowProperties;

    if ((processMetadataValues && processMetadataValues.length > 0)
        && (processMetadataValues[0].name && processMetadataValues[0].name === BUILDER_TYPE)
        && (processMetadataValues[0].value && processMetadataValues[0].value.stringValue === LIGHTNING_FLOW_BUILDER)) {
        isLightningFlowBuilder = true;
    } else if (processMetadataValues && processMetadataValues.length === 0) {
        isLightningFlowBuilder = false;
    }

    return {
            label,
            name,
            description,
            versionNumber,
            lastModifiedDate,
            interviewLabel,
            processType,
            status,
            elementType,
            isLightningFlowBuilder,
            hasUnsavedChanges
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

    // Adding a bit to make sure that flow is a saved/created in flow builder.
    const processMetadataValues = PROCESS_METADATA_VALUES;

    return {
            label,
            description,
            interviewLabel,
            processType,
            status,
            processMetadataValues
    };
}
