const eventName = 'numberrecordtostorechanged';

export class NumberRecordToStoreChangedEvent extends Event {
    constructor(getFirstRecordOnly) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            getFirstRecordOnly
        };
    }

    static EVENT_NAME = eventName;
}