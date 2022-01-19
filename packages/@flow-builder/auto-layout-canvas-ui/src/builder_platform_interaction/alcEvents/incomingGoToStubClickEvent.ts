import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when clicking the incoming GoTo stub
 */

const eventName = 'incominggotostubclick';

interface IncomingGoToStubClickDetail {
    guid: Guid;
}

export class IncomingGoToStubClickEvent extends CustomEvent<IncomingGoToStubClickDetail> {
    /**
     * @param guid - guid of the clicked incoming GoTo stub
     */
    constructor(guid: string) {
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
