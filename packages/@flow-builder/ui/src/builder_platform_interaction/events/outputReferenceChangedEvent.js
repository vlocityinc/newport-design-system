const eventName = 'outputreferencechanged';


export class OutputReferenceChangedEvent {
    constructor(value, error = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}