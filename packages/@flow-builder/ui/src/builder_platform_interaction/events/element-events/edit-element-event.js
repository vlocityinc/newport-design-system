/**
 * Used to open a property editor for the given element.
 */
const eventName = 'editelement';

export class EditElementEvent extends Event {
    constructor(canvasElementGUID) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.detail = {
            canvasElementGUID
        };
    }

    static EVENT_NAME = eventName;
}