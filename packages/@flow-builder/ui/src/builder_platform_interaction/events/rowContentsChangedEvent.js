const eventName = 'rowcontentschanged';

export class RowContentsChangedEvent extends Event {
    constructor(propertyChanged = null, newValue = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            propertyChanged,
            newValue
        };
    }

    static EVENT_NAME = eventName;
}
