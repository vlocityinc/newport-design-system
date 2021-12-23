import { ConnectionSource, Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event used to create a goTo connection between a source and a target element.
 */

const eventName = 'creategotoconnection';

interface CreateGoToConnectionEventDetail {
    source: ConnectionSource;
    target: Guid;
    isReroute: boolean;
}

export class CreateGoToConnectionEvent extends CustomEvent<CreateGoToConnectionEventDetail> {
    /**
     * @param source - The connection source for the goto
     * @param target - The goto's target guid
     * @param isReroute - Whether this is a reroute of an existing Goto connection
     */
    constructor(source: ConnectionSource, target: Guid, isReroute: boolean) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source,
                target,
                isReroute
            }
        });
    }

    static EVENT_NAME = eventName;
}
