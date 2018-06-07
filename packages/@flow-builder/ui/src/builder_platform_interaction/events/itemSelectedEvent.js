/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'itemselected';


export class ItemSelectedEvent {
    constructor(item = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                item
            }
        });
    }

    static EVENT_NAME = eventName;
}