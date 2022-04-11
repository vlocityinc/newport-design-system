/**
 * Used by canvas on mouse up
 */
const eventName = 'canvasmouseup';

export class CanvasMouseUpEvent extends CustomEvent<null> {
    constructor() {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
    }

    static EVENT_NAME = eventName;
}
