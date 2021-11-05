/**
 * Used to report a click action on a chevron palette item.
 */
const eventName = 'paletteitemchevronclicked';

interface PaletteItemChevronClickedEventDetail {
    elementGUID: UI.Guid;
    iconName: string;
}
export class PaletteItemChevronClickedEvent extends CustomEvent<PaletteItemChevronClickedEventDetail> {
    constructor(elementGUID, iconName) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementGUID,
                iconName
            }
        });
    }

    static EVENT_NAME = eventName;
}
