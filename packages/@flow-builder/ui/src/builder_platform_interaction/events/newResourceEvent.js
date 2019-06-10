/**
 * Fired to open the new resource panel.
 */

const eventName = 'addnewresource';

export class NewResourceEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
