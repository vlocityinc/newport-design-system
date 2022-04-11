/**
 * Fired to set the title for the property editor.
 */

const eventName = 'setpropertyeditortitle';

export class SetPropertyEditorTitleEvent extends CustomEvent<any> {
    constructor(title) {
        super(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                title
            }
        });
    }

    static EVENT_NAME = eventName;
}
