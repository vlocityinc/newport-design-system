const eventName = 'resumedebugflow';
export class ResumeDebugFlowEvent extends CustomEvent<{}> {
    constructor(waitEventName = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                waitEventName
            }
        });
    }

    static EVENT_NAME = eventName;
}
