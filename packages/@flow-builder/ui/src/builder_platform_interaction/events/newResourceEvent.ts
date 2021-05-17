// @ts-nocheck
/**
 * Fired to open the new resource panel.
 */

const eventName = 'addnewresource';

export class NewResourceEvent {
    constructor(position = null, viaLeftPanel = false, newResourceInfo = null) {
        return new CustomEvent(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                position,
                viaLeftPanel,
                newResourceInfo
            }
        });
    }

    static EVENT_NAME = eventName;
}
