import Combobox from 'builder_platform_interaction/combobox';
import { isUndefinedOrNull, sanitizeBoolean } from 'builder_platform_interaction/commonUtils';
import { TextChangedEvent } from 'builder_platform_interaction/events';
import { filterMatches } from 'builder_platform_interaction/expressionUtils';
import { saveResourcePicker } from 'builder_platform_interaction/expressionValidator';
import { isCollectionRequired } from 'builder_platform_interaction/ruleLib';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import { api, LightningElement, track } from 'lwc';

/**
 * The base resource picker that contains one flow combobox
 * This class holds the full menu data, filtered menu data and handles the events combobox value changed & filter matches
 * All wrapper classes will have to implement their own logic for retrieving full menu data
 */

export default class BaseResourcePicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-base-resource-picker';

    /**
     * Custom error message from setCustomValidity
     */
    @track
    _customValidity;

    @api
    inlineItem = null;

    @api
    elementType = null;

    /**
     * the actual value of the combobox item (contains text, value, and id)
     *
     * @typedef {Object} item
     * @property {string} type  the type of menu data display type ex: option-inline
     * @property {string} text  the text that will be displayed by the combobox (can be highlighted)
     * @property {string} subtext the subtext that will displayed below the text
     * @property {string} displayText   the value displayed in the input field when this menu item is selected
     * @property {string} iconName  the icon that will be displayed next to the menu item in a dropdown list
     * @property {string} value the id or api name of the value stored by the flow combobox. This is what we want to put in store/events
     */

    /**
     * the state of the resource picker containing the current item, displayText, and the menu data
     *
     * @typedef {Object} resourcePickerState
     * @property {Object[]} menuData    the current menu data held by the combobox, not necessarily the full menu data
     */
    @track
    state: { renderIncrementally: boolean; menuData: Object[] | undefined } = {
        renderIncrementally: false,
        menuData: undefined
    };

    /**
     * Object with properties used to configure the flow combobox
     */
    @api
    comboboxConfig: ComboboxConfig = {};

    @api
    placeholder;

    @api
    showActivityIndicator = false;
    _rowIndex: any;

    /**
     * Custom error message to display
     *
     * @param {string} message - The error message
     */
    @api
    setCustomValidity(message) {
        this._customValidity = message;
    }

    set errorMessage(error) {
        this.setCustomValidity(error);
    }

    @api
    get errorMessage() {
        return this._customValidity;
    }

    @api
    focus(): void {
        const labelDescription = this.template.querySelector(Combobox.SELECTOR) as HTMLElement;
        labelDescription.focus();
    }

    /**
     * A unique id for this resource picker(guid)
     * Required if you want validation on done
     *
     * @param {string} rowIndex - the guid
     */
    set rowIndex(rowIndex) {
        this._rowIndex = rowIndex;
        saveResourcePicker(this);
    }

    @api
    get rowIndex() {
        return this._rowIndex;
    }

    /**
     * Sets the value of the flow combobox
     * Use this when you have a flow combobox menu item to display
     *
     * @param {menuDataRetrieval.MenuItem | string} itemOrDisplayText the menu item being set to the flow combobox
     */
    @api
    value;

    /**
     * The allowed param types based on the rule service. Used for the merge field validation if present.
     *
     * @type {Object}
     */
    @api
    allowedParamTypes = null;

    /**
     * Supports pill display?
     */
    @api
    isPillSupported = false;

    /**
     * Sets the full menu data for the resource picker
     * This method should be called by the wrapper components when they want
     * to set the full menu data for the resource picker
     *
     * @param {Object[]} newMenuData the full menu data
     */
    @api
    setMenuData(newMenuData) {
        this._fullMenuData = newMenuData;
        this.state.menuData = this._fullMenuData;
        this.state.renderIncrementally = !!newMenuData && newMenuData.length > 0;
    }

    @api
    enableLookupTraversal;

    /**
     * The full menu data available for selection
     *
     * @type {Object[]}
     */
    _fullMenuData;

    /**
     * Creates a ComboboxConfig object from the given params
     *
     * @param {string} label the flow combobox label
     * @param {string} placeholder the flow combobox placeholder
     * @param {string} errorMessage the error message to be displayed on error
     * @param {string | boolean} literalsAllowed Pass a string or boolean value: true if literals are allowed false otherwise
     * @param {boolean} required true if required field, false otherwise
     * @param {boolean} disabled true if disabled field, false otherwise
     * @param {string} type the data type of the flow combobox, needed for validation if literals are allowed
     * @param {boolean} enableFieldDrilldown whether you can drill down into items with hasNext=true
     * @param {boolean} allowSObjectFields whether or not you can drill down into SObject items when fieldDrilldown is enabled
     * @param {string} variant the variant for the combobox (label-hidden or standard)
     * @param fieldLevelHelp
     * @returns {ComboboxConfig} The combobox config object
     */
    static getComboboxConfig = (
        label?: string,
        placeholder?: string,
        errorMessage?: string | null,
        literalsAllowed = false,
        required = false,
        disabled = false,
        type = '',
        enableFieldDrilldown = false,
        allowSObjectFields = true,
        variant = LIGHTNING_INPUT_VARIANTS.STANDARD,
        fieldLevelHelp?: string
    ) => {
        return {
            label,
            placeholder,
            errorMessage,
            literalsAllowed,
            required,
            disabled,
            type,
            enableFieldDrilldown,
            allowSObjectFields,
            variant,
            fieldLevelHelp
        };
    };

    /**
     * Get value for literalsAllowed
     * If allowed param types are given and collection is required based on dataType, force literalsAllowed to false
     *
     * @readonly
     * @memberof BaseResourcePicker
     */
    get literalsAllowed() {
        if (!this.comboboxConfig) {
            return false;
        }
        const { literalsAllowed, type } = this.comboboxConfig;
        const isLiteralsAllowed = sanitizeBoolean(literalsAllowed);

        if (!this.allowedParamTypes) {
            return isLiteralsAllowed;
        }
        return isLiteralsAllowed && !isCollectionRequired(this.allowedParamTypes, type);
    }

    get effectivePlaceholder() {
        if (this.comboboxConfig && !isUndefinedOrNull(this.comboboxConfig.placeholder)) {
            return this.comboboxConfig.placeholder;
        }
        return this.placeholder;
    }

    /** EVENT HANDLERS */

    handleFilterMatches(event) {
        event.stopPropagation();
        const newTextChangedEvent = new TextChangedEvent(event.detail.value);
        this.dispatchEvent(newTextChangedEvent);
        this.state.menuData = filterMatches(event.detail.value, this._fullMenuData, event.detail.isMergeField);
    }
}

export const getComboboxConfig = ({
    label,
    placeholder,
    errorMessage,
    literalsAllowed = false,
    required = false,
    disabled = false,
    type = '',
    enableFieldDrilldown = false,
    allowSObjectFields = true,
    variant = LIGHTNING_INPUT_VARIANTS.STANDARD,
    fieldLevelHelp
}) => ({
    label,
    placeholder,
    errorMessage,
    literalsAllowed,
    required,
    disabled,
    type,
    enableFieldDrilldown,
    allowSObjectFields,
    variant,
    fieldLevelHelp
});
