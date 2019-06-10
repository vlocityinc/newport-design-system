/**
 * Used to allow selection on the visual picker
 */
const eventName = 'visualpickerlistchanged';

export class VisualPickerListChangedEvent {
    constructor(items) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                items
            }
        });
    }

    static EVENT_NAME = eventName;
}
