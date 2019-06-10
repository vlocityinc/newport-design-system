/**
 * Used by zoom panel to zoom in or out of the canvas
 */
const eventName = 'clicktozoom';

export class ClickToZoomEvent {
    constructor(action = null) {
        return new CustomEvent(eventName, {
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
