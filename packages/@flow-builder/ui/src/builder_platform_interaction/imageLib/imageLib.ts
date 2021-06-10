// @ts-nocheck
import { ELEMENT_TYPE, COLLECTION_PROCESSOR_SUB_TYPE } from 'builder_platform_interaction/flowMetadata';

const preloadedResources = {};

/**
 * @param key
 * @param source
 */
function preloadImage(key, source) {
    const image = new Image();
    image.src = source;

    // Some browsers purge unused images, this makes sure they're used.
    if (!preloadedResources[key]) {
        preloadedResources[key] = [];
    }
    preloadedResources[key].push(image);
}

export const ICONS_LARGE = {
    [ELEMENT_TYPE.ACTION_CALL]: '/flow/icons/large/action_call.png',
    [ELEMENT_TYPE.APEX_CALL]: '/flow/icons/large/apex_call.png',
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: '/flow/icons/large/apex_plugin_call.png',
    [ELEMENT_TYPE.ASSIGNMENT]: '/flow/icons/large/assignment.png',
    [ELEMENT_TYPE.DECISION]: '/flow/icons/large/decision.png',
    [ELEMENT_TYPE.EMAIL_ALERT]: '/flow/icons/large/email_alert.png',
    [ELEMENT_TYPE.LOOP]: '/flow/icons/large/loop.png',
    [ELEMENT_TYPE.RECORD_CREATE]: '/flow/icons/large/record_create.png',
    [ELEMENT_TYPE.RECORD_DELETE]: '/flow/icons/large/record_delete.png',
    [ELEMENT_TYPE.RECORD_LOOKUP]: '/flow/icons/large/record_lookup.png',
    [ELEMENT_TYPE.RECORD_UPDATE]: '/flow/icons/large/record_update.png',
    [ELEMENT_TYPE.SCREEN]: '/flow/icons/large/screen.png',
    [ELEMENT_TYPE.SUBFLOW]: '/flow/icons/large/subflow.png',
    [ELEMENT_TYPE.WAIT]: '/flow/icons/large/wait.png',
    [COLLECTION_PROCESSOR_SUB_TYPE.SORT]: '/flow/icons/large/sort.png',
    [COLLECTION_PROCESSOR_SUB_TYPE.MAP]: '/flow/icons/large/data_mapping.png',
    [ELEMENT_TYPE.ROLLBACK]: '/flow/icons/large/rollback.png'
};

/**
 *
 */
export function preloadImages() {
    Object.values(ICONS_LARGE).forEach((source) => {
        preloadImage('ICONS_LARGE', source);
    });
}
