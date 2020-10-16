import { MenuItem } from 'builder_platform_interaction/autoLayoutCanvas';
/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'comboboxstatechanged';

/**
 * @typedef {MenuItem} item the newly selected menu item
 * @property {String} displayText   the value displayed in the input field when this menu item is selected
 * @property {String} error  the error message if the combobox is on error, null otherwise
 * @property {Boolean} isMergeField true if the displayText contains a merge field reference, false otherwise
 */

export class ComboboxStateChangedEvent {
    constructor(
        item: MenuItem | null,
        displayText: string | null = null,
        error: string | null = null,
        isMergeField = false
    ) {
        return new CustomEvent(eventName, {
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
