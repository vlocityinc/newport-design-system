import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when focus needs to be moved from the start node (when the menu is open but no rows are present)
 */
const eventName = 'movefocusfromemptystartnode';

interface MoveFocusFromEmptyStartNodeEventDetail {
    guid: Guid;
}

export class MoveFocusFromEmptyStartNodeEvent extends CustomEvent<MoveFocusFromEmptyStartNodeEventDetail> {
    /**
     * @param guid - Guid of the start node
     */
    constructor(guid: Guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid
            }
        });
    }

    static EVENT_NAME = eventName;
}
