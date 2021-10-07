// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;

/**
 * The top level process metadata values to save with each flow. This includes the BuilderType
 * which helps us identify flow versions created by the Lightning Flow Builder.
 */

const BUILDER_TYPE = 'BuilderType';
const CANVAS_MODE = 'CanvasMode';
const LIGHTNING_FLOW_BUILDER = 'LightningFlowBuilder';
const ORIGIN_BUILDER_TYPE = 'OriginBuilderType';
const AUTO_LAYOUT_CANVAS = 'AUTO_LAYOUT_CANVAS';
const FREE_FORM_CANVAS = 'FREE_FORM_CANVAS';

/**
 * Either creates a new flow properties or create a new copy of existing flow properties
 *
 * @param {Object} flowProperties existing flowProperties which needs to be copied
 * @returns {Object} new flow properties which is created
 */
export function createFlowPropertiesForEditor(flowProperties = {}) {
    const newFlowProperties = createFlowProperties(flowProperties);

    if (newFlowProperties.canOnlySaveAsNewDefinition) {
        newFlowProperties.manageableState = null;
    }

    return newFlowProperties;
}

/**
 * @param flowProperties
 */
export function createFlowProperties(flowProperties = {}) {
    const name = flowProperties.fullName || flowProperties.name || '';
    const { lastModifiedDate = null, manageableState = null, versionNumber = null } = flowProperties;
    const lastModifiedBy = getLastModifiedBy(flowProperties.lastModifiedBy);
    const {
        description = '',
        hasUnsavedChanges = false,
        interviewLabel = '',
        isTemplate = false,
        label = '',
        lastInlineResourceGuid = null,
        lastInlineResourcePosition = null,
        lastInlineResourceRowIndex = null,
        processMetadataValues,
        processType = null,
        runInMode = null,
        priority,
        status,
        triggerType,
        apiVersion,
        isOverridable = false,
        overriddenFlow = null,
        sourceTemplate = null
    } = flowProperties.metadata || flowProperties;

    let {
        isLightningFlowBuilder = true,
        isCreatedOutsideLfb = false,
        canOnlySaveAsNewDefinition = false,
        isAutoLayoutCanvas = false
    } = flowProperties;

    const { definitionId } = flowProperties;

    canOnlySaveAsNewDefinition = canOnlySaveAsNewDefinition || manageableState === 'installed';

    if (processMetadataValues) {
        // isCreatedOutsideLFB can be true in 2 cases
        // 1) when an existing flow is never saved in LFB => In this case processMetadataValues will be an empty array
        // 2) After an existing flow is saved for the first time in LFB
        isCreatedOutsideLfb = processMetadataValues.length === 0 || checkIfCreatedOutsideLFB(processMetadataValues);
        isLightningFlowBuilder = checkIfLightningFlowBuilder(processMetadataValues);
        isAutoLayoutCanvas = checkIfBuiltInAutoLayoutCanvas(processMetadataValues);
    }
    // TODO: make an object that contains lastInlineResourceGuid, lastInlineResourcePosition and lastInlineResourceRowIndex
    return {
        canOnlySaveAsNewDefinition,
        definitionId,
        description,
        elementType,
        hasUnsavedChanges,
        interviewLabel,
        isCreatedOutsideLfb,
        isLightningFlowBuilder,
        isTemplate,
        label,
        lastModifiedBy,
        lastModifiedDate,
        lastInlineResourceGuid,
        lastInlineResourcePosition,
        lastInlineResourceRowIndex,
        name,
        processType,
        priority,
        runInMode,
        status,
        triggerType,
        versionNumber,
        apiVersion,
        isAutoLayoutCanvas,
        isOverridable,
        overriddenFlow,
        sourceTemplate
    };
}

