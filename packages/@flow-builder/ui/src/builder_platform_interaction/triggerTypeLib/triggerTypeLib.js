import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';

const isUndefinedOrNoneTriggerType = triggerType => {
    return !triggerType || triggerType === FLOW_TRIGGER_TYPE.NONE;
};

/**
 * Determines whether the flow run-in system mode feature is supported for the given trigger type
 * * @param {String} triggerType
 * @returns {Boolean}
 */
export const isRunInModeSupported = triggerType => {
    return isUndefinedOrNoneTriggerType(triggerType);
};

/**
 * Whether or not lookup traversal is supported for this trigger type
 * @param {String} triggerType
 * @returns {Boolean} true if lookup traversal is supported for this trigger type, false otherwise
 */
export const isLookupTraversalSupported = triggerType => {
    return isUndefinedOrNoneTriggerType(triggerType);
};
