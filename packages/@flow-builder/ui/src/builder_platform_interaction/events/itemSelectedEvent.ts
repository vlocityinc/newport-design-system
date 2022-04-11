/**
 * Used by components to indicate that it's value has changed
 */

const eventName = 'itemselected';
type ItemSelectedEventDetail = {
    displayText?: string;
    item: UI.HydratedValue;
};
export class ItemSelectedEvent extends CustomEvent<ItemSelectedEventDetail> {
    constructor(item: UI.HydratedValue) {
        super(eventName, {
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
