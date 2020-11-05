const eventName = 'updatecollectionprocessor';

export class UpdateCollectionProcessorEvent {
    constructor(element: object) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                element
            }
        });
    }

    static EVENT_NAME = eventName;
}
