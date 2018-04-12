/**
 * Used to report a click action on a palette item.
 */
const eventName = 'paletteitemclicked';

export class PaletteItemClickedEvent extends Event {
    constructor(elementType, guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.detail = {
            elementType,
            guid
        };
    }

    static EVENT_NAME = eventName;
}