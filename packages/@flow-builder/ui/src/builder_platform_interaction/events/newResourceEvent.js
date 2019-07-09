/**
 * Fired to open the new resource panel.
 */

const eventName = 'addnewresource';

export class NewResourceEvent {
    constructor(position = null) {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                position
            }
        });
    }

    static EVENT_NAME = eventName;
}
