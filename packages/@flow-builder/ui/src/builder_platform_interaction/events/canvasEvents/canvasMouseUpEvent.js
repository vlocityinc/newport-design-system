/**
 * Used by canvas on mouse up
 */
const eventName = 'canvasmouseup';

export class CanvasMouseUpEvent {
    constructor() {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
    }

    static EVENT_NAME = eventName;
}
