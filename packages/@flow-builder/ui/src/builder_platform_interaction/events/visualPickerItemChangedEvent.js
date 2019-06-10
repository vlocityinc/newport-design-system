/**
 * Used to report a click action on a visual picker item.
 */
const eventName = 'visualpickeritemchanged';

export class VisualPickerItemChangedEvent {
    constructor(id, isSelected) {
        return new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                id,
                isSelected
            }
        });
    }

    static EVENT_NAME = eventName;
}
