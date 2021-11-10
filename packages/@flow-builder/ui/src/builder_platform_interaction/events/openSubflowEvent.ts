/**
 * Used to open a subflow from alc node menu.
 */
const eventName = 'opensubflow';

interface OpenSubflowEventDetail {
    flowName: string;
}

export class OpenSubflowEvent extends CustomEvent<OpenSubflowEventDetail> {
    constructor(flowName: string) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                flowName
            }
        });
    }

    static EVENT_NAME = eventName;
}
