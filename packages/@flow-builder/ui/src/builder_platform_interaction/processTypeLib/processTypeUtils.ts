// @ts-nocheck
import all from '@salesforce/label/FlowBuilderProcessTypesVerticalNavigation.all';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getProcessFeatures } from 'builder_platform_interaction/systemLib';

export const ALL_PROCESS_TYPE = { name: 'all', label: all };

const PROCESS_TYPE_DEFAULT_ICON = 'utility:flow';

// TODO W-8523370
const PROCESS_TYPES_ICONS = new Map([
    [ALL_PROCESS_TYPE.name, 'utility:flow'],
    [FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW, 'utility:magicwand'],
    [FLOW_PROCESS_TYPE.FLOW, 'utility:desktop'],
    [FLOW_PROCESS_TYPE.ACTION_CADENCE_FLOW, 'utility:activity'],
    [FLOW_PROCESS_TYPE.ACTION_PLAN, 'utility:fallback'],
    [FLOW_PROCESS_TYPE.APPOINTMENTS, 'utility:events'],
    [FLOW_PROCESS_TYPE.CHECKOUT_FLOW, 'utility:cart'],
    [FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW, 'utility:contact_request'],
    [FLOW_PROCESS_TYPE.CUSTOM_EVENT, 'utility:event'],
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_MOBILE, 'utility:phone_portrait'],
    [FLOW_PROCESS_TYPE.FIELD_SERVICE_WEB, 'utility:insert_tag_field'],
    [FLOW_PROCESS_TYPE.FORM, 'utility:edit_form'],
    [FLOW_PROCESS_TYPE.INVOCABLE_PROCESS, 'utility:process'],
    [FLOW_PROCESS_TYPE.JOURNEY_BUILDER_INTEGRATION, 'utility:builder'],
    [FLOW_PROCESS_TYPE.LOGIN_FLOW, 'utility:password'],
    [FLOW_PROCESS_TYPE.MANAGED_CONTENT_FLOW, 'utility:cases'],
    [FLOW_PROCESS_TYPE.ORCHESTRATOR, 'utility:orchestrator'],
    [FLOW_PROCESS_TYPE.ORCHESTRATION_FLOW, 'utility:classic_interface'],
    [FLOW_PROCESS_TYPE.SURVEY, 'utility:survey'],
    [FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW, 'utility:user'],
    [FLOW_PROCESS_TYPE.TRANSACTION_SECURITY_FLOW, 'utility:inspector_panel'],
    [FLOW_PROCESS_TYPE.WORKFLOW, 'utility:pause'],
    [FLOW_PROCESS_TYPE.SALES_ENTRY_EXPERIENCE_FLOW, 'utility:macros'],
    [FLOW_PROCESS_TYPE.ROUTING_FLOW, 'utility:omni_channel']
]);

const TRIGGER_TYPE_ICONS = new Map([
    [FLOW_TRIGGER_TYPE.SCHEDULED, 'utility:clock'],
    [FLOW_TRIGGER_TYPE.BEFORE_SAVE, 'utility:record_update'],
    [FLOW_TRIGGER_TYPE.BEFORE_DELETE, 'utility:record_update']
]);

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

export const getProcessTypeIcon = (processType) => PROCESS_TYPES_ICONS.get(processType) || PROCESS_TYPE_DEFAULT_ICON;

export const getTriggerTypeIcon = (processType, triggerType) =>
    TRIGGER_TYPE_ICONS.get(triggerType) || PROCESS_TYPE_DEFAULT_ICON;

/**
 * @typedef {Object} ProcessTypeWithIcon
 *
 * @property {String} name
 * @property {String} label
 * @property {String} iconName
 */
export const getProcessTypesWithIcons = (processTypes) =>
    processTypes.map(({ name, label }) => ({
        name,
        label,
        iconName: getProcessTypeIcon(name)
    }));

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
 * @params {String} processType
 * @return {FLOW_AUTOMATIC_OUTPUT_HANDLING} Supported, Unsupported or Required
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
 * @params processType
 * @return True, False
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
 * @param {String} processType
 * @returns {Boolean}
 */
export const isConfigurableStartSupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.CONFIGURABLE_START);
};

/**
 * Whether or not field traversal is supported
 * @param {Object} processType the current process type
 * @returns {Boolean} true if field traversal is supported, false otherwise
 */
export const isLookupTraversalSupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.LOOKUP_TRAVERSAL);
};

/**
 * Whether or not global variables outside formula is supported
 * @param {Object} processType the current process type
 * @returns {Boolean} true if global variables outside formula is supported, false if only supported in formulas
 */
export const isGlobalVariablesSupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.GLOBAL_VARIABLES);
};

/**
 * Determines whether the given process type supports conditional field visibility in screens
 * @param {String} processType
 * @returns {Boolean}
 */
export const isConditionalFieldVisibilitySupported = (processType) => {
    return hasProcessTypeFeature(processType, FLOW_PROCESS_TYPE_FEATURE.CONDITIONAL_FIELD_VISIBILITY);
};

/**
 * Returns true if the given process type should always use autolayout canvas
 * @param processType
 */
export const isAutoLayoutCanvasOnly = (processType) => {
    // TODO: This is a hack based on hardcoded process type.  This will be replaced
    //  (along with other hardcoded app process references in 234)
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008lMMtIAM/view
    return processType === FLOW_PROCESS_TYPE.ORCHESTRATOR;
};

/**
 * Scheduled Paths are supported exclusively for Auto Launched Flows. Returns true iff process type is auto launched.
 * @param processtype
 */
export const isScheduledPathSupported = (processType) => {
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
