const eventName = 'numberrecordtostorechanged';

export class NumberRecordToStoreChangedEvent extends Event {
    constructor(numberRecordsToStore) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            numberRecordsToStore
        };
    }

    static EVENT_NAME = eventName;
}