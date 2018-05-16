/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'itemselected';

export class ItemSelectedEvent extends Event {
    constructor(item = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            item
        };
    }

    static EVENT_NAME = eventName;
}