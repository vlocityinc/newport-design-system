// @ts-nocheck
/**
 * Used to open a property editor for the given element.
 */
const eventName = 'editelement';

export class EditElementEvent {
    constructor(canvasElementGUID, mode = eventName, elementType?: string, designateFocus?: boolean) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID,
                mode,
                elementType,
                designateFocus
            }
        });
    }

    static EVENT_NAME = eventName;
}
