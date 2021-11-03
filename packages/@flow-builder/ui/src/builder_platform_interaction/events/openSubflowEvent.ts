import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';
/**
 * Used to open a subflow from alc node menu.
 */
const eventName = 'opensubflow';

interface OpenSubflowEventDetail {
    guid: Guid;
}

export class OpenSubflowEvent extends CustomEvent<OpenSubflowEventDetail> {
    constructor(guid: string) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid
            }
        });
    }

    static EVENT_NAME = eventName;
}
