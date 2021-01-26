/**
 * Used to open an empty property editor for the given element type
 */
const eventName = 'addelement';
interface AddElementEventDetail {
    elementType: string;
    elementSubtype?: string;
    locationX?: 0;
    locationY?: 0;
    actionType?: string;
    actionName?: string;
    parent?: string;
    // insertion information for the alc when adding an element
    alcInsertAt?: object;
}
export class AddElementEvent extends CustomEvent<AddElementEventDetail> {
    constructor(detail: AddElementEventDetail) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
