/**
 * Fired by the combobox to get a filtered menu data based on value
 */
const eventName = 'filtermatches';

export class FilterMatchesEvent {
    constructor(value = null, isMergeField = false) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                isMergeField
            }
        });
    }

    static EVENT_NAME = eventName;
}
