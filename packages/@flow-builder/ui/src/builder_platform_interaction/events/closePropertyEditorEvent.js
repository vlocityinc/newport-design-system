/**
 * Fired to close the property editor.
 */

const eventName = 'closepropertyeditor';

export class ClosePropertyEditorEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
