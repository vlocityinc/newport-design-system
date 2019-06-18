/**
 * Used by canvas on drag node stop
 */
const eventName = 'dragnodestop';
export class DragNodeStopEvent {
    constructor(canvasElementGUID, elementType, locationX, locationY) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                elementType,
                locationX,
                locationY
            }
        });
    }
    static EVENT_NAME = eventName;
}
