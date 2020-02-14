/**
 * Used to open an empty property editor for the given element type.
 */
const eventName = 'addelement';
export class AddElementEvent extends CustomEvent {
    constructor(elementType, locationX = 0, locationY = 0, prev, next, parent, childIndex) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementType,
                locationX,
                locationY,
                prev,
                next,
                parent,
                childIndex
            }
        });
    }

    static EVENT_NAME = eventName;
}
