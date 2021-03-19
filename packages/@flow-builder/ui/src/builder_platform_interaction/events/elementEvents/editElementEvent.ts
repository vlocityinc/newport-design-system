// @ts-nocheck
/**
 * Used to open a property editor for the given element.
 */
const eventName = 'editelement';

export class EditElementEvent {
    constructor(canvasElementGUID, mode = eventName, elementType?: string) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                mode,
                elementType
            }
        });
    }

    static EVENT_NAME = eventName;
}
