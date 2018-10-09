const eventName = 'updateparameteritem';

export class UpdateParameterItemEvent {
    constructor(isInput, rowIndex, name, value = null, valueDataType = null, error = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isInput,
                rowIndex,
                name,
                value,
                valueDataType,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}