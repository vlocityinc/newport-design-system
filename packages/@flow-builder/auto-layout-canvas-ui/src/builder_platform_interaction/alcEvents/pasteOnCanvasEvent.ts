import { NodeRef } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'pasteoncanvas';

interface PasteOnCanvasEventDetail {
    prev: NodeRef;
    next: NodeRef;
    parent: NodeRef;
    childIndex: number;
}

export class PasteOnCanvasEvent extends CustomEvent<PasteOnCanvasEventDetail> {
    constructor(prev: NodeRef, next: NodeRef, parent: NodeRef, childIndex: number) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                prev,
                next,
                parent,
                childIndex
            }
        });
    }

    static EVENT_NAME = eventName;
}
