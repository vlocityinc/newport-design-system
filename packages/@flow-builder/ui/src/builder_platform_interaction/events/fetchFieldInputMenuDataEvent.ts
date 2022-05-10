/**
 * Used by field input menu to indicate that updated field input menu data is needed
 */
const eventName = 'fetchfieldinputmenudata';

interface FetchFieldInputMenuDataEventDetail {
    item: string;
}

export class FetchFieldInputMenuDataEvent extends CustomEvent<FetchFieldInputMenuDataEventDetail> {
    /**
     * @param item - The data value of the menu item
     */
    constructor(item) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                item
            }
        });
    }

    static EVENT_NAME = eventName;
}
