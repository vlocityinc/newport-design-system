import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Used by fixed canvas on node selection/deselection
 */
const eventName = 'alcselectdeselectnode';

interface AlcSelectDeselectNodeEventDetail {
    canvasElementGUID: Guid;
    isSelected: boolean;
}
export class AlcSelectDeselectNodeEvent extends CustomEvent<AlcSelectDeselectNodeEventDetail> {
    constructor(canvasElementGUID: Guid, isSelected: boolean) {
        super(eventName, {
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
