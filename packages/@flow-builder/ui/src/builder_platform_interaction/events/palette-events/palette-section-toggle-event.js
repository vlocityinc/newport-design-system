/**
 * Used to report a toggle action from palette sections.
 */
const eventName = 'palettesectiontoggle';


export class PaletteSectionToggleEvent {
    constructor(expanded, sectionKey) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                expanded,
                sectionKey

            }
        });
    }

    static EVENT_NAME = eventName;
}