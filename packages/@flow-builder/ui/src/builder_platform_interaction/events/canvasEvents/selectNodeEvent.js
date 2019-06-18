/**
 * Used by canvas on node selection
 */
const eventName = 'nodeselected';
export class SelectNodeEvent {
    constructor(canvasElementGUID, isMultiSelectKeyPressed) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                isMultiSelectKeyPressed
            }
        });
    }
    static EVENT_NAME = eventName;
}
