/**
 * Used to indicate that the order of the items in a list
 * (e.g. outcomes in a decision or events in a wait)
 * has changed
 */
const eventName = 'reorderlist';

export class ReorderListEvent extends CustomEvent<any> {
    constructor(sourceGuid, destinationGuid) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                sourceGuid,
                destinationGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
