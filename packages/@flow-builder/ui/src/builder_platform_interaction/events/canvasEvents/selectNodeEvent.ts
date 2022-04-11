interface SelectNodeEventDetail {
    canvasElementGUID: UI.Guid;
    isMultiSelectKeyPressed: boolean;
    isSelected: boolean;
}

/**
 * Used by canvas on node selection
 */
const eventName = 'nodeselected';
export class SelectNodeEvent extends CustomEvent<SelectNodeEventDetail> {
    constructor(canvasElementGUID, isMultiSelectKeyPressed, isSelected) {
        super(eventName, {
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
