/**
 * Fired by the combobox to get a filtered menu data based on value
 */
const eventName = 'filtermatches';

export class FilterMatchesEvent extends CustomEvent<any> {
    constructor(value: string | null = null, isMergeField = false) {
        super(eventName, {
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
