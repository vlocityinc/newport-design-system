const eventName = 'deleteparameteritem';

export class DeleteParameterItemEvent {
    constructor(parameterName) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parameterName
            }
        });
    }

    static EVENT_NAME = eventName;
}