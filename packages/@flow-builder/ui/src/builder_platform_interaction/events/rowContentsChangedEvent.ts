const eventName = 'rowcontentschanged';

export class RowContentsChangedEvent extends CustomEvent<any> {
    constructor(newValue = null) {
        super(eventName, {
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
