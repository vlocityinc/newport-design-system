/**
 * Used by combobox to indicate that updated menu data is needed
 */
const eventName = 'fetchmenudata';

export class FetchMenuDataEvent {
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
