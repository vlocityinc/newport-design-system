import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when focus needs to be moved to the node
 */
const eventName = 'movefocustonode';

interface MoveFocusToNodeEventDetail {
    focusGuid: Guid;
}

export class MoveFocusToNodeEvent extends CustomEvent<MoveFocusToNodeEventDetail> {
    /**
     * @param focusGuid - the guid of the target element to reconnect
     */
    constructor(focusGuid: Guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                focusGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
