import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event used to delete a goTo connection between a source and a target element.
 */

const eventName = 'deletegotoconnection';

interface DeleteGoToConnectionEventDetail {
    source: ConnectionSource;
}

export class DeleteGoToConnectionEvent extends CustomEvent<DeleteGoToConnectionEventDetail> {
    /**
     * @param source - The connection source
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
