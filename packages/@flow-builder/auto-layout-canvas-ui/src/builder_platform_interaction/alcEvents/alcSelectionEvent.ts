// @ts-nocheck
/**
 * Used by fixed layout canvas to support selection mode.
 */

const eventName = 'alcselection';

export class AlcSelectionEvent {
    constructor(
        canvasElementGuidsToSelect,
        canvasElementGuidsToDeselect,
        selectableGuids,
        topSelectedGuid,
        allowAllDisabledElements = false
    ) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                topSelectedGuid,
                allowAllDisabledElements
            }
        });
    }
}