/**
 * Create a new copy of flow properties in shape as expected by flow metadata.
 *
 * @param {Object} flowProperties existing flow properties
 * @returns {Object} new flow properties
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
        runInMode,
        status,
        priority = Number(flowProperties.priority) || undefined,
        apiVersion,
        isAutoLayoutCanvas,
        isOverridable,
        overriddenFlow,
        sourceTemplate
    } = flowProperties;

    // Adding a bit to make sure that flow is a saved/created in flow builder. And storing the Canvas Mode.
    const processMetadataValues = setProcessMetadataValue(isCreatedOutsideLfb, isAutoLayoutCanvas);

    return {
        description,
        interviewLabel,
        isTemplate,
        label,
        processMetadataValues,
        processType,
        priority,
        runInMode,
        status,
        apiVersion,
        isOverridable,
        overriddenFlow,
        sourceTemplate
    };
}

/**
 * Retrieve the name of the user who last modified the flow
 *
 * @param lastModifiedBy
 * @returns {Object | string} Either an Object with a name property or a string representing the user name or
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
 *
 * @param {Array} processMetadataValues array of objects
 * @returns true if processMetadataValues have an object with name as 'OriginBuilderType'
 */
function checkIfCreatedOutsideLFB(processMetadataValues = []) {
    return !processMetadataValues.some((processMetadataValue) => {
        return processMetadataValue.name === ORIGIN_BUILDER_TYPE;
    });
}

/**
 * Check if flow was created/saved in LFB.
 *
 * @param {Array} processMetadataValues array of objects
 * @returns true if processMetadataValues have a object with name as 'BuilderType' and stringValue as 'LightningFlowBuilder'
 */

/**
 * @param processMetadataValues
 */
function checkIfLightningFlowBuilder(processMetadataValues = []) {
    return processMetadataValues.some((processMetadataValue) => {
        return (
            processMetadataValue.name === BUILDER_TYPE &&
            processMetadataValue.value &&
            processMetadataValue.value.stringValue === LIGHTNING_FLOW_BUILDER
        );
    });
}

/**
 * Check if flow was saved with Canvas Mode 'AUTO-LAYOUT-CANVAS'
 *
 * @param processMetadataValues array of objects
 * @returns true if processMetadataValues have a object with name as 'CanvasMode' and stringValue as 'AUTO-LAYOUT-CANVAS'
 */
function checkIfBuiltInAutoLayoutCanvas(processMetadataValues: Array<object> = []): boolean {
    return processMetadataValues.some((processMetadataValue) => {
        return (
            processMetadataValue.name === CANVAS_MODE &&
            processMetadataValue.value &&
            processMetadataValue.value.stringValue === AUTO_LAYOUT_CANVAS
        );
    });
}

/**
 * Setter for processMatadataValue
 *
 * @param {*} isCreatedOutsideLfb if flow was created via CFD, metadata api or any third party builder
 * @param {*} isAutoLayoutCanvas if flow was saved in Auto-Layout Canvas Mode
 */
function setProcessMetadataValue(isCreatedOutsideLfb = false, isAutoLayoutCanvas = false) {
    const lfbProcessMetadataValue = createProcessMetadataValue(BUILDER_TYPE, LIGHTNING_FLOW_BUILDER);
    const canvasTypeProcessMetadataValue = isAutoLayoutCanvas
        ? createProcessMetadataValue(CANVAS_MODE, AUTO_LAYOUT_CANVAS)
        : createProcessMetadataValue(CANVAS_MODE, FREE_FORM_CANVAS);
    if (isCreatedOutsideLfb) {
        return [lfbProcessMetadataValue, canvasTypeProcessMetadataValue];
    }
    const originProcessMetadataValue = createProcessMetadataValue(ORIGIN_BUILDER_TYPE, LIGHTNING_FLOW_BUILDER);
    return [lfbProcessMetadataValue, originProcessMetadataValue, canvasTypeProcessMetadataValue];
}

/**
 * creates a new process metadata value
 *
 * @param {string} name name of the process metadata
 * @param {string} stringValue value of process metadata
 * @returns {Object} new process metadata value
 */
function createProcessMetadataValue(name, stringValue) {
    return {
        name,
        value: {
            stringValue
        }
    };
}
