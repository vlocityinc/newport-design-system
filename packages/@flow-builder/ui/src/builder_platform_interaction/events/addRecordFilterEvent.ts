const eventName = 'addrecordfilter';

export class AddRecordFilterEvent extends CustomEvent<any> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
