/**
 * Used to report a click on the locator icon in the left panel.
 */
const eventName = 'locatoriconclicked';

interface LocatorIconClickedEventDetail {
    elementGuid: UI.Guid;
}
export class LocatorIconClickedEvent extends CustomEvent<LocatorIconClickedEventDetail> {
    constructor(elementGuid) {
        super(eventName, {
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
