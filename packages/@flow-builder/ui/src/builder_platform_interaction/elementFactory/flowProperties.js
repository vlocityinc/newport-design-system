import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

/**
 * The top level process metadata values to save with each flow. This includes the BuilderType
 * which helps us identify flow versions created by the Lightning Flow Builder.
 */
const LIGHTNING_FLOW_BUILDER = 'LightningFlowBuilder';
const BUILDER_TYPE = 'BuilderType';
const ORIGIN_BUILDER_TYPE = 'OriginBuilderType';

/**
 * Either creates a new flow properties or create a new copy of existing flow properties
 * @param {Object} flowProperties existing flowProperties which needs to be copied
 * @return {Object} new flow properties which is created
 */
export function createFlowPropertiesForEditor(flowProperties = {}) {
    const newFlowProperties = createFlowProperties(flowProperties);

    if (newFlowProperties.canOnlySaveAsNewDefinition) {
        newFlowProperties.label = '';
        newFlowProperties.name = '';
        newFlowProperties.description = '';
        newFlowProperties.manageableState = null;
        newFlowProperties.isTemplate = false;
    }

    return newFlowProperties;
}

export function createFlowProperties(flowProperties = {}) {
    const name = flowProperties.fullName || flowProperties.name || '';
    const { versionNumber = null, lastModifiedDate = null,  manageableState = null } = flowProperties;
    const {
        label = '',
        description = '',
        interviewLabel = '',
        isTemplate = false,
        processType = null,
        status,
        processMetadataValues,
        hasUnsavedChanges = false
    } = flowProperties.metadata || flowProperties;

    let { isLightningFlowBuilder = true, isCreatedOutsideLfb = false, canOnlySaveAsNewDefinition = false } = flowProperties;

    if (processMetadataValues) {
        // isCreatedOutsideLFB can be true in 2 cases
        // 1) when an existing flow is never saved in LFB => In this case processMetadataValues will be an empty array
        // 2) After an existing flow is saved for the first time in LFB
        isCreatedOutsideLfb = processMetadataValues.length === 0 || checkIfCreatedOutsideLFB(processMetadataValues);
        isLightningFlowBuilder = checkIfLightningFlowBuilder(processMetadataValues);
    }

    canOnlySaveAsNewDefinition = manageableState === 'installed';

    return {
            label,
            name,
            description,
            versionNumber,
            lastModifiedDate,
            interviewLabel,
            isTemplate,
            processType,
            status,
            canOnlySaveAsNewDefinition,
            elementType,
            isLightningFlowBuilder,
            isCreatedOutsideLfb,
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
        isTemplate,
        processType,
        status,
        isCreatedOutsideLfb
    } = flowProperties;

    // Adding a bit to make sure that flow is a saved/created in flow builder.
    const processMetadataValues = setProcessMetadataValue(isCreatedOutsideLfb);

    return {
            label,
            description,
            interviewLabel,
            isTemplate,
            processType,
            status,
            processMetadataValues
    };
}

/**
 * Check if flow was created via CFD, metadata api or any third party builder at some point of time.
 * @param {Array} processMetadataValues array of objects
 * @returns true if processMetadataValues have an object with name as 'OriginBuilderType'
 */
function checkIfCreatedOutsideLFB(processMetadataValues = []) {
    return !processMetadataValues.some(((processMetadataValue) => {
        return processMetadataValue.name === ORIGIN_BUILDER_TYPE;
    }));
}

/**
 * Check if flow was created/saved in LFB.
 * @param {Array} processMetadataValues array of objects
 * @returns true if processMetadataValues have a object with name as 'BuilderType' and stringValue as 'LightningFlowBuilder'
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
 * @param {*} isCreatedOutsideLfb if flow was created via CFD, metadata api or any third party builder
 */
function setProcessMetadataValue(isCreatedOutsideLfb = false) {
    const lfbProcessMetadataValue = createProcessMetadataValue(BUILDER_TYPE, LIGHTNING_FLOW_BUILDER);
    if (isCreatedOutsideLfb) {
        return [lfbProcessMetadataValue];
    }
    const originProcessMetadataValue = createProcessMetadataValue(ORIGIN_BUILDER_TYPE, LIGHTNING_FLOW_BUILDER);
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
