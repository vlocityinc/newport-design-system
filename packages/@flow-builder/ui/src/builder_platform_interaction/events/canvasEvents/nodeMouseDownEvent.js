/**
 * Used by canvas on node mouse down
 */
const eventName = 'nodemousedown';
export class NodeMouseDownEvent {
    constructor(canvasElementGUID) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID
            }
        });
    }
    static EVENT_NAME = eventName;
}
