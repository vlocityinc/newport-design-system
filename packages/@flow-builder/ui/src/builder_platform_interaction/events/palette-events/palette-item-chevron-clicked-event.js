/**
 * Used to report a click action on a chevron palette item.
 */
const eventName = 'paletteitemchevronclicked';

export class PaletteItemChevronClickedEvent extends Event {
    constructor(elementType, elementGUID, label, iconName, description) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.detail = {
            elementType,
            elementGUID,
            label,
            iconName,
            description
        };
    }

    static EVENT_NAME = eventName;
}