const eventName = 'deleteparameteritem';

export class DeleteParameterItemEvent extends CustomEvent<any> {
    constructor(isInput, rowIndex, name) {
        super(eventName, {
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
