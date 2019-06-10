const eventName = 'recordfiltertypechanged';

export class RecordFilterTypeChangedEvent {
    constructor(filterType) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                filterType
            }
        });
    }

    static EVENT_NAME = eventName;
}
