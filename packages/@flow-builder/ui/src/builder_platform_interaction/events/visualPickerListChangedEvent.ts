/**
 * Used to allow selection on the visual picker
 */
const eventName = 'visualpickerlistchanged';

export class VisualPickerListChangedEvent extends CustomEvent<any> {
    constructor(items) {
        super(eventName, {
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
