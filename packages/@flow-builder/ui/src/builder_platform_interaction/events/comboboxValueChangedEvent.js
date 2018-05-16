/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'comboboxvaluechanged';

export class ComboboxValueChangedEvent extends Event {
    constructor(item = null, displayText = null, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        /**
         * @typedef {Object} item same as Menu Item
         * @property {String} type  the type of menu data display type ex: option-inline
         * @property {String} text  the text that will be displayed by the combobox (can be highlighted)
         * @property {String} subtext the subtext that will displayed below the text
         * @property {String} displayText   the value displayed in the input field when this menu item is selected
         * @property {String} iconName  the icon that will be displayed next to the menu item in a dropdown list
         * @property {String} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
         * @property {String} id the id of the combobox TODO: this will be removed in another CL)
         */

        this.detail = {
            item,
            displayText,
            error
        };
    }

    static EVENT_NAME = eventName;
}