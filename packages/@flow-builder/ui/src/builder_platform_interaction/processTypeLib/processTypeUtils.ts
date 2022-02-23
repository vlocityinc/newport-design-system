// @ts-nocheck
import all from '@salesforce/label/FlowBuilderProcessTypesVerticalNavigation.all';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { getProcessFeatures, getProcessTypes } from 'builder_platform_interaction/systemLib';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';

export const ALL_PROCESS_TYPE = { name: 'all', label: all, iconName: 'utility:flow' };

const PROCESS_TYPE_DEFAULT_ICON = 'utility:flow';

export enum FLOW_AUTOMATIC_OUTPUT_HANDLING {
    SUPPORTED = 'Supported',
    UNSUPPORTED = 'Unsupported',
    REQUIRED = 'Required'
}

export const FLOW_PROCESS_TYPE_FEATURE = {
    STORE_OUTPUT_AUTOMATICALLY: 'StoreOutputAutomatically',
    CONFIGURABLE_START: 'ConfigurableStart',
    LOOKUP_TRAVERSAL: 'LookupTraversal',
    CONDITIONAL_FIELD_VISIBILITY: 'ConditionalFieldVisibility',
    GLOBAL_VARIABLES: 'GlobalVariables',
    TRANSACTION_CONTROLLED_ACTIONS: 'TransactionControlledActions'
};

export const getProcessTypeIcon = (processTypeName) => {
    const processType = getProcessTypes().find((processType) => processType.name === processTypeName);
    return (processType && processType.iconName) || PROCESS_TYPE_DEFAULT_ICON;
};

/**
 * @param processTypes
 * @typedef {Object} ProcessTypeWithIcon
 * @property {string} name
 * @property {string} label
 * @property {string} iconName
 */
export const getProcessTypesWithIcons = (processTypes) =>
    processTypes.map(({ name, label, iconName }) => ({
        name,
        label,
        iconName: iconName || PROCESS_TYPE_DEFAULT_ICON
    }));

/**
 * @param processType
 * @param feature
 */
function hasProcessTypeFeature(processType, feature) {
    const processTypeFeatures = getProcessFeatures(processType);

    return processTypeFeatures && processTypeFeatures.find((processTypeFeature) => processTypeFeature === feature)
        ? true
        : false;
}

/**
 * this function returns one of the value of the  FLOW_AUTOMATIC_OUTPUT_HANDLING enum.
 * Supported - The processType supports Automatic output handling and Advanced Options
 * Unsupported - The processType does not support Automatic output handling
 * Required - The ProcessType only supports Automatic output handling
 *
 * @param processType
 * @params {string} processType
 * @returns {FLOW_AUTOMATIC_OUTPUT_HANDLING} Supported, Unsupported or Required
 */
export const getProcessTypeAutomaticOutPutHandlingSupport = (processType) => {
    const isStoreOutputAutomaticallyAvailable = hasProcessTypeFeature(
        processType,
        FLOW_PROCESS_TYPE_FEATURE.STORE_OUTPUT_AUTOMATICALLY
    );
    return isStoreOutputAutomaticallyAvailable
        ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
        : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
};

/**
 * This function returns true or false to indicate if the specified processType
 * supports transaction controlled actions.
 *
 * @param processType
 * @params processType
 * @returns True, False
 */
export const getProcessTypeTransactionControlledActionsSupport = (processType) => {
    const isTransactionControlledActionsSupported = hasProcessTypeFeature(
        processType,
        FLOW_PROCESS_TYPE_FEATURE.TRANSACTION_CONTROLLED_ACTIONS
    );
    return isTransactionControlledActionsSupported;
};

/**
 * Determines whether the given process type supports having a configurable start element
 *
 * @param {string} processType
 * @returns {boolean}
 */
export const isConfigurableStartSupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.CONFIGURABLE_START);
};

/**
 * Whether or not field traversal is supported
 *
 * @param {Object} processType the current process type
 * @returns {boolean} true if field traversal is supported, false otherwise
 */
