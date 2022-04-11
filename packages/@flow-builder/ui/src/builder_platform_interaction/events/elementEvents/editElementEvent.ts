/**
 * Used to open a property editor for the given element.
 */
const eventName = 'editelement';

export class EditElementEvent extends CustomEvent<any> {
    constructor(canvasElementGUID, mode = eventName, elementType?: string, designateFocus?: boolean) {
        super(eventName, {
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
