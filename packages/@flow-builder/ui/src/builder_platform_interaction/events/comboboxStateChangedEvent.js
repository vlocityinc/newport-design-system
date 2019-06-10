/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'comboboxstatechanged';

/**
 * @typedef {Object} item same as Menu Item
 * @property {String} type  the type of menu data display type ex: option-inline
 * @property {String} text  the text that will be displayed by the combobox (can be highlighted)
 * @property {String} subtext the subtext that will displayed below the text
 * @property {String} displayText   the value displayed in the input field when this menu item is selected
 * @property {String} iconName  the icon that will be displayed next to the menu item in a dropdown list
 * @property {String} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
 * @property {Object} parent the parent flow element of the second level item in combobox shape
 * @property {String} dataType the data type for the menu item. eg: Date, Currency, SObject
 * @property {String} subtype the subtype when data type is SObject or Apex otherwise null. eg: Account, apexClass
 * @property {Boolean} isMergeField true if the displayText contains a merge field reference
 */

export class ComboboxStateChangedEvent {
    constructor(
        item = null,
        displayText = null,
        error = null,
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
