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
     * @param sourceGuid - Guid of the source element
     * @param sourceBranchIndex - Index of branch on which GoTo is being added
     * @param targetGuid - Guid of the target element
     * @param source
     * @param target
     * @param isReroute - Whether this is a reroute of an existing Goto connection
     */
    constructor(source, target, isReroute) {
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
