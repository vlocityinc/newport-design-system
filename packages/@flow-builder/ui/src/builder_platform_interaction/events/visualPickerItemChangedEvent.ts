/**
 * Used to report a click action on a visual picker item.
 */
const eventName = 'visualpickeritemchanged';

export class VisualPickerItemChangedEvent extends CustomEvent<any> {
    constructor(id, isSelected) {
        super(eventName, {
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
