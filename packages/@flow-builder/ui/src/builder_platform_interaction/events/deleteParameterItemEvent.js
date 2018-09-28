const eventName = 'deleteparameteritem';

export class DeleteParameterItemEvent {
    constructor(isInput, name) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isInput,
                name
            }
        });
    }

    static EVENT_NAME = eventName;
}