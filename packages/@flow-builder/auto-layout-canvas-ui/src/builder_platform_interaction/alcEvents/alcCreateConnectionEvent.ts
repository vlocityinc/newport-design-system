import { ConnectionSource, Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event used to create a connection between a source and a target element.a
 * Used for gotos and merging ended branches.
 */

const eventName = 'alccreateconnection';

interface AlcCreateConnectionEventDetail {
    source: ConnectionSource;
    targetGuid: Guid;
}
export class AlcCreateConnectionEvent extends CustomEvent<AlcCreateConnectionEventDetail> {
    /**
     * @param source - The connection source
     * @param targetGuid - The guid of the target element
     */
    constructor(source: ConnectionSource, targetGuid: Guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source,
                targetGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
