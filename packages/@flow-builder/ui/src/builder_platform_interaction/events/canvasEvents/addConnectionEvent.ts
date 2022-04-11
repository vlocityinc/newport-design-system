/**
 * Used by canvas to add a connection
 */
const eventName = 'addconnection';

export class AddConnectionEvent extends CustomEvent<any> {
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
