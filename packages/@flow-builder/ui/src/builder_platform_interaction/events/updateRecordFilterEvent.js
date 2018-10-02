const eventName = 'updaterecordfilter';


export class UpdateRecordFilterEvent {
    constructor(index, value) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                index,
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}