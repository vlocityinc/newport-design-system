import { NodeRef } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'paste';

interface PasteEventDetail {
    prev: NodeRef;
    next: NodeRef;
    parent: NodeRef;
    childIndex: number;
}

export class PasteEvent extends CustomEvent<PasteEventDetail> {
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
