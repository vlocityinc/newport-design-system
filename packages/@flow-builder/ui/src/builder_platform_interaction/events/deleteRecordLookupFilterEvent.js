const eventName = 'deleterecordlookupfilter';

export class DeleteRecordLookupFilterEvent extends Event {
    constructor(index) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        this.detail = {
            index
        };
    }

    static EVENT_NAME = eventName;
}