export const isLookupTraversalSupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.LOOKUP_TRAVERSAL);
};

/**
 * Whether or not global variables outside formula is supported
 *
 * @param {Object} processType the current process type
 * @returns {boolean} true if global variables outside formula is supported, false if only supported in formulas
 */
export const isGlobalVariablesSupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.GLOBAL_VARIABLES);
};

/**
 * Determines whether the given process type supports conditional field visibility in screens
 *
 * @param {string} processType
 * @returns {boolean}
 */
export const isConditionalFieldVisibilitySupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.CONDITIONAL_FIELD_VISIBILITY);
};

/**
 * Returns true if the given process type should always use autolayout canvas
 *
 * @param processType
 */
export const isAutoLayoutCanvasOnly = (processType) => {
    // TODO: This is a hack based on hardcoded process type.  This will be replaced
    //  (along with other hardcoded app process references in 234)
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008lMMtIAM/view
    return isOrchestrator(processType);
};

/**
 * Utility method to determine if the flow is of process type: Orchestrator
 *
 * @param processType eg: Flow, Orchestrator, Workflow, etc...
 * @returns whether or not the flow is Orchestrator
 */
export const isOrchestrator = (processType?: string): boolean => {
    return processType === FLOW_PROCESS_TYPE.ORCHESTRATOR || processType === FLOW_PROCESS_TYPE.CMS_ORCHESTRATOR;
};

/**
 * Scheduled Paths are supported exclusively for Auto Launched Flows. Returns true iff process type is auto launched.
 *
 * @param processtype
 * @param processType
 */
export const isScheduledPathSupported = (processType) => {
    return processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW;
};

/**
 * Flow Testing is supported exclusively for Triggered Auto Launched Flows (Not Before-Delete). Returns true iff process type is auto launched.
 *
 * @param processType
 */
export const isFlowTestingSupportedForProcessType = (processType: string) => {
    return processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW;
};

const COLLATION = [FLOW_PROCESS_TYPE.FLOW, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW];

const compareProcessTypes = (left, right) => {
    if (left && right) {
        const leftIndex = COLLATION.indexOf(left.name);
        const rightIndex = COLLATION.indexOf(right.name);
        if (leftIndex !== -1 && rightIndex !== -1) {
            return leftIndex - rightIndex;
        } else if (leftIndex !== -1 && rightIndex === -1) {
            return -1;
        } else if (leftIndex === -1 && rightIndex !== -1) {
            return +1;
        }
        return left.label.localeCompare(right.label);
    } else if (left && !right) {
        return -1;
    } else if (!left && right) {
        return +1;
    }
    return 0;
};

export const sortProcessTypes = (processTypes) => {
    if (processTypes) {
        processTypes.sort(compareProcessTypes);
    }
};

// TODO: W-9299993 Remove reliance on hardcoded processType and triggerType for launching merged recordChangeTriggerEditor
/**
 * Scheduled Paths are supported exclusively for Record-Triggered Flows, including record-triggered AutolaunchedFlow and record-triggered Orchestrator
 *
 * @param triggerType
 * @returns {boolean} indicating if the flow is record triggered type
 */
export const isRecordTriggeredFlow = (triggerType): boolean => {
    return (
        (getProcessType() === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW ||
            getProcessType() === FLOW_PROCESS_TYPE.ORCHESTRATOR) &&
        isRecordChangeTriggerType(triggerType)
    );
};

/**
 * Helper function to determine if current flow is a record-triggered flow only
 *
 * @param triggerType
 * @param processType optional
 * @returns {boolean} indicating if the flow is record triggered flow
 */
export const isNonOrchestratorRecordTriggeredFlow = (
    triggerType: string | undefined,
    processType?: string | undefined | null
): boolean => {
    if (!processType) {
        processType = getProcessType();
    }
    return processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW && isRecordChangeTriggerType(triggerType);
};
