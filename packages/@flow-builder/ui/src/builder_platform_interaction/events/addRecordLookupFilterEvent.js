const eventName = 'addrecordlookupfilter';


export class AddRecordLookupFilterEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}