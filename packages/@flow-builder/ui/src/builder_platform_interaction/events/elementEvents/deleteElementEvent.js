/**
 * Used to delete any canvas or non-canvas element.
 */
const eventName = 'deleteelement';

export class DeleteElementEvent {
    constructor(selectedElementGUID, selectedElementType) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedElementGUID,
                selectedElementType
            }
        });
    }

    static EVENT_NAME = eventName;
}
