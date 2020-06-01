// @ts-nocheck
/**
 * Event used to create a connection between a source and a target element.a
 * Used for gotos and merging ended branches.
 */

const eventName = 'flccreateconnection';

export class FlcCreateConnectionEvent extends CustomEvent {
    /**
     * @param {Guid} sourceGuid - the Guid of the source element
     * @param {Guid} targetGuid - the guid of the target element
     */
    constructor(sourceGuid, targetGuid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                sourceGuid,
                targetGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
