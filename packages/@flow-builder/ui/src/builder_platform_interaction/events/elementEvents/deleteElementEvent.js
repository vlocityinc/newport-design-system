// @ts-nocheck
/**
 * Used to delete any canvas or non-canvas element.
 */
const eventName = 'deleteelement';

export class DeleteElementEvent {
    constructor(selectedElementGUID, selectedElementType, childIndexToKeep) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedElementGUID,
                selectedElementType,
                childIndexToKeep
            }
        });
    }

    static EVENT_NAME = eventName;
}
