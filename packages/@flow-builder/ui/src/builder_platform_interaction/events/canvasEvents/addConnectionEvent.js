/**
 * Used by canvas to add a connection
 */
const eventName = 'addconnection';

export class AddConnectionEvent {
    constructor(sourceGuid, targetGuid) {
        return new CustomEvent(eventName, {
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
