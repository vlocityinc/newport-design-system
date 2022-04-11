/**
 * Used to open an empty property editor for the given element type.
 */
const eventName = 'addnoncanvaselement';

export class AddNonCanvasElementEvent extends CustomEvent<any> {
    constructor(elementType) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementType
            }
        });
    }

    static EVENT_NAME = eventName;
}
