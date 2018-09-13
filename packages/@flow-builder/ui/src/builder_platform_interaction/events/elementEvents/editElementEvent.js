/**
 * Used to open a property editor for the given element.
 */
const eventName = 'editelement';

export class EditElementEvent {
    constructor(canvasElementGUID) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                canvasElementGUID
            }
        });
    }

    static EVENT_NAME = eventName;
}