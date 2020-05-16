// @ts-nocheck
/**
 * Used by canvas on node selection
 */
const eventName = 'nodeselected';
export class SelectNodeEvent {
    constructor(canvasElementGUID, isMultiSelectKeyPressed, isSelected) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                isMultiSelectKeyPressed,
                isSelected
            }
        });
    }
    static EVENT_NAME = eventName;
}
