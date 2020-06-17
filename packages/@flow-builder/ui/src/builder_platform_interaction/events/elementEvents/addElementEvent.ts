/**
 * Used to open an empty property editor for the given element type
 */
const eventName = 'addelement';
interface AddElementEventDetail {
    elementType: string;
    elementSubtype?: string;
    locationX: 0;
    locationY: 0;
    actionType?: string;
    actionName?: string;
    prev?: string;
    next?: string;
    parent?: string;
    childIndex?: number;
}
export class AddElementEvent extends CustomEvent<AddElementEventDetail> {
    constructor(detail) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
