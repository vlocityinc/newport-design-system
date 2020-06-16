// @ts-nocheck
const eventName = 'newdebugflow';

export class NewDebugFlowEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
