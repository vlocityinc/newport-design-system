/**
 * Used to report a click action on a chevron palette item.
 */
const eventName = 'paletteitemchevronclicked';

export class PaletteItemChevronClickedEvent {
    constructor(elementGUID, iconName) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGUID,
                iconName,
            }
        });
    }

    static EVENT_NAME = eventName;
}