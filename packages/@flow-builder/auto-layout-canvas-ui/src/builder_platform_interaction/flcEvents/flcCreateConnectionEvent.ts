import { InsertAt, Guid } from 'builder_platform_interaction/autoLayoutCanvas';
/**
 * Event used to create a connection between a source and a target element.a
 * Used for gotos and merging ended branches.
 */

const eventName = 'flccreateconnection';

interface FlcCreateConnectionEventDetail {
    insertAt: InsertAt;
    targetGuid: Guid;
}
export class FlcCreateConnectionEvent extends CustomEvent<FlcCreateConnectionEventDetail> {
    /**
     * @param insertAt - The connection source
     * @param targetGuid - The guid of the target element
     */
    constructor(insertAt, targetGuid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                insertAt,
                targetGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
