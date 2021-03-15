// @ts-nocheck
import { FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { LABELS } from './triggerTypeLabels';

const isUndefinedOrNoneTriggerType = (triggerType) => {
    return !triggerType || triggerType === FLOW_TRIGGER_TYPE.NONE;
};

/**
 * Determines whether the flow run-in system mode feature is supported for the given trigger type
 * * @param {String} triggerType
 * @returns {Boolean}
 */
export const isRunInModeSupported = (triggerType) => {
    return isUndefinedOrNoneTriggerType(triggerType);
};

/**
 * Whether or not lookup traversal is supported for this trigger type
 * @param {String} triggerType
 * @returns {Boolean} true if lookup traversal is supported for this trigger type, false otherwise
 */
export const isLookupTraversalSupported = (triggerType) => {
    return !triggerType || triggerType !== FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY;
};

/**
 * Whether or not this trigger type has a schedule
 * @param {String} triggerType
 * @returns {Boolean} true if it has a schedule, false otherwise
 */
export const isScheduledTriggerType = (triggerType) => {
    // TODO this information should eventually just come from the trigger type service
    return triggerType === FLOW_TRIGGER_TYPE.SCHEDULED || triggerType === FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY;
};

/**
 * Whether or not this trigger type is a record change trigger type
 * @param {String} triggerType
 * @returns {Boolean} true if it is record change trigger, false otherwise
 */
export const isRecordChangeTriggerType = (triggerType) => {
    return (
        triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE ||
        triggerType === FLOW_TRIGGER_TYPE.BEFORE_DELETE ||
        triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE
    );
};

/**
 * Whether or not this trigger type supports a triggering record update
 * NOTE: Delete this method in favor of getTriggerHasCriteria if and when we support ScheduledJourneys
 * @param {String} triggerType
 * @returns {Boolean} true if the trigger type can have triggering record update, false otherwise
 */
export const doesSupportTriggeringRecordUpdate = (triggerType) => {
    return (
        triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE ||
        triggerType === FLOW_TRIGGER_TYPE.BEFORE_DELETE ||
        triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE ||
        triggerType === FLOW_TRIGGER_TYPE.SCHEDULED
    );
};

/**
 * Whether or not this trigger type has criteria
 * @param {String} triggerType
 * @returns {Boolean} true if it has criteria, false otherwise
 */
export const getTriggerHasCriteria = (triggerType) => {
    // TODO this information should eventually just come from the trigger type service
    return isScheduledTriggerType(triggerType) || isRecordChangeTriggerType(triggerType);
};

/**
 * Get trigger type info for a given trigger type
 * @param {String} triggerType
 * @returns {Promise} promise that resolves to the trigger type info
 */
export const getTriggerTypeInfo = (triggerType) => {
    return fetchOnce(SERVER_ACTION_TYPE.GET_TRIGGER_TYPE_INFO, { triggerType }).then((data) => {
        return data;
    });
};

export const RECORD_TRIGGER_TYPE_LABEL_LOOKUP = {
    [FLOW_TRIGGER_SAVE_TYPE.CREATE]: LABELS.recordCreatedTriggerType,
    [FLOW_TRIGGER_SAVE_TYPE.UPDATE]: LABELS.recordUpdatedTriggerType,
    [FLOW_TRIGGER_SAVE_TYPE.DELETE]: LABELS.recordDeletedTriggerType,
    [FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE]: LABELS.recordCreatedOrUpdatedTriggerType
};
