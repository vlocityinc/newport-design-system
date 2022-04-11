/**
 * Used by canvas on node mouse down
 */
const eventName = 'nodemousedown';
export class NodeMouseDownEvent extends CustomEvent<any> {
    constructor(canvasElementGUID) {
        super(eventName, {
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
