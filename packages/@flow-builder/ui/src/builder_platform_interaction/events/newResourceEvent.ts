// @ts-nocheck
/**
 * Fired to open the new resource panel.
 */

const eventName = 'addnewresource';

export class NewResourceEvent {
    constructor(position = null, viaLeftPanel = false) {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                position,
                viaLeftPanel
            }
        });
    }

    static EVENT_NAME = eventName;
}
