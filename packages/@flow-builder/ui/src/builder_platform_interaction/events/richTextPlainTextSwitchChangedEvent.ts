const eventName = 'richtextplaintextswitchchanged';

/**
 * Class representing an Event dispatched when switching between rich text and plain text mode
 */
export class RichTextPlainTextSwitchChangedEvent extends CustomEvent<any> {
    /**
     * Create the event.
     *
     * @param isPlainText - Switched to plain text mode
     */
    constructor(isPlainText: boolean) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                isPlainText
            }
        });
    }

    static EVENT_NAME = eventName;
}
