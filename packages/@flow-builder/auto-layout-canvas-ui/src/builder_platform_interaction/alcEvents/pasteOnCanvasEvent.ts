import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'pasteoncanvas';

interface PasteOnCanvasEventDetail {
    source: ConnectionSource;
}

export class PasteOnCanvasEvent extends CustomEvent<PasteOnCanvasEventDetail> {
    constructor(source: ConnectionSource) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                source
            }
        });
    }

    static EVENT_NAME = eventName;
}
