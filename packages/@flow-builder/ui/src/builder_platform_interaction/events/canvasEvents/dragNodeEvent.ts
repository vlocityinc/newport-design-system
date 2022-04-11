/**
 * Used by canvas on drag node
 */
const eventName = 'dragnode';
export class DragNodeEvent extends CustomEvent<any> {
    constructor(canvasElementGUID, locationX, locationY) {
        super(eventName, {
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
