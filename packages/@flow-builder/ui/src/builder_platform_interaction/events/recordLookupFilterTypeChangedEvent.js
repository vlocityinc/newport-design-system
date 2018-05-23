const eventName = 'recordlookupfiltertypechanged';

export class RecordLookupFilterTypeChangedEvent extends Event {
    constructor(filterType) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            filterType
        };
    }

    static EVENT_NAME = eventName;
}