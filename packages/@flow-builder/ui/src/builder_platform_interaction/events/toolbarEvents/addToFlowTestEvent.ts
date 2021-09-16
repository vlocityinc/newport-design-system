const eventName = 'addtoflowtest';
export class AddToFlowTestEvent extends CustomEvent<{}> {
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
