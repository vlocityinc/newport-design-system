const eventName = 'richtextplaintextswitchchanged';

/**
 * Class representing an Event dispatched when switching between rich text and plain text mode
 */
export class RichTextPlainTextSwitchChangedEvent extends Event {
    /**
     * Create the event.
     * @param {boolean} isPlainText - Switched to plain text mode
     */
    constructor(isPlainText) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
        this.detail = {
            isPlainText
        };
    }

    static EVENT_NAME = eventName;
}
