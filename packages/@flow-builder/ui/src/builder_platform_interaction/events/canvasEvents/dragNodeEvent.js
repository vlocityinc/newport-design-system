/**
 * Used by canvas on drag node
 */
const eventName = 'dragnode';
export class DragNodeEvent {
    constructor(canvasElementGUID, locationX, locationY) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                locationX,
                locationY
            }
        });
    }
    static EVENT_NAME = eventName;
}
