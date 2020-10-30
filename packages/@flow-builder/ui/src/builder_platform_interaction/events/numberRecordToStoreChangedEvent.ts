const eventName = 'numberrecordtostorechanged';

type NumberRecordToStoreChangedEventDetail = {
    getFirstRecordOnly?: boolean;
};

export class NumberRecordToStoreChangedEvent extends CustomEvent<NumberRecordToStoreChangedEventDetail> {
    constructor(getFirstRecordOnly) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                getFirstRecordOnly
            }
        });
    }
    static EVENT_NAME = eventName;
}
