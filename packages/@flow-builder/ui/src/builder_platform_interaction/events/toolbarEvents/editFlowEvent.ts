const eventName = 'editflow';

export class EditFlowEvent extends CustomEvent<{}> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {}
        });
    }

    static EVENT_NAME = eventName;
}
