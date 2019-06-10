const eventName = 'addrecordlookupfield';

export class AddRecordLookupFieldEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
