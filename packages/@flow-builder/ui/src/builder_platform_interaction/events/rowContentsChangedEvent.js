const eventName = 'rowcontentschanged';

export class RowContentsChangedEvent extends Event {
    constructor(newValue = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            newValue
        };
    }

    static EVENT_NAME = eventName;
}
