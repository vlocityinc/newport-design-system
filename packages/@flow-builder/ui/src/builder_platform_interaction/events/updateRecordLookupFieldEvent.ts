const eventName = 'updaterecordlookupfield';

export class UpdateRecordLookupFieldEvent extends CustomEvent<any> {
    constructor(index, value, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index,
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}
