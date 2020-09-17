import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'noderesize';

interface NodeResizeEventDetail {
    guid: Guid;
    width: number;
    height: number;
}

export class NodeResizeEvent extends CustomEvent<NodeResizeEventDetail> {
    constructor(guid: Guid, width: number, height: number) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid,
                width,
                height
            }
        });
    }

    static EVENT_NAME = eventName;
}
