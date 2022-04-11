/**
 * Fired to close the property editor.
 */

const eventName = 'closepropertyeditor';

export class ClosePropertyEditorEvent extends CustomEvent<any> {
    constructor() {
        super(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
