const eventName = 'updatecollectionprocessor';

export class UpdateCollectionProcessorEvent extends CustomEvent<any> {
    constructor(element: object) {
        super(eventName, {
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
