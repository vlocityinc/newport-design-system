/**
 * Used to open an empty property editor for the given element type.
 */
const eventName = 'addelement';

export class AddElementEvent {
    constructor(elementType, locationX = 0, locationY = 0) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementType,
                locationX,
                locationY
            }
        });
    }

    static EVENT_NAME = eventName;
}
