import { Element, api, track, unwrap } from 'engine';
import { parseDateTime } from 'builder_platform_interaction-date-time-utils';
import { FetchMenuDataEvent, ComboboxValueChangedEvent, FilterMatchesEvent, NewResourceEvent, ItemSelectedEvent } from 'builder_platform_interaction-events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { COMBOBOX_NEW_RESOURCE_VALUE } from 'builder_platform_interaction-expression-utils';
import { isUndefinedOrNull, formatDate, isObject } from 'builder_platform_interaction-common-utils';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction-screen-editor-utils';
import { LABELS } from './combobox-labels';

const SELECTORS = {
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

/**
 * Error message map for validation of literal value.
 * TODO: Use labels and doc review. W-4813532
 */
const ERROR_MESSAGE = {
    [FLOW_DATA_TYPE.CURRENCY.value]: LABELS.currencyErrorMessage,
    [FLOW_DATA_TYPE.NUMBER.value]: LABELS.numberErrorMessage,
    [FLOW_DATA_TYPE.DATE.value] : LABELS.dateErrorMessage,
    [FLOW_DATA_TYPE.DATE_TIME.value] : LABELS.datetimeErrorMessage,
    GENERIC: LABELS.genericErrorMessage
};

/**
 * Regex for Dev Names
 */
const oneLetterDevName = '(^[a-zA-Z]{1}$)';
// Regex below covers both non-suffix and trailing periods.
const withNonSuffixAndTrailingPeriod = '(^([a-zA-Z]{1}[a-zA-Z0-9]*_?[a-zA-Z0-9]+\\.?)+$)';
const withNoTrailingPeriod = '(^[a-zA-Z]{1}[a-zA-Z0-9]*_?[a-zA-Z0-9]+$)';
const withNonSuffixPeriods = '(^([a-zA-Z]{1}[a-zA-Z0-9]*_?[a-zA-Z0-9]+\\.{1}[a-zA-Z]{1}[a-zA-Z0-9]*_?[a-zA-Z0-9]+)+$)';

const TYPING_DEV_NAME_REGEX = new RegExp(oneLetterDevName + '|' + withNonSuffixAndTrailingPeriod);
const VALIDATION_DEV_NAME_REGEX = new RegExp(oneLetterDevName + '|' + withNoTrailingPeriod + '|' + withNonSuffixPeriods);

/**
 * The max level of data the combobox supports to show the menu items and perform validation.
 * @type {number} max level of data the combobox supports.
 */
const MAX_LEVEL_MENU_DATA = 2;

export default class Combobox extends Element {
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
    @api
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
    @api
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
     * @type {String}
     */
    @api errorMessage;

    /**
     * If true, only references are allowed in this combobox
     * @param {Boolean} isAllowed value to set allow literals
     */
    @api
    set literalsAllowed(isAllowed) {
        this._isLiteralAllowed = isAllowed ? isAllowed !== 'false' : false;
    }

    @api
    get literalsAllowed() {
        return this._isLiteralAllowed;
    }

    /**
     * If passing in a MenuItem, it must have a value and displayText.
     * If the item is the second level, then parent must also be passed in.
     */

    /**
     * Input value for the combobox.
     * Combobox expects and returns date time value in 'MM/DD/YYYY HH:mm:ss TZD' format.
     * Note: Date time format is under discussion and might change.
     * @param {menuDataRetrieval.MenuItem|String} itemOrDisplayText - The value of the combobox
     */
    @api
    set value(itemOrDisplayText) {
        let displayText;
        if (isObject(itemOrDisplayText)) {
            if (itemOrDisplayText.value) {
                const item = unwrap(itemOrDisplayText);
                displayText = item.displayText = this.getStringValue(item.displayText);
                this._item = this._lastRecordedItem = item;
                // set the base value to parent for fetching previous level
                if (itemOrDisplayText.parent) {
                    this._base = itemOrDisplayText.parent.displayText;
                }
            } else {
                throw new Error('Setting an item on Flow Combobox without a value property!');
            }
        } else {
            this._item = null;
            this._lastRecordedItem = null;
            displayText = this.getStringValue(unwrap(itemOrDisplayText));
        }
        this.state.displayText = displayText;
        this._lastRecordedDisplayText = displayText;
        this.updateInputIcon();
        this.setMergeFieldState();
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
    @api
    set type(dataType) {
        if (dataType && dataType.toUpperCase) {
            if (!Object.values(FLOW_DATA_TYPE).find(type => type.value === dataType)) {
                throw new Error(`Data type must be a valid Flow Data Type but instead was ${dataType}`);
            }
            this._dataType = dataType;
            // No literals allowed for SObject and Boolean data type
            // if ([FLOW_DATA_TYPE.SOBJECT.value, FLOW_DATA_TYPE.BOOLEAN.value].includes(this._dataType)) {
            // TODO: W-4967895. Make Boolean only allow Global Constant True/False
            if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                this._isLiteralAllowed = false;
            }
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
    @api
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
    @api placeholder = '';

    /**
     * Boolean to mark combobox input as required field.
     * Defaults to false.
     * @type {String}
     */
    @api required = false;

    /**
     * Validates the value of the combobox.
     */
    @api
    validate() {
        this.doValidation();
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

    _comboboxVariant = LIGHTNING_INPUT_VARIANTS.STANDARD;

    _comboboxLabel;

    _dataType;

    _isLiteralAllowed = true;

    _lastRecordedDisplayText = '';

    _itemCache = {};

    _errorMessage = '';

    // TODO: This will need to change once multiple merge fields can be in the same string
    _item;

    _lastRecordedItem;

    /**
     * This is the base for when you get past the first-level of an item.
     * Will be the value of the selected item.
     */
    _base;

    /**
     * Called once the component has finished rendering to set the error message
     */
    renderedCallback() {
        if (this.errorMessage || this.errorMessage === null) {
            this.setErrorMessage(this.errorMessage);
        }
    }

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
        if (this._isMergeField && this.getLevel() <= MAX_LEVEL_MENU_DATA) {
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

        // Fire event to filter Menu Data
        this.fireFilterMatchesEvent(this.getFilterText(sanitizedValue), this._isMergeField);
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

        // do validation
        this.doValidation(true);

        // Only fire event if value has changed
        if ((this.state.displayText !== this._lastRecordedDisplayText) || (this._item !== this._lastRecordedItem)) {
            this.fireComboboxValueChangedEvent(this._item, this.state.displayText, this._errorMessage);

            // Update _lastRecordedItem && _lastRecordedDisplayText
            this._lastRecordedDisplayText = this.state.displayText;
            this._lastRecordedItem = this._item;
        }
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
     * @param {String} value - the value to fetch menu data on
     */
    fireFetchMenuDataEvent(value) {
        const fetchMenuDataEvent = new FetchMenuDataEvent(value);
        this.dispatchEvent(fetchMenuDataEvent);
        this.state.showActivityIndicator = true;
    }

    /**
     * Dispatches the FilterMatches Event & makes the spinner active
     * @param {String} value the value to filter on
     */
    fireFilterMatchesEvent(value) {
        const filterMatchesEvent = new FilterMatchesEvent(value);
        this.dispatchEvent(filterMatchesEvent);
        this.state.showActivityIndicator = true;
    }

    /**
     * Fire value change event with error message if provided
     * @param {Object} item The item, if any, that was selected
     * @param {String} displayText Only the display text string
     * @param {String} errorMessage optional error message
     */
    fireComboboxValueChangedEvent(item, displayText, errorMessage) {
        const comboboxValueChangedEvent = new ComboboxValueChangedEvent(item, displayText, errorMessage);
        this.dispatchEvent(comboboxValueChangedEvent);
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
        if (!this._item) {
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
        const groupCount = this.state.menuData.length;
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
     * Determines what data level the current combobox is at based on the period '.' in the value.
     * Eg: myAccount - 1, myAccount. - 2, myAccount.Name - 2, myAccount.Name. - 3
     * @returns {Number} the combobox current data level
     */
    getLevel() {
        return this.state.displayText.split('.').length;
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
            this.state.inputIcon = 'utility:clear';
        } else {
            this.state.inputIcon = 'utility:search';
        }
    }

    /**
     * Clears an error message if any previously set on the combobox.
     */
    clearErrorMessage() {
        this.setErrorMessage(null);
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

    /** *********************************/
    /*    Validation Helper methods     */
    /** *********************************/

    // TODO: Use validation rules and move the generic methods to utils.

    /**
     * Runs the validation for this combobox
     * @param {Boolean} isBlur whether or not this validate is happening on blur
     */
    doValidation(isBlur = false) {
        this.clearErrorMessage();

        // No validation for three or more level of data to let super user type in higher level values.
        if (this.getLevel() > MAX_LEVEL_MENU_DATA || this.disabled) {
            this._dataType = null;
            return;
        }

        if (this.state.displayText) {
            if (this._isMergeField) {
                this.validateResource(isBlur);
            } else {
                this.validateLiteral();
            }
        } else if (this.required) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }
    /**
     * Validates the literal value entered in combobox.
     */
    validateLiteral() {
        // literals allowed in combobox, validates number, currency (number), date and date time.
        // date and date time converts the input date string to format 'MM/DD/YYYY HH:MM:ss TZD
        if (this._isLiteralAllowed) {
            this.validateLiteralForDataType();
        } else if (!this._item) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }

    /**
     * Validates the resource value (value enclosed in {! and } ) selected or entered.
     * @param {Boolean} isBlur whether or not this validation is happening onblur
     */
    validateResource(isBlur = false) {
        if (this.isExpressionIdentifierLiteral() && this._isLiteralAllowed) {
            this.validateLiteralForDataType();
        } else if (!this._item && isBlur) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }

    /**
     * Validates the literal value entered in the combobox against the _dataTypes
     * @param {String} value literal value
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
        if (this.isValidNumber(this.state.displayText)) {
            this.clearErrorMessage();
        } else {
            this.setErrorMessage(ERROR_MESSAGE[this._dataType]);
        }
    }

    /**
     * Validates the value is a number with optional decimal.
     * TODO: May not be needed with validation rules.
     * @param {String} value - input number string
     * @returns {*} false if not a number else regex result array
     */
    isValidNumber(value) {
        const numRegex = new RegExp('^-?\\d*\\.?\\d+[\\.]?$');
        return value ? numRegex.exec(value) : false;
    }

    /**
     * Validate the input string is a valid date or date time.
     * If valid format it otherwise set error message.
     * @param {Boolean} isDateTime whether to validate for date time
     */
    validateAndFormatDate(isDateTime) {
        const dateValue = this.isValidDateTime(this.state.displayText);
        if (dateValue) {
            this.state.displayText = formatDate(dateValue, isDateTime);
        } else {
            this.setErrorMessage(ERROR_MESSAGE[this._dataType]);
        }
    }

    /**
     * Validates the date string is a validate date time
     * @param {String} dateString input date string
     * @returns {*} false if invalid date string otherwise parsed DateTime
     */
    isValidDateTime(dateString) {
        return dateString ? parseDateTime(dateString, 'MM/DD/YYYY HH:mm:ss') : false;
    }

    /**
     * Validates if the expression literal identifier is a valid dev name.
     * Eg: {!testVar} - is a valid expression, returns false
     *     {^testVar} - is a valid expression literal, returns true
     * Dot at the end is allowed for SObject where dot signifies to fetch next level data
     * TODO: May not be needed with validation rules.
     * @param {String} valueToCheck the value to check, defaults to displayText
     * @param {boolean} allowDotSuffix to allow dot at the end of the expression identifier
     * @returns {*} returns false if invalid dev name chars or regex result.
     */
    isExpressionIdentifierLiteral(valueToCheck = this.state.displayText, allowDotSuffix) {
        let value;
        let devNameRegex;
        if (valueToCheck.startsWith('{!') && valueToCheck.endsWith('}')) {
            value = valueToCheck.substring(2, valueToCheck.length - 1);
        }

        if (allowDotSuffix) {
            devNameRegex = TYPING_DEV_NAME_REGEX;
        } else {
            devNameRegex = VALIDATION_DEV_NAME_REGEX;
        }

        return value ? !devNameRegex.exec(value) : (allowDotSuffix ? false : true); // {!} is valid string constant
    }
}