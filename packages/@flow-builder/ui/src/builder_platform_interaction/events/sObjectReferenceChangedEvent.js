const eventName = 'sobjectreferencechanged';

export class SObjectReferenceChangedEvent {
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
