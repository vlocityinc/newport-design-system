const eventName = 'deleterecordfieldassignment';

export class DeleteRecordFieldAssignmentEvent {
    constructor(index) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index
            }
        });
    }

    static EVENT_NAME = eventName;
}
