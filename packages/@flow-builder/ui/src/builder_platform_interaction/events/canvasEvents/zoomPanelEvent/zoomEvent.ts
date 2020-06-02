/**
 * Used by zoom panel to zoom in or out of the canvas
 */
const eventName = 'clicktozoom';

interface CustomEventDetail {
    action: string;
}

export class ClickToZoomEvent extends CustomEvent<CustomEventDetail> {
    constructor(action: string) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                action
            }
        });
    }

    static EVENT_NAME = eventName;
}
