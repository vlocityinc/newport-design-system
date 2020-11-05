const eventName = 'collectionreferencechanged';

export class CollectionReferenceChangedEvent {
    constructor(value: string | null, error: string | null) {
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
