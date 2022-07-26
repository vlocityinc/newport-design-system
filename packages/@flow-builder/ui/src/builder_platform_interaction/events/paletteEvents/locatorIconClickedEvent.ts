import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';
/**
 * Used to report a click on the locator icon in the left panel.
 */
const eventName = 'locatoriconclicked';

type LocatorIconClickedEventDetail = ConnectionSource & { highlightGoToSource };
export class LocatorIconClickedEvent extends CustomEvent<LocatorIconClickedEventDetail> {
    constructor(guid, childIndex = null, highlightGoToSource = false) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid,
                childIndex,
                highlightGoToSource
            }
        });
    }

    static EVENT_NAME = eventName;
}
