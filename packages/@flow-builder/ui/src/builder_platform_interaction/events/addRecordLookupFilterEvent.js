const eventName = 'addrecordlookupfilter';

export class AddRecordLookupFilterEvent extends Event {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
    }

    static EVENT_NAME = eventName;
}