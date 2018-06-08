const eventName = 'recordstoreoptionchanged';

export class RecordStoreOptionChangedEvent extends Event {
    constructor(numberRecordsToStore, wayToStoreFields, assignNullToVariableNoRecord) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            numberRecordsToStore,
            wayToStoreFields,
            assignNullToVariableNoRecord
        };
    }

    static EVENT_NAME = eventName;
}