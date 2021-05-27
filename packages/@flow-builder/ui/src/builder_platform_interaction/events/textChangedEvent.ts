/**
 * Fired by the combobox when the user enters text into the combobox
 */
const eventName = 'textchanged';

export class TextChangedEvent {
    constructor(text: string | null = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                text
            }
        });
    }

    static EVENT_NAME = eventName;
}
