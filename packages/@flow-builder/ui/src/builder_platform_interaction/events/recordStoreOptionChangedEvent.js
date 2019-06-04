const eventName = 'recordstoreoptionchanged';

export class RecordStoreOptionChangedEvent extends Event {
    constructor(getFirstRecordOnly, wayToStoreFields, assignNullToVariableNoRecord) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            getFirstRecordOnly,
            wayToStoreFields,
            assignNullToVariableNoRecord
        };
    }

    static EVENT_NAME = eventName;
}