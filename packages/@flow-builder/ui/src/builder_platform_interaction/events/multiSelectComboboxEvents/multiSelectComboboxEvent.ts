// @ts-nocheck
/**
 * Used to report on multi select combobox selections
 */
const eventName = 'comboboxselection';

export class MultiSelectComboboxEvent {
    constructor(selection = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                selection
            }
        });
    }

    static EVENT_NAME = eventName;
}
