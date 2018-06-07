/**
 * Used to report a click action on a chevron palette item.
 */
const eventName = 'paletteitemchevronclicked';


export class PaletteItemChevronClickedEvent {
    constructor(elementType, elementGUID, label, iconName, description) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementType,
                elementGUID,
                label,
                iconName,
                description

            }
        });
    }

    static EVENT_NAME = eventName;
}