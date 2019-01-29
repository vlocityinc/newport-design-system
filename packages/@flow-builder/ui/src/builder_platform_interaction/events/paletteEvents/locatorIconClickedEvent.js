/**
 * Used to report a click on the locator icon in the left panel.
 */
const eventName = 'locatoriconclicked';

export class LocatorIconClickedEvent {
    constructor(elementGuid) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}