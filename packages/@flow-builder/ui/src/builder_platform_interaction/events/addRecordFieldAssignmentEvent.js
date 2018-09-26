const eventName = 'addrecordfieldassignment';


export class AddRecordFieldAssignmentEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}