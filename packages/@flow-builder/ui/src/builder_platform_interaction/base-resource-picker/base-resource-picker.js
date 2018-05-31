import { Element, api, track } from 'engine';
import { filterMatches } from 'builder_platform_interaction-expression-utils';

/**
 * The base resource picker that contains one flow combobox
 * This class holds the full menu data, fitlered menu data and handles the events comboboox value changed & filter matches
 * All wrapper classes will have to implement their own logic for retrieving full menu data
 */
export default class BaseResourcePicker extends Element {
    /**
     * The full menu data available for selection
     * @type {Object[]}
     */
    _fullMenuData;

    /**
     * the actual value of the combobox item (contains text, value, and id)
     * @typedef {Object} item
     * @property {String} type  the type of menu data display type ex: option-inline
     * @property {String} text  the text that will be displayed by the combobox (can be highlighted)
     * @property {String} subtext the subtext that will displayed below the text
     * @property {String} displayText   the value displayed in the input field when this menu item is selected
     * @property {String} iconName  the icon that will be displayed next to the menu item in a dropdown list
     * @property {String} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
    */

    /**
     * the state of the resource picker containing the current item, displayText, and the menu data
     * @typedef {Object} resourcePickerState
     * @property {Object[]} menuData    the current menu data held by the combobox, not necessarily the full menu data
     * @property {item} item            the currently selected menu item
     * @property {String} displayText   the display text shown in the combobox field
     * @property {ComboboxConfig}       the combobox config object
     */
    @track
    state = {};

    /**
     * The configuration object that contains the api properties of a flow combobox
     * @typedef {Object} ComboboxConfig
     * @property {String} label the flow combobox label
     * @property {String} placeholder the flow combobox placeholder
     * @property {String} errorMessage the error message to be displayed on error
     * @property {String} literalsAllowed Pass the string 'true' if literals are allowed 'false' otherwise
     * @property {Boolean} required true if required field, false otherwise
     * @property {Boolean} disabled true if disabled field, false otherwise
     * @property {String} type the data type of the flow combobox, needed for validation
     */

    /**
     * Object with properties used to configure the flow combobox
     * @param {ComboboxConfig} config the combobox config objec t used to initialize the resource picker's combobox
     */
    @api
    set comboboxConfig(config) {
        this.state.config = config;
    }

    @api
    get comboboxConfig() {
        return this.state.config;
    }

    /**
     * Sets the value of the flow combobox
     * Use this when you have a flow combobox menu item to display
     * @param {item} item the menu item being set to the flow combobox
     */
    @api
    set value(item) {
        this.state.item = item;
    }

    @api
    get value() {
        return this.state.item;
    }

    /**
     * Sets the display text for the flow combobox
     * Use this when you want to display a literal/merge field
     * @param {String} displayText the given display text to show in combobox input field
     */
    @api
    set displayText(displayText) {
        this.state.displayText = displayText;
    }

    @api
    get displayText() {
        return this.state.displayText;
    }

    /**
     * Sets the full menu data for the resource picker
     * This method should be called by the wrapper components when they want
     * to set the full menu data for the resource picker
     * @param {Object[]} newMenuData the full menu data
     */
    @api
    setMenuData(newMenuData) {
        this._fullMenuData = newMenuData;
        this.state.menuData = this._fullMenuData;
    }

    /**
     * Creates a ComboboxConfig object from the given params
     * @param {String} label the flow combobox label
     * @param {String} placeholder the flow combobox placeholder
     * @param {String} errorMessage the error message to be displayed on error
     * @param {String} literalsAllowed Pass the string 'false' if literals are NOT allowed, defaults to 'true'
     * @param {Boolean} required true if required field, false otherwise
     * @param {Boolean} disabled true if disabled field, false otherwise
     * @param {String} type the data type of the flow combobox, needed for validation
     * @returns {ComboboxConfig} The combobox config object
     */
    static getComboboxConfig = (
        label,
        placeholder,
        errorMessage,
        literalsAllowed,
        required,
        disabled,
        type
    ) => {
        return {
            label,
            placeholder,
            errorMessage,
            literalsAllowed,
            required,
            disabled,
            type
        };
    };

    /** EVENT HANDLERS */

    handleFilterMatches(event) {
        event.stopPropagation();
        this.state.menuData = filterMatches(event.detail.value, this._fullMenuData);
    }
}