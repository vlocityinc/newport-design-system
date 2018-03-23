const eventName = 'rowcontentschanged';

export class RowContentsChangedEvent extends Event {
    constructor(propertyChanged = null, newValue = null, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            propertyChanged,
            newValue,
            error
        };
    }

    static EVENT_NAME = eventName;
}
