import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when the "merge with existing path" connector menu item is selected
 */
const eventName = 'mergewithexistingpath';

interface MergeWithExistingPathEventDetail {
    targetGuid: Guid;
}

export class MergeWithExistingPathEvent extends CustomEvent<MergeWithExistingPathEventDetail> {
    /**
     * @param targetGuid - the guid of the target element to reconnect
     */
    constructor(targetGuid: Guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                targetGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
