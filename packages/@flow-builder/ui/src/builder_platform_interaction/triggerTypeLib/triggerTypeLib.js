import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

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

/**
 * Whether or not this trigger type has a schedule
 * @param {String} triggerType
 * @returns {Boolean} true if it has a schedule, false otherwise
 */
export const isScheduledTriggerType = triggerType => {
    // TODO this information should eventually just come from the trigger type service
    return triggerType === FLOW_TRIGGER_TYPE.SCHEDULED || triggerType === FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY;
};

/**
 * Get trigger type info for a given trigger type
 * @param {String} triggerType
 * @returns {Promise} promise that resolves to the trigger type info
 */
export const getTriggerTypeInfo = triggerType => {
    return fetchOnce(SERVER_ACTION_TYPE.GET_TRIGGER_TYPE_INFO, { triggerType }).then(data => {
        return data;
    });
};