import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

/**
 * The top level process metadata values to save with each flow. This includes the BuilderType
 * which helps us identify flow versions created by the Lightning Flow Builder.
 */
const LIGHTNING_FLOW_BUILDER = 'LightningFlowBuilder';
const CLOUD_FLOW_DESIGNER = 'CloudFlowDesigner';
const BUILDER_TYPE = 'BuilderType';
const ORIGIN_BUILDER_TYPE = 'OriginBuilderType';

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

    let { isLightningFlowBuilder = true, isCreatedInCfd = false } = flowProperties;

    if (processMetadataValues) {
        // isCreatedInCfd can be true in 2 cases
        // 1) when an existing flow is never saved in LFB => In this case processMetadataValues will be an empty array
        // 2) when an existing flow is saved in LFB atleast once => In this case processMetadataValues will have a bit named 'createdInCloudFlowDesigner'
        isCreatedInCfd = processMetadataValues.length === 0 || checkIfCreatedInCfd(processMetadataValues);
        isLightningFlowBuilder = checkIfLightningFlowBuilder(processMetadataValues);
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
            isCreatedInCfd,
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
        status,
        isCreatedInCfd
    } = flowProperties;

    // Adding a bit to make sure that flow is a saved/created in flow builder.
    const processMetadataValues = setProcessMetadataValue(isCreatedInCfd);

    return {
            label,
            description,
            interviewLabel,
            processType,
            status,
            processMetadataValues
    };
}

/**
 * Check if flow was created in CFD at some point of time.
 * @param {Array} processMetadataValues array of bits
 * @returns true if processMetadataValues have a bit which is to cloud flow designer
 */
function checkIfCreatedInCfd(processMetadataValues = []) {
    return processMetadataValues.some(((processMetadataValue) => {
        return (processMetadataValue.name === ORIGIN_BUILDER_TYPE
            && processMetadataValue.value
            && processMetadataValue.value.stringValue === CLOUD_FLOW_DESIGNER);
    }));
}

/**
 * Check if flow was created/saved in LFB.
 * @param {Array} processMetadataValues array of bits
 * @returns true if processMetadataValues have a bit which is to cloud flow designer
 */

function checkIfLightningFlowBuilder(processMetadataValues = []) {
    return processMetadataValues.some(((processMetadataValue) => {
        return (processMetadataValue.name === BUILDER_TYPE
            && processMetadataValue.value
            && processMetadataValue.value.stringValue === LIGHTNING_FLOW_BUILDER);
    }));
}

/**
 * Setter for processMatadataValue
 * @param {*} isCreatedInCfd if flow was created in CFD
 */
function setProcessMetadataValue(isCreatedInCfd = false) {
    const lfbProcessMetadataValue = createProcessMetadataValue(BUILDER_TYPE, LIGHTNING_FLOW_BUILDER);
    const originProcessMetadataValue = createProcessMetadataValue(ORIGIN_BUILDER_TYPE, (isCreatedInCfd ? CLOUD_FLOW_DESIGNER : LIGHTNING_FLOW_BUILDER));
    return [lfbProcessMetadataValue, originProcessMetadataValue];
}

/**
 * creates a new process metadata value
 * @param {String} name name of the process metadata
 * @param {String} stringValue value of process metadata
 * @return {Object} new process metadata value
 */
function createProcessMetadataValue(name, stringValue) {
    return {
        name,
        value: {
            stringValue
        }
    };
}
