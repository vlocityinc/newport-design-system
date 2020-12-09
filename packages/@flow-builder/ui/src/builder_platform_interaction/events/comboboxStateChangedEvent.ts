/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'comboboxstatechanged';

type ComboboxStateChangedEventDetail = {
    item: UI.ComboboxItem | null;
    displayText: string | null;
    error: string | null;
    isMergeField: boolean;
};

export class ComboboxStateChangedEvent extends CustomEvent<ComboboxStateChangedEventDetail> {
    constructor(
        item: UI.ComboboxItem | null,
        displayText: string | null = null,
        error: string | null = null,
        isMergeField = false
    ) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,

            detail: {
                item,
                displayText,
                error,
                isMergeField
            }
        });
    }

    static EVENT_NAME = eventName;
}
