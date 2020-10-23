const eventName = 'sobjectreferencechanged';

export class SObjectReferenceChangedEvent {
    constructor(value, error: string | null = null) {
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
