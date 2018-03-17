/**
 * Used by combobox to indicate that updated menu data is needed
 */
const eventName = 'fetchmenudata';

export class FetchMenuDataEvent extends Event {
    constructor(propertyName = null, value = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.propertyName = propertyName;
        this.value = value;
    }

    static EVENT_NAME = eventName;
}
