import { Element, api, track } from 'engine';
import { parseDateTime } from 'builder_platform_interaction-date-time-utils';
import { FetchMenuDataEvent, ComboboxValueChangedEvent, FilterMatchesEvent, NewResourceEvent, ItemSelectedEvent } from 'builder_platform_interaction-events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { COMBOBOX_NEW_RESOURCE_VALUE } from 'builder_platform_interaction-expression-utils';
import { isUndefinedOrNull, formatDate } from 'builder_platform_interaction-common-utils';
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
        if (!value || value === '') {
            this._comboboxVariant = 'label-hidden';
        } else {
            this._comboboxLabel = value;
        }
    }

    @api
    get label() {
        return this._comboboxLabel;
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
     * Input value for the combobox.
     * Combobox expects and returns date time value in 'MM/DD/YYYY HH:mm:ss TZD' format.
     * Note: Date time format is under discussion and might change.
     * @param {Object} item - The value of the combobox
     */
    @api
    set value(item) {
        // item should have displayText
        if (item && !isUndefinedOrNull(item.displayText)) {
            this._item = item;
            this._lastRecordedItem = item;
            this.state.displayText = item.displayText;
            this._lastRecordedDisplayText = item.displayText;
            this.updateInputIcon();
            this.setMergeFieldState();
        } else {
            // Set to empty string
            this.state.displayText = '';
            this._lastRecordedDisplayText = '';
        }
    }

    @api
    get value() {
        return this._item;
    }

    /**
     * Use this when there is not item associated but need to populate the combobox with a literal
     * @param {String} text The text to set
     */
    @api
    set displayText(text) {
        // If item is already set, that has precedence over setting displayText
        // displayText should only be set in the case of literals
        if (this._item) {
            // do nothing
        } else if (!isUndefinedOrNull(text)) {
            this.state.displayText = text;
            this._lastRecordedDisplayText = text;
            this.updateInputIcon();
            this.setMergeFieldState();
        } else if (isUndefinedOrNull(text)) {
            // Set to empty string
            this.state.displayText = '';
            this._lastRecordedDisplayText = '';
        }
    }

    @api
    get displayText() {
        return this.state.displayText;
    }

    /**
     * Datatype for this combobox.
     * Needed for validation for literal and showing date picker for date/datetime.
     * @param {String} dataType The FlowDataType that this combobox accepts.
     */
    @api
    set type(dataType) {
        if (!Object.values(FLOW_DATA_TYPE).find(type => type.value === dataType)) {
            throw new Error(`Data type must be non-empty and a valid Flow Data Type but instead was ${dataType}`);
        } else {
            this._dataType = dataType;
        }

        // No literals allowed for SObject and Boolean data type
        if ([FLOW_DATA_TYPE.SOBJECT.value, FLOW_DATA_TYPE.BOOLEAN.value].includes(this._dataType)) {
            this._isLiteralAllowed = false;
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

    /* ***************** */
    /* Private Variables */
    /* ***************** */

    /**
     * This is true only when the expression is a valid expression identifier.
     * Eg: {!testVar} true
     *     {!testVar&} false since it is a literal
     */
    _isMergeField = false;

    _comboboxVariant = 'standard';

    _comboboxLabel;

    _dataType;

    _isLiteralAllowed = true;

    _lastRecordedDisplayText;

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
        this.setErrorMessage(this.errorMessage);
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * Fires an event to filter the current menu data
     * @param {Object} event - Event fired from grouped-combobox
     */
    handleTextInput(event) {
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
        // TODO: The following code doesn't account for highlighting and deleting and copy pasting
        if (this._isMergeField) {
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

        this.setMergeFieldState();
        this.updateInputIcon();

        // Get next level menu data if the selected option hasNext
        const item = this.findItem(event.detail.value);
        const itemHasNextLevel = item && item.hasNext;

        this._item = item;
        this._base = item.displayText;

        this.fireItemSelectedEvent(item);

        if (itemHasNextLevel) {
            this.fireFetchMenuDataEvent(item);
        }

        // And add a period if selected option has next level
        this.setValueAndCursor(item.displayText, itemHasNextLevel);
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
        this.validate();

        // Only fire event if value has changed
        if ((this.state.displayText !== this._lastRecordedDisplayText) || (this._item !== this._lastRecordedItem)) {
            this.fireComboboxValueChangedEvent(this._item, this.state.displayText, this._errorMessage);

            // Update _lastRecordedItem && _lastRecordedDisplayText
            this._lastRecordedDisplayText = this.state.displayText;
            this._lastRecordedItem = this._item;
        }
    }

    /* **************************** */
    /*    Private Helper methods    */
    /* **************************** */

    /**
     * Set the resource state if the value start with '{!' and ends with '}'
     */
    setMergeFieldState() {
        if (this.state.displayText.startsWith('{!') && this.state.displayText.endsWith('}')) {
            this._isMergeField = !this.isExpressionIdentifierLiteral(true);
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
            for (let i = 0; i < this.state.menuData.length; i++) {
                this.state.menuData[i].items.forEach(item => {
                    if (item.displayText === text) {
                        matchedItems.push(item);
                    }
                });
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
            foundItem = this.state.menuData[i].items.find(item => {
                // add item to the cache whether or not it's the foundItem
                this._itemCache[item.value] = item;
                return item.value === value;
            });
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
        if ((this.state.displayText.length === previousValue.length + 1) &&
            (previousValue.charAt(previousValue.length - 2) !== '.') &&
            (this.state.displayText.charAt(this.state.displayText.length - 2) === '.')) {
            return true;
        }
        return false;
    }

    /**
     * Determines whether a period was deleted
     * @param {String} previousValue the previous value of the combobox
     * @returns {Boolean} whether a period was deleted
     */
    wasPeriodDeleted(previousValue) {
        // a period was deleted in resource state
        if ((this.state.displayText.length === previousValue.length - 1) &&
            (this.state.displayText.charAt(this.state.displayText.length - 2) !== '.') &&
            (previousValue.charAt(previousValue.length - 2) === '.')) {
            return true;
        }
        return false;
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
        input.setSelectionRange(this.state.displayText.length - 1, this.state.displayText.length - 1);
    }

    /**
     * Get the proper value depending on the combobox state.
     * If in resource state, returns value without {! & }
     * @returns {String} The resource value or full text
     */
    getSanitizedValue() {
        if (this._isMergeField) {
            return this.state.displayText.substring(2, this.state.displayText.length - 1);
        }
        return this.state.displayText;
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
     * Validates the value of the combobox.
     */
    validate() {
        this.clearErrorMessage();

        // No validation for three or more level of data to let super user type in higher level values.
        if (this.getLevel() > MAX_LEVEL_MENU_DATA) {
            return;
        }

        if (this.state.displayText) {
            if (this._isMergeField) {
                this.validateResource();
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
            this.validateLiteralForDataType(this.state.displayText);
        } else if (!this._item) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }

    /**
     * Validates the resource value (value enclosed in {! and } ) selected or entered.
     */
    validateResource() {
        if (this.isExpressionIdentifierLiteral() && this._isLiteralAllowed) {
            this.validateLiteralForDataType(this.state.displayText);
        } else if (!this._item) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }

    /**
     * Validates the literal value entered in the combobox against the _dataType
     * @param {String} value literal value
     */
    validateLiteralForDataType(value) {
        switch (this._dataType) {
            case FLOW_DATA_TYPE.NUMBER.value:
            case FLOW_DATA_TYPE.CURRENCY.value:
                this.validateNumber(value);
                break;
            case FLOW_DATA_TYPE.DATE.value:
                this.validateAndFormatDate(value);
                break;
            case FLOW_DATA_TYPE.DATE_TIME.value:
                this.validateAndFormatDate(value, true);
                break;
            default:
                break;
        }
    }

    /**
     * Validate the input value is a valid number and set error
     * @param {String} value - input number string
     */
    validateNumber(value) {
        if (this.isValidNumber(value)) {
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
     * @param {String} dateString input date or date time string
     * @param {Boolean} isDateTime whether to validate for date time
     */
    validateAndFormatDate(dateString, isDateTime) {
        const dateValue = this.isValidDateTime(dateString);
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
     * @param {boolean} allowDotSuffix to allow dot at the end of the expression identifier
     * @returns {*} returns false if invalid dev name chars or regex result.
     */
    isExpressionIdentifierLiteral(allowDotSuffix) {
        let value;
        let devNameRegex;
        if (this.state.displayText.startsWith('{!') && this.state.displayText.endsWith('}')) {
            value = this.state.displayText.substring(2, this.state.displayText.length - 1);
        }

        if (allowDotSuffix) {
            devNameRegex = TYPING_DEV_NAME_REGEX;
        } else {
            devNameRegex = VALIDATION_DEV_NAME_REGEX;
        }

        return value ? !devNameRegex.exec(value) : true; // {!} is valid string constant
    }
}
