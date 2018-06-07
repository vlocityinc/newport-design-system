/**
 * Used to report a click action on a palette item.
 */
const eventName = 'paletteitemclicked';


export class PaletteItemClickedEvent {
    constructor(elementType, guid) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementType,
                guid

            }
        });
    }

    static EVENT_NAME = eventName;
}