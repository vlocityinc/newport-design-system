// @ts-nocheck
const eventName = 'restartdebugflow';

export class RestartDebugFlowEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
