/**
 * Used by fixed canvas on node selection/deselection
 */
const eventName = 'flcselectdeselectnode';
export class FlcSelectDeselectNodeEvent {
    constructor(canvasElementGUID, isSelected) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                isSelected
            }
        });
    }
    static EVENT_NAME = eventName;
}
