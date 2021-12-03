import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when clicking the outgoing GoTo stub
 */

const eventName = 'outgoinggotostubclick';

interface OutgoingGoToStubClickDetail {
    source: ConnectionSource;
}

export class OutgoingGoToStubClickEvent extends CustomEvent<OutgoingGoToStubClickDetail> {
    /**
     * @param source - ConnectionSource
     */
    constructor(source: ConnectionSource) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source
            }
        });
    }

    static EVENT_NAME = eventName;
}
