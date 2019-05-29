/**
 * Fired to show the resource details.
 */
const eventName = 'showresourcedetails';

export class ShowResourceDetailsEvent {
    constructor(elementGUID, canvasElement) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGUID,
                canvasElement,
            }
        });
    }

    static EVENT_NAME = eventName;
}