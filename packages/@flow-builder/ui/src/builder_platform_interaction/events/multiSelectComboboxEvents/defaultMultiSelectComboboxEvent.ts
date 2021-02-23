// @ts-nocheck
/**
 * Used to report that a default multi select combobox selection has been made
 */
const eventName = 'defaultcomboboxselection';

export class DefaultMultiSelectComboboxEvent {
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
