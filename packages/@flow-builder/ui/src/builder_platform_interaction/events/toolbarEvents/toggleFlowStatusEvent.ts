const eventName = 'toggleflowstatus';

export class ToggleFlowStatusEvent extends CustomEvent<null> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
