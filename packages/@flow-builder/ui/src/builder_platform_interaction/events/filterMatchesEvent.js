/**
 * Fired by the combobox to get a filtered menu data based on value
 */
const eventName = 'filtermatches';

export class FilterMatchesEvent extends Event {
    constructor(value = null, isMergeField = false) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail =  {
            value,
            isMergeField
        };
    }

    static EVENT_NAME = eventName;
}