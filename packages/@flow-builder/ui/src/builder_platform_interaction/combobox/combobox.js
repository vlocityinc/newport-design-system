import { LightningElement, api, track, unwrap } from 'lwc';
import { FetchMenuDataEvent, ComboboxStateChangedEvent, FilterMatchesEvent, NewResourceEvent, ItemSelectedEvent } from "builder_platform_interaction/events";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { COMBOBOX_NEW_RESOURCE_VALUE } from "builder_platform_interaction/expressionUtils";
import { format, isUndefinedOrNull, isObject, isValidNumber } from "builder_platform_interaction/commonUtils";
import { LIGHTNING_INPUT_VARIANTS } from "builder_platform_interaction/screenEditorUtils";
import { LABELS } from "./comboboxLabels";
import { validateTextWithMergeFields, validateMergeField, isTextWithMergeFields } from "builder_platform_interaction/mergeFieldLib";
import { DATE_TIME_DISPLAY_FORMAT_NO_TIME_ZONE, DATE_DISPLAY_FORMAT, formatDateTime, getValidDateTime } from "builder_platform_interaction/dateTimeUtils";
const SELECTORS = {
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

/**
 * Error message map for validation of literal value.
 */
const ERROR_MESSAGE = {
    [FLOW_DATA_TYPE.CURRENCY.value]: LABELS.currencyErrorMessage,
    [FLOW_DATA_TYPE.NUMBER.value]: LABELS.numberErrorMessage,
    [FLOW_DATA_TYPE.DATE.value] : format(LABELS.dateErrorMessage, DATE_DISPLAY_FORMAT),
    [FLOW_DATA_TYPE.DATE_TIME.value] : format(LABELS.datetimeErrorMessage, DATE_TIME_DISPLAY_FORMAT_NO_TIME_ZONE),
    [FLOW_DATA_TYPE.BOOLEAN.value]: LABELS.genericErrorMessage,
    GENERIC: LABELS.genericErrorMessage,
    REQUIRED: LABELS.requiredErrorMessage
};

/**
 * Regex for merge fields
 */
const CONSECUTIVE_PERIODS_REGEX = new RegExp('\\.{2,}');
// This regex looks for potential merge fields. Not everything this regex catches is necessarily a valid dev name
const MERGE_FIELD_REGEX = new RegExp('^[a-zA-Z][a-zA-Z0-9_]*$');

const isMatchWithTrailingPeriod = (text, textWithPeriodAndBracket) => {
    return text.substring(0, text.length - 1) + '.}' === textWithPeriodAndBracket;
};

/**
 * The max level of data the combobox supports to show the menu items and perform validation.
 * @type {number} max level of data the combobox supports.
 */
const MAX_LEVEL_MENU_DATA = 2;

export default class Combobox extends LightningElement {
    @track
    state = {
        displayText: '',
        showActivityIndicator: false,
        inputIcon: 'utility:search',
        menuData: [],
    };

    /**
     * Label for combobox.
     * If empty no label.
     * @param {String} value The label value to set
     */
    set label(value) {
        if (!value) {
            this._comboboxVariant = LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN;
        } else {
            this._comboboxLabel = value;
        }
    }

    @api
    get label() {
        return this._comboboxLabel;
    }

    /**
     * Variant type for grouped-combobox
     * Must be from the LIGHTNING_INPUT_VARIANTS const
     * @param {String} value The variant type to set
     */
    set variant(value) {
        for (const key in LIGHTNING_INPUT_VARIANTS) {
            if (LIGHTNING_INPUT_VARIANTS[key] === value) {
                this._comboboxVariant = value;
                return;
            }
        }

        throw new Error(`Variant must either be '${LIGHTNING_INPUT_VARIANTS.STANDARD}' or '${LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN}'!`);
    }

    @api
    get variant() {
        return this._comboboxVariant;
    }

    /**
     * Pass the error message on to lightning-grouped-combobox
     * @param {String} error the new error message
     */
    set errorMessage(error) {
        if (error || error === null) {
            this.setErrorMessage(error);
        }
    }

    @api
    get errorMessage() {
        return this._errorMessage;
    }

    /**
     * If true, only references are allowed in this combobox
     * @param {String|Boolean} isAllowed value to set allow literals
     */
    set literalsAllowed(isAllowed) {
        this._isLiteralAllowed = isAllowed ? isAllowed !== 'false' : false;
    }

    @api
    get literalsAllowed() {
        return this._isLiteralAllowed && ![FLOW_DATA_TYPE.SOBJECT.value, FLOW_DATA_TYPE.BOOLEAN.value].includes(this._dataType);
    }

    /**
     * If passing in a MenuItem, it must have a value and displayText.
     * If the item is the second level, then parent must also be passed in.
     */

    /**
     * Input value for the combobox.
     * Combobox returns date time value in 'MM/dd/yyyy h:mm a [GMT]ZZ' format,
     * and can accept any the value in many formats that are valid for American locale.
     * Note: Date time format might be localized in 218+ (W-5236170)
     * @param {menuDataRetrieval.MenuItem|String} itemOrDisplayText - The value of the combobox
     */
    set value(itemOrDisplayText) {
        let displayText;
        this._mergeFieldLevel = 1;
        if (isObject(itemOrDisplayText)) {
            if (itemOrDisplayText.value) {
                const item = unwrap(itemOrDisplayText);
                displayText = this.syncValueAndDisplayText(item);

                const foundItem = this.findItem(itemOrDisplayText.value);
                // TODO: W-5314359 remove once loop editor change is done
                if (foundItem) {
                    this._item = Object.assign({}, foundItem);
                } else {
                    this._item = Object.assign({}, item);
                }

                this._item.displayText = displayText;

                // set the base value to parent for fetching previous level
                if (itemOrDisplayText.parent) {
                    this._base = itemOrDisplayText.parent.displayText;
                    this._mergeFieldLevel++;
                }
            } else {
                throw new Error('Setting an item on Flow Combobox without a value property!');
            }
        } else {
            this._item = null;
            displayText = this.getStringValue(unwrap(itemOrDisplayText));
        }
        this.state.displayText = displayText;
        this.updateInputIcon();
        this.setMergeFieldState();

        this._isUserBlurred = false;
    }

    /**
     * Returns the Menu Item associated with the combobox value or the literal string value if no item has been selected
     * @returns {menuDataRetrieval.MenuItem|String} the current value of the combobox
     */
    @api
    get value() {
        return this._item ? this._item : this.state.displayText;
    }

    /**
     * Possible datatypes for this combobox.
     * Needed for validation for literal and showing date picker for date/datetime.
     * @param {String} dataType The FlowDataTypes that this combobox accepts.
     */
    set type(dataType) {
        if (dataType && dataType.toUpperCase) {
            if (!Object.values(FLOW_DATA_TYPE).find(type => type.value === dataType)) {
                throw new Error(`Data type must be a valid Flow Data Type but instead was ${dataType}`);
            }
            this._dataType = dataType;

            if (this._isValidationEnabled) {
                this.doValidation();
                this.fireComboboxStateChangedEvent();
            } else {
                this._isValidationEnabled = true;
            }
        } else {
            this._dataType = null;
        }
    }

    @api
    get type() {
        return this._dataType;
    }

    /**
     * Menu items that the combobox would show.
     * Expected in the exact format the lightning-grouped-combobox needs.
     * @param {Array} data - the menu data
     */
    set menuData(data) {
        this.state.menuData = data;
        this.state.showActivityIndicator = false;
    }

    @api
    get menuData() {
        return this.state.menuData;
    }

    /**
     * Set this attribute to disable the combobox.
     * @type {Boolean}
     */
    @api disabled = false;

    /**
     * Placeholder text for the combobox input field.
     * @type {String}
     */
    @api placeholder = LABELS.defaultPlaceholder;

    /**
     * Boolean to mark combobox input as required field.
     * Defaults to false.
     * @type {String}
     */
    @api required = false;

    /**
     * The error message to display when the combobox is required, but has no value
     */
    @api messageWhenValueMissing = ERROR_MESSAGE.REQUIRED;

    /**
     * The allowed param types based on the rule service. Used for the merge field validation if present.
     * @type {Object}
     */
    @api allowedParamTypes = null;

    renderedCallback() {
        if (!this._isInitialErrorMessageSet && this._errorMessage) {
            this.setErrorMessage(this._errorMessage);
        }
    }

    connectedCallback() {
        this._isInitialized = true;
    }

    /* ***************** */
    /* Private Variables */
    /* ***************** */

    /**
     * This is true only when the expression is a valid expression identifier.
     * Eg: {!testVar} true
     *     {!testVar&} false since it is a literal
     */
    _isMergeField = false;

    @track
    _comboboxVariant = LIGHTNING_INPUT_VARIANTS.STANDARD;

    @track
    _comboboxLabel;

    _dataType;

    _isLiteralAllowed = true;

    _itemCache = {};

    _errorMessage = null;

    _item;

    /**
     * This is the base for when you get past the first-level of an item.
     * Will be the value of the selected item.
     */
    _base;

    /**
     * This will be false only for the first time the component is rendered.
     */
    _isValidationEnabled = false;

    /**
     * Flag to set the initial error message on renderedCallback only once.
     */
    _isInitialErrorMessageSet = false;

    /**
     * Flag indicating whether all attributes have been set
     */
    _isInitialized = false;

    /**
     * Flag indicating that the current set value is due to the user blurring out
     * in which case, the user explicitly desired an sobject and thus set value will not append a period.
     *
     * This will be used (and managed) in set value
     */
    _isUserBlurred = false;

    /**
     * This will keep track of the merge field level for the combobox.
     * The merge field level is incremented only when hasNext is true.
     * {!myAccount.Name} - 2
     * {!invalidVar.Name} - 1
     */
    _mergeFieldLevel = 1;

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * Fires an event to filter the current menu data
     * @param {Object} event - Event fired from grouped-combobox
     */
    handleTextInput(event) {
        // Do nothing if the event is fired with undefined.  This is catching an issue with IE11 where textinput events
        // are being fired with undefined upon initial element rendering
        if (event.detail.text === undefined) {
            return;
        }

        // Typing should invalidate the selected _item
        this._item = null;

        // Grab the previous value && update the current values
        const previousValue = this.state.displayText;
        this.state.displayText = event.detail.text;
        this.updateInputIcon();

        // set state to resource if value starts with {!, append the closing brace, and place cursor before it
        if (this.state.displayText === '{!' && previousValue === '{' && !this._isMergeField) {
            this._isMergeField = true;
            this.setValueAndCursor('{!}');
        } else {
            this.setMergeFieldState();
        }

        const sanitizedValue = this.getSanitizedValue();

        // If a . is typed or deleted when in resource state, fire an event to fetch new menu data
        // As of 216 and we support showing only 2 level of menu data
        // TODO: W-5064397. The following code doesn't account for highlighting and deleting and copy pasting
        if (this._isMergeField && !this.hasMergeFieldCrossedMaxLevel()) {
            if (this.wasPeriodEntered(previousValue)) {
                // set base and fetch next level
                this.matchTextWithItem(previousValue);
                if (this._item && this._item.hasNext) {
                    this._base = previousValue;
                    // Do we need the itemSelectedEvent here?
                    this.fireItemSelectedEvent(this._item);
                    this.fireFetchMenuDataEvent(this._item);
                } else {
                    this._item = null;
                }
            } else if (this.wasPeriodDeleted(previousValue)) {
                // remove base and fetch previous level
                if (this.state.displayText === this._base) {
                    this._base = null;
                    this.fireFetchMenuDataEvent();
                }
            }
        }

        // TODO: W-5064397. This needs to be improved to be smarter.
        // Get previous level menu data in the case that the length of the displayText is shorter than base
        if (this._base && (!this.state.displayText || this.state.displayText.indexOf(this.getSanitizedValue(this._base)) === -1)) {
            this._base = null;
            this.fireFetchMenuDataEvent();
        }

        // Fire event to filter menu data only if within the max level, otherwise clear menu data
        if (!this.hasMergeFieldCrossedMaxLevel()) {
            this.fireFilterMatchesEvent(this.getFilterText(sanitizedValue), this._isMergeField);
        } else {
            this.state.menuData = [];
        }
    }

    /**
     * Fires an event to fetch the next level
     * @param {Object} event - Event fired from grouped-combobox
     */
    handleSelect(event) {
        if (event.detail.value === COMBOBOX_NEW_RESOURCE_VALUE) {
            this.fireNewResourceEvent();
            return;
        }

        // Get next level menu data if the selected option hasNext
        const item = this.findItem(event.detail.value);
        const itemHasNextLevel = item && item.hasNext;

        this._item = item;

        if (itemHasNextLevel) {
            this._base = item.displayText;
            this.fireFetchMenuDataEvent(item);
        }

        this.setMergeFieldState(item.displayText);
        this.updateInputIcon();

        // And add a period if selected option has next level
        this.setValueAndCursor(item.displayText, itemHasNextLevel);

        this.fireItemSelectedEvent(item);
    }

    /**
     * fires an event to validate combobox value
     */
    handleBlur() {
        // Remove the last dot from the expression
        if (this._isMergeField && this.state.displayText.charAt(this.state.displayText.length - 2) === '.') {
            this.state.displayText = this.state.displayText.substring(0, this.state.displayText.length - 2) + '}';
        }

        // If value is null, check if there is one item associated with displayText
        this.matchTextWithItem();

        this.doValidation(true);

        this._isUserBlurred = true;

        this.fireComboboxStateChangedEvent();
    }

    /**
     * On focus, filter the menu data based on the current text displayed
     */
    handleFocus() {
        if (this.state.displayText) {
            this.fireFilterMatchesEvent(this.getFilterText(this.getSanitizedValue()), this._isMergeField);
        }
    }

    /* **************************** */
    /*    Private Helper methods    */
    /* **************************** */

    /**
     * Returns the the string value of numbers and booleans
     * @param {*} valueToConvert The value to convert to string
     * @returns {String} The string value
     */
    getStringValue(valueToConvert) {
        if (isUndefinedOrNull(valueToConvert)) {
            valueToConvert = '';
        } else if (['number', 'boolean'].includes(typeof valueToConvert)) {
            return valueToConvert.toString();
        } else if (typeof valueToConvert !== 'string') {
            throw new Error(`Trying to set value of invalid type ${typeof valueToConvert} on Flow Combobox!`);
        }
        return valueToConvert;
    }

    /**
     * Set the resource state if the value start with '{!' and ends with '}'
     * @param {String} value the value to set state on, defaults to displayText
     */
    setMergeFieldState(value = this.state.displayText) {
        if (value.startsWith('{!') && value.endsWith('}')) {
            this._isMergeField = !this.isExpressionIdentifierLiteral(value, true);
        } else {
            this._isMergeField = false;
        }
    }

    /**
     * Dispatches the FetchMenuData Event & makes the spinner active
     * @param {Object} item - the selected item to fetch the next level of menu data.
     *                        If undefined or null first level of menu data is fetched.
     */
    fireFetchMenuDataEvent(item) {
        if (item) {
            this._mergeFieldLevel++;
        } else {
            this._mergeFieldLevel--;
        }
        this.state.menuData = [];
        const fetchMenuDataEvent = new FetchMenuDataEvent(item);
        this.dispatchEvent(fetchMenuDataEvent);
        this.state.showActivityIndicator = true;
    }

    /**
     * Dispatches the FilterMatches Event & makes the spinner active
     * @param {String} value the value to filter on
     * @param {Boolean} isMergeField true if the combobox value is a merge field, false otherwise
     */
    fireFilterMatchesEvent(value, isMergeField) {
        const filterMatchesEvent = new FilterMatchesEvent(value, isMergeField);
        this.dispatchEvent(filterMatchesEvent);
        this.state.showActivityIndicator = true;
    }

    /**
     * Fire value change event with error message if provided
     * NOTE: This event is only fired if there have been changes
     */
    fireComboboxStateChangedEvent() {
        const comboboxStateChangedEvent = new ComboboxStateChangedEvent(this._item, this.state.displayText, this._errorMessage);
        this.dispatchEvent(comboboxStateChangedEvent);
    }

    /**
     * Fire new resource event.
     */
    fireNewResourceEvent() {
        const newResourceEvent = new NewResourceEvent();
        this.dispatchEvent(newResourceEvent);
    }

    /**
     * Fire item selected event
     * @param {Object} item The item that was selected
     */
    fireItemSelectedEvent(item) {
        const itemSelectedEvent = new ItemSelectedEvent(item);
        this.dispatchEvent(itemSelectedEvent);
    }

    /**
     * If there is a single item that matches with text, assign that to _item
     * @param {String} text The text to match with an item's displayText
     */
    matchTextWithItem(text = this.state.displayText) {
        if (!this._item && text && this.state.menuData) {
            const matchedItems = [];
            const groupOrItemCount =  this.state.menuData.length;
            for (let i = 0; i < groupOrItemCount; i++) {
                if (this.state.menuData[i].items) {
                    // a menu data group
                    this.state.menuData[i].items.forEach(item => {
                        if (item.displayText === text) {
                            matchedItems.push(item);
                        }
                    });
                } else {
                    // a menu data item
                    const item = this.state.menuData[i];
                    if (item.displayText === text) {
                        matchedItems.push(item);
                    }
                }
            }
            if (matchedItems.length === 1) {
                this._item = matchedItems[0];
            }
        }
    }

    /**
     * Grabs the item associated with the selected value.
     * If no value is found, returns undefined
     * @param {String} value The unique value to find the item
     * @returns {Object} the return value
     */
    findItem(value) {
        let foundItem;
        let groupCount;

        if (this.state.menuData) {
            groupCount = this.state.menuData.length;
        }
        // check if the item has already been cached to avoid running through the nested arrays
        if (this._itemCache[value]) {
            return this._itemCache[value];
        }
        for (let i = 0; i < groupCount; i++) {
            const groupOrItem = this.state.menuData[i];
            if (groupOrItem.items) {
                // a menu data group
                foundItem = groupOrItem.items.find(item => {
                    // add item to the cache whether or not it's the foundItem
                    this._itemCache[item.value] = item;
                    return item.value === value;
                });
            } else if (groupOrItem.value === value) {
                // a menu data item
                this._itemCache[groupOrItem.value] = groupOrItem;
                foundItem = groupOrItem;
            }
            if (foundItem) {
                return foundItem;
            }
        }
        return foundItem;
    }

    /**
     * Returns true if the max level for a merge field has been reached.
     * NOTE: This function should be used only in context of merge field and not for merge field with text.
     * @returns {Boolean} true when the level is greater than max level.
     */
    hasMergeFieldCrossedMaxLevel() {
        return this.state.displayText.split('.').length > MAX_LEVEL_MENU_DATA;
    }

    /**
     * Determines whether a period was entered
     * @param {String} previousValue the previous value of the combobox
     * @returns {Boolean} whether a period was entered
     */
    wasPeriodEntered(previousValue) {
        // a period was entered in resource state
        return ((this.state.displayText.length === previousValue.length + 1) &&
            (previousValue.charAt(previousValue.length - 2) !== '.') &&
            (this.state.displayText.charAt(this.state.displayText.length - 2) === '.'));
    }

    /**
     * Determines whether a period was deleted
     * @param {String} previousValue the previous value of the combobox
     * @returns {Boolean} whether a period was deleted
     */
    wasPeriodDeleted(previousValue) {
        // a period was deleted in resource state
        return ((this.state.displayText.length === previousValue.length - 1) &&
            (this.state.displayText.charAt(this.state.displayText.length - 2) !== '.') &&
            (previousValue.charAt(previousValue.length - 2) === '.'));
    }

    /**
     * Sets the dot for next level and places the cursor before the closing brace
     * @param {String} value the value to set
     * @param {String} hasNextLevel whether or not the selected item has a next level
     */
    setValueAndCursor(value, hasNextLevel = false) {
        const combobox = this.template.querySelector(SELECTORS.GROUPED_COMBOBOX);
        const input = combobox.getElementsByTagName('input')[0];

        // Add a period to the end if selected value has a next level
        if (hasNextLevel) {
            if (value.startsWith('{!') && value.endsWith('}')) {
                value = value.substring(0, value.length - 1) + '.}';
            } else {
                value += '.';
            }
        }

        this.state.displayText = input.value = value;
        // Lightning components team may provide a method to accomplish this in the future
        if (this._isMergeField) {
            input.setSelectionRange(this.state.displayText.length - 1, this.state.displayText.length - 1);
        }
    }

    /**
     * Get the proper value depending on the combobox state.
     * If in resource state, returns value without {! & }
     * @param {String} value The value to sanitize. Defaults to displayText
     * @returns {String} The resource value or full text
     */
    getSanitizedValue(value = this.state.displayText) {
        if (value === this.state.displayText && this._isMergeField) {
            return value.substring(2, value.length - 1);
        } else if (value.startsWith('{!') && value.endsWith('}')) {
            return value.substring(2, value.length - 1);
        }
        return value;
    }

    /**
     * Returns value after the last . if in resource state.
     * Ex: MyAccount.MyN would return MyN
     * @param {String} sanitizedValue the already sanitized value
     * @returns {String} the filter text to search on
     */
    getFilterText(sanitizedValue) {
        const lastIndex = sanitizedValue.lastIndexOf('.');
        if (this._isMergeField && lastIndex !== -1 && (this._item || this._base)) {
            return sanitizedValue.substring(lastIndex + 1);
        }
        return sanitizedValue;
    }

    /**
     * Input icon search for no selection otherwise clear.
     */
    updateInputIcon() {
        if (this.state.displayText && this.state.displayText.length > 0) {
            this.state.inputIcon = '';
        } else {
            this.state.inputIcon = 'utility:search';
        }
    }

    /**
     * Clears an error message if any previously set on the combobox.
     */
    clearErrorMessage() {
        this._errorMessage = null;
    }

    /**
     * Set the error message on the combobox.
     * @param {String} customErrorMessage to be set on the combobox.
     */
    setErrorMessage(customErrorMessage) {
        const groupedCombobox = this.getGroupedCombobox();
        if (groupedCombobox) {
            groupedCombobox.setCustomValidity(customErrorMessage);
            groupedCombobox.showHelpMessageIfInvalid();
            this._isInitialErrorMessageSet = true;
        }
        this._errorMessage = customErrorMessage;
    }

    /**
     * Returns the lightning grouped combobox element.
     * @returns {Object} the grouped combobox element.
     */
    getGroupedCombobox() {
        return this.template.querySelector(SELECTORS.GROUPED_COMBOBOX);
    }

    /**
     * In most cases returns the item.displayText.  Returns the existing state.displayText only if:
     * 1. This is not initialization
     * 2. This is not being called as a reaction to the user blurring
     * 3. The item has next
     * 4. The item.displayText with a . inserted before the closing bracket matches state.displayText
     * This catches the case where a  trailing period was stripped before firing ItemSelected and the parent component
     * passes this new value (without the period) back down.  In which case, we still want the combobox display to
     * include the period
     * @param {Object} item an item
     * @return {String} The display text to be used
     */
    syncValueAndDisplayText(item) {
        let displayText = this.getStringValue(item.displayText);

        if (this._isInitialized && !this._isUserBlurred && item.hasNext &&
            isMatchWithTrailingPeriod(item.displayText, this.state.displayText)) {
            displayText = this.state.displayText;
        }

        return displayText;
    }

    /** *********************************/
    /*    Validation Helper methods     */
    /** *********************************/

    /**
     * Runs the validation for this combobox
     * @param {Boolean} isBlur whether or not this validate is happening on blur
     */
    doValidation(isBlur = false) {
        this.clearErrorMessage();

        // When combobox is disabled as per design the error message is cleared but the selected value is preserved
        if (this.disabled) {
            return;
        }

        if (isTextWithMergeFields(this.state.displayText)) {
            this.validateMultipleMergeFieldsWithText();
        } else {
            this.validateMergeFieldOrLiteral(isBlur);
        }
    }

    /**
     * Validates text with merge field(s).
     * ex: Hi {!myAccount.Name}!
     */
    validateMultipleMergeFieldsWithText() {
        const mergeFieldsAllowedForDataTypes = [FLOW_DATA_TYPE.STRING.value,
            FLOW_DATA_TYPE.PICKLIST.value, FLOW_DATA_TYPE.MULTI_PICKLIST.value];

        // merge fields are valid only with literals allowed
        if (!this._isLiteralAllowed) {
            this._errorMessage = ERROR_MESSAGE.GENERIC;
            return;
        }

        if (!mergeFieldsAllowedForDataTypes.includes(this._dataType)) {
            this._errorMessage = ERROR_MESSAGE[this._dataType];
            return;
        }

        this.state.showActivityIndicator = true;

        this.validateUsingMergeFieldLib(validateTextWithMergeFields);
    }

    validateMergeFieldOrLiteral(isBlur = false) {
        if (this.state.displayText) {
            if (this._isMergeField) {
                this.validateResource(isBlur);
            } else {
                this.validateLiteral();
            }
        } else if (this.required && isBlur) {
            this._errorMessage = this.messageWhenValueMissing;
        }
    }
    /**
     * Validates the literal value entered in combobox.
     */
    validateLiteral() {
        // literals allowed in combobox, validates number, currency (number), date and date time.
        // date and date time converts the input date string to format 'MM/dd/yyyy'
        // & date time string to 'MM/dd/yyyy h:mm a [GMT]ZZ'
        if (this.literalsAllowed) {
            this.validateLiteralForDataType();
        } else if (!this._item) {
            this._errorMessage = ERROR_MESSAGE.GENERIC;
        }
    }

    /**
     * Validates the resource value (value enclosed in {! and } ) selected or entered.
     * @param {Boolean} isBlur whether or not this validation is happening onblur
     */
    validateResource(isBlur = false) {
        if (this.literalsAllowed && this.isExpressionIdentifierLiteral()) {
            this.validateLiteralForDataType();
        } else if (isBlur && !this.hasMergeFieldCrossedMaxLevel()) { // no validation for more than max level
            // For single level merge field use menu data and for two levels use merge field lib
            if (this._mergeFieldLevel === 1 && !this.allowedParamTypes) {
                if (!this._item) {
                    this._errorMessage = ERROR_MESSAGE.GENERIC;
                }
            } else {
                this.validateUsingMergeFieldLib(validateMergeField, this.allowedParamTypes);
            }
        }
    }

    /**
     * Validates the literal value entered in the combobox against the _dataTypes
     */
    validateLiteralForDataType() {
        if (this._dataType) {
            switch (this._dataType) {
                case FLOW_DATA_TYPE.NUMBER.value:
                case FLOW_DATA_TYPE.CURRENCY.value:
                    this.validateNumber();
                    break;
                case FLOW_DATA_TYPE.DATE.value:
                    this.validateAndFormatDate();
                    break;
                case FLOW_DATA_TYPE.DATE_TIME.value:
                    this.validateAndFormatDate(true);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Validate the input value is a valid number and set error
     */
    validateNumber() {
        if (!isValidNumber(this.state.displayText)) {
            this._errorMessage = ERROR_MESSAGE[this._dataType];
        }
    }

    /**
     * Validate the input string is a valid date or date time.
     * If valid format it otherwise set error message.
     * @param {Boolean} isDateTime whether to validate for date time
     */
    validateAndFormatDate(isDateTime) {
        const dateValue = getValidDateTime(this.state.displayText);
        if (dateValue) {
            this.state.displayText = formatDateTime(dateValue, isDateTime);
        } else {
            this._errorMessage = ERROR_MESSAGE[this._dataType];
        }
    }

    /**
     * Validate the merge field or merge fields with text using passed in merge field validation function reference.
     * @param {function} validateFunctionRef a existing function reference from merge field lib that returns promise.
     */
    validateUsingMergeFieldLib(validateFunctionRef) {
        validateFunctionRef.call(this, this.state.displayText, {allowGlobalConstants: true, allowedParamTypes: this.allowedParamTypes})
            .then(this.resolveMergeFieldValidation)
            .catch(() => {
                this.state.showActivityIndicator = false;
            });
    }

    resolveMergeFieldValidation = (errors) => {
        this.state.showActivityIndicator = false;
        if (errors.length > 0) {
            this._errorMessage = errors[0].message;
            this.fireComboboxStateChangedEvent();
        }
    };

    /**
     * Validates if the expression literal identifier is a valid dev name.
     * Eg: {!testVar} - is a valid expression, returns false
     *     {^testVar} - is a valid expression literal, returns true
     * Dot at the end is allowed for SObject where dot signifies to fetch next level data
     * @param {String} valueToCheck the value to check, defaults to displayText
     * @param {boolean} allowDotSuffix to allow dot at the end of the expression identifier
     * @returns {*} returns false if invalid dev name chars or regex result.
     */
    isExpressionIdentifierLiteral(valueToCheck = this.state.displayText, allowDotSuffix) {
        let value;
        let regexResult = true;
        if (valueToCheck.startsWith('{!') && valueToCheck.endsWith('}')) {
            value = valueToCheck.substring(2, valueToCheck.length - 1);
        }

        if (value) {
            // check that there aren't consecutive periods anywhere and doesn't start with a period
            if (CONSECUTIVE_PERIODS_REGEX.exec(value) || value.startsWith('.')) {
                return true;
            }
            // split the merge field by period
            const mergeFieldArray = value.split('.');
            let i = 0;
            while (regexResult && i < mergeFieldArray.length) {
                // don't execute regex on empty strings
                if (mergeFieldArray[i]) {
                    regexResult = MERGE_FIELD_REGEX.exec(mergeFieldArray[i]);
                }
                i++;
            }
        } else {
            return !allowDotSuffix; // {!} is valid string constant
        }

        if (allowDotSuffix) {
            return !regexResult;
        }

        // The regex is valid dev name regex with optional trailing period
        // With allowDotSuffix = false we need to check trailing dot does not exists
        return !value.endsWith('.') && !regexResult;
    }
}