/**
 * Used by fixed layout canvas to support selection mode.
 */

const eventName = 'flcselection';

export class FlcSelectionEvent {
    constructor(canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids, topSelectedGuid) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                topSelectedGuid
            }
        });
    }
}
