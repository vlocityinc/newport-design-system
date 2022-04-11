/**
 * Used to report a click action on a palette item.
 */
const eventName = 'paletteitemclicked';

export class PaletteItemClickedEvent extends CustomEvent<any> {
    constructor(elementType, guid, elementSubtype = null) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                elementType,
                guid,
                elementSubtype
            }
        });
    }

    static EVENT_NAME = eventName;
}
