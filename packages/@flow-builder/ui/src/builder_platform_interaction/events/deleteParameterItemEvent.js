const eventName = 'deleteparameteritem';

export class DeleteParameterItemEvent {
    constructor(isInput, rowIndex, name) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                rowIndex,
                isInput,
                name
            }
        });
    }

    static EVENT_NAME = eventName;
}