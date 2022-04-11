/**
 * Used to open an empty property editor for the given element type.
 */
const eventName = 'toggleelement';
export class ToggleElementEvent extends CustomEvent<any> {
    constructor(guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid
            }
        });
    }

    static EVENT_NAME = eventName;
}
