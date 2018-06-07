const eventName = 'updateparameteritem';


export class UpdateParameterItemEvent {
    constructor(isInput, index, value = null, error = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isInput,
                index,
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}