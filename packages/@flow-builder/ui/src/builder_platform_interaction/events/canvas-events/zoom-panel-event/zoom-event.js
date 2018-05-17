/**
 * Used by zoom panel to zoom in or out of the canvas
 */
const eventName = 'clicktozoom';

export class ClickToZoomEvent extends Event {
    constructor(action = null) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });

        this.detail = {
            action
        };
    }

    static EVENT_NAME = eventName;
}