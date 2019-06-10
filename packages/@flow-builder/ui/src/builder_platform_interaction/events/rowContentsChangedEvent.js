const eventName = 'rowcontentschanged';

export class RowContentsChangedEvent {
    constructor(newValue = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                newValue
            }
        });
    }

    static EVENT_NAME = eventName;
}
