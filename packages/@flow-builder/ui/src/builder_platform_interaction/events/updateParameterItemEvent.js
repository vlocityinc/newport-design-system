const eventName = 'updateparameteritem';

export class UpdateParameterItemEvent {
    constructor(isInput, name, value = null, valueDataType = null, error = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isInput,
                name,
                value,
                valueDataType,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}