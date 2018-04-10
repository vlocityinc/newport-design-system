const eventName = 'updateparameteritem';

export class UpdateParameterItemEvent extends Event {
    constructor(isInput, index, value = null, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            isInput,
            index,
            value,
            error
        };
    }

    static EVENT_NAME = eventName;
}