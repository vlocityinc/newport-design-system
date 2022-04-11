/**
 * Used to report a click action on a Delete Resource.
 */
const eventName = 'deleteresource';

export class DeleteResourceEvent extends CustomEvent<any> {
    constructor(selectedElementGUID, selectedElementType) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                selectedElementGUID,
                selectedElementType
            }
        });
    }

    static EVENT_NAME = eventName;
}
