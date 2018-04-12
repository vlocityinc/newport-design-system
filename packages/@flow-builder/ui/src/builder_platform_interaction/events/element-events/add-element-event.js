/**
 * Used to open an empty property editor for the given element type.
 */
const eventName = 'addelement';

export class AddElementEvent extends Event {
    constructor(elementType, locationX = 0, locationY = 0) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.detail = {
            elementType,
            locationX,
            locationY
        };
    }

    static EVENT_NAME = eventName;
}