const eventName = 'addrecordfieldassignment';

export class AddRecordFieldAssignmentEvent extends CustomEvent<null> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
