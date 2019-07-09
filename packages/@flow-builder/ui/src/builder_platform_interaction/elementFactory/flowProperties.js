import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

/**
 * The top level process metadata values to save with each flow. This includes the BuilderType
 * which helps us identify flow versions created by the Lightning Flow Builder.
 */

const BUILDER_TYPE = 'BuilderType';
const LIGHTNING_FLOW_BUILDER = 'LightningFlowBuilder';
const ORIGIN_BUILDER_TYPE = 'OriginBuilderType';

/**
 * Either creates a new flow properties or create a new copy of existing flow properties
 * @param {Object} flowProperties existing flowProperties which needs to be copied
 * @return {Object} new flow properties which is created
 */
export function createFlowPropertiesForEditor(flowProperties = {}) {
    const newFlowProperties = createFlowProperties(flowProperties);

    if (newFlowProperties.canOnlySaveAsNewDefinition) {
        newFlowProperties.manageableState = null;
        newFlowProperties.isTemplate = false;
    }

    return newFlowProperties;
}

export function createFlowProperties(flowProperties = {}) {
    const name = flowProperties.fullName || flowProperties.name || '';
    const {
        lastModifiedDate = null,
        manageableState = null,
        versionNumber = null
    } = flowProperties;
    const lastModifiedBy = getLastModifiedBy(flowProperties.lastModifiedBy);

    const {
        description = '',
        hasUnsavedChanges = false,
        interviewLabel = '',
        inlineResource = null,
        isTemplate = false,
        label = '',
        position = null,
        processMetadataValues,
        processType = null,
        runInSystemMode = false,
        status
    } = flowProperties.metadata || flowProperties;

    let {
        isLightningFlowBuilder = true,
        isCreatedOutsideLfb = false,
        canOnlySaveAsNewDefinition = false
    } = flowProperties;
    canOnlySaveAsNewDefinition =
        canOnlySaveAsNewDefinition || manageableState === 'installed';

    if (processMetadataValues) {
        // isCreatedOutsideLFB can be true in 2 cases
        // 1) when an existing flow is never saved in LFB => In this case processMetadataValues will be an empty array
        // 2) After an existing flow is saved for the first time in LFB
        isCreatedOutsideLfb =
            processMetadataValues.length === 0 ||
            checkIfCreatedOutsideLFB(processMetadataValues);
        isLightningFlowBuilder = checkIfLightningFlowBuilder(
            processMetadataValues
        );
    }

    return {
        canOnlySaveAsNewDefinition,
        description,
        elementType,
        hasUnsavedChanges,
        inlineResource,
        interviewLabel,
        isCreatedOutsideLfb,
        isLightningFlowBuilder,
        isTemplate,
        label,
        lastModifiedBy,
        lastModifiedDate,
        name,
        position,
        processType,
        runInSystemMode,
        status,
        versionNumber
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
        description,
        interviewLabel,
        isCreatedOutsideLfb,
        isTemplate,
        label,
        processType,
        runInSystemMode,
        status
    } = flowProperties;

    // Adding a bit to make sure that flow is a saved/created in flow builder.
    const processMetadataValues = setProcessMetadataValue(isCreatedOutsideLfb);

    return {
        description,
        interviewLabel,
        isTemplate,
        label,
        processMetadataValues,
        processType,
        runInSystemMode,
        status
    };
}

/**
 * Retrieve the name of the user who last modified the flow
 * @param {Object} flowProperties
 * @returns {Object|String} Either an Object with a name property or a string representing the user name or
 * null if no lastModifiedBy
 */
function getLastModifiedBy(lastModifiedBy) {
    // lastModifiedBy will be an object with property name if coming from flow metadata and a string inside of
    // flow builder (when loading the flow data in to the flow properties editor, for example)
    if (lastModifiedBy) {
        return lastModifiedBy.name || lastModifiedBy;
    }

    return null;
}

/**
 * Check if flow was created via CFD, metadata api or any third party builder at some point of time.
 * @param {Array} processMetadataValues array of objects
 * @returns true if processMetadataValues have an object with name as 'OriginBuilderType'
 */
function checkIfCreatedOutsideLFB(processMetadataValues = []) {
    return !processMetadataValues.some(processMetadataValue => {
        return processMetadataValue.name === ORIGIN_BUILDER_TYPE;
    });
}

/**
 * Check if flow was created/saved in LFB.
 * @param {Array} processMetadataValues array of objects
 * @returns true if processMetadataValues have a object with name as 'BuilderType' and stringValue as 'LightningFlowBuilder'
 */

function checkIfLightningFlowBuilder(processMetadataValues = []) {
    return processMetadataValues.some(processMetadataValue => {
        return (
            processMetadataValue.name === BUILDER_TYPE &&
            processMetadataValue.value &&
            processMetadataValue.value.stringValue === LIGHTNING_FLOW_BUILDER
        );
    });
}

/**
 * Setter for processMatadataValue
 * @param {*} isCreatedOutsideLfb if flow was created via CFD, metadata api or any third party builder
 */
function setProcessMetadataValue(isCreatedOutsideLfb = false) {
    const lfbProcessMetadataValue = createProcessMetadataValue(
        BUILDER_TYPE,
        LIGHTNING_FLOW_BUILDER
    );
    if (isCreatedOutsideLfb) {
        return [lfbProcessMetadataValue];
    }
    const originProcessMetadataValue = createProcessMetadataValue(
        ORIGIN_BUILDER_TYPE,
        LIGHTNING_FLOW_BUILDER
    );
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
