/**
 * Fired to show the resource details.
 */
const eventName = 'showresourcedetails';

export class ShowResourceDetailsEvent extends CustomEvent<any> {
    constructor(elementGUID, canvasElement) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGUID,
                canvasElement
            }
        });
    }

    static EVENT_NAME = eventName;
}
