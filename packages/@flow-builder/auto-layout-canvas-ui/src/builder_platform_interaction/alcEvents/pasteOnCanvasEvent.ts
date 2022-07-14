import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'pasteoncanvas';

export interface PasteOnCanvasOptions {
    childIndexToKeep?: number;
    isCutPaste: boolean;
}

const pasteOnCanvasOptionDefault = {
    childIndexToKeep: undefined,
    isCutPaste: false
};
interface PasteOnCanvasEventDetail {
    // can be undefined if the source is invalid (eg no-op)
    source: ConnectionSource | undefined;
    options: Partial<PasteOnCanvasOptions>;
}

export class PasteOnCanvasEvent extends CustomEvent<PasteOnCanvasEventDetail> {
    constructor(source: ConnectionSource | undefined, options: Partial<PasteOnCanvasOptions> = {}) {
        const { childIndexToKeep, isCutPaste } = { ...pasteOnCanvasOptionDefault, ...options };
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                source,
                options: { childIndexToKeep, isCutPaste }
            }
        });
    }

    static EVENT_NAME = eventName;
}
