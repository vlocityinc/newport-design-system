/**
 * Used to report a toggle action from palette sections.
 */
const eventName = 'palettesectiontoggle';

export class PaletteSectionToggleEvent extends Event {
    constructor(expanded, sectionKey) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.detail = {
            expanded,
            sectionKey
        };
    }

    static EVENT_NAME = eventName;
}