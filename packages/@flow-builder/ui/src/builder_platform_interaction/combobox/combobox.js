import { Element, api, track } from 'engine';
import { parseDateTime } from 'builder_platform_interaction-date-time-utils';
import { FetchMenuDataEvent, ValueChangedEvent, FilterMatchesEvent } from 'builder_platform_interaction-events';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

const SELECTORS = {
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

/**
 * Error message map for validation of literal value.
 * TODO: Use labels and doc review. W-4813532
 */
const ERROR_MESSAGE = {
    [FLOW_DATA_TYPE.CURRENCY]: 'Not a valid currency. Re-enter in decimal format.',
    [FLOW_DATA_TYPE.NUMBER]: 'Not a valid number. Re-enter in decimal format.',
    [FLOW_DATA_TYPE.DATE] : 'Re-enter date as MM/DD/YYYY.',
    [FLOW_DATA_TYPE.DATE_TIME] : 'Re-enter datetime as MM/DD/YYYY HH:mm:ss TZD.',
    GENERIC: 'You have entered an invalid value.',
};

export default class Combobox extends Element {
    @track
    state = {
        value: '',
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
     * @param {String} value - The value of the combobox
     */
    @api
    set value(value) {
        this.state.value = value;
        this._lastRecordedValue = value;
        this.updateInputIcon();
        this.setResourceState();
    }

    @api
    get value() {
        return this.state.value;
    }

    /**
     * Datatype for this combobox.
     * Needed for validation for literal and showing date picker for date/datetime.
     * @param {String} dataType The FlowDataType that this combobox accepts.
     */
    @api
    set type(dataType) {
        if (!Object.values(FLOW_DATA_TYPE).includes(dataType)) {
            throw new Error(`Data type must be non-empty and a valid Flow Data Type but instead was ${dataType}`);
        } else {
            this._dataType = dataType;
        }

        // No literals allowed for SObject and Boolean data type
        if ([FLOW_DATA_TYPE.SOBJECT, FLOW_DATA_TYPE.BOOLEAN].includes(this._dataType)) {
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
    _isResourceState = false;

    _comboboxVariant = 'standard';

    _comboboxLabel;

    _dataType;

    _isLiteralAllowed = true;

    _lastRecordedValue;

    _itemCache = {};

    _errorMessage = '';

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
        // Grab the previous value && update the current values
        const previousValue = this.state.value;
        this.state.value = event.detail.text;
        this.updateInputIcon();

        // set state to resource if value starts with {!, append the closing brace, and place cursor before it
        if (this.state.value.startsWith('{!') && this.state.value.length === 2 &&
            previousValue === '{' && !this._isResourceState) {
            this._isResourceState = true;
            this.setValueAndCursor('');
        } else {
            this.setResourceState();
        }

        const sanitizedValue = this.getSanitizedValue();

        // If a . is typed or deleted when in resource state, fire an event to fetch new menu data
        if (this.wasPeriodEnteredOrDeleted(previousValue)) {
            this.fireFetchMenuDataEvent(sanitizedValue);
        }

        // Fire event to filter Menu Data
        this.fireFilterMatchesEvent(this.getFilterText(sanitizedValue));
    }

    /**
     * Fires an event to fetch the next level
     * @param {Object} event - Event fired from grouped-combobox
     */
    handleSelect(event) {
        this._isResourceState = true;
        this.updateInputIcon();

        // Get next level menu data if the selected option hasNext
        const item = this.findItem();
        const itemHasNextLevel = item && item.hasNext;

        if (itemHasNextLevel) {
            this.fireFetchMenuDataEvent(this.getSanitizedValue());
        }

        // Replace the value with selected option value with braces
        // And add a period if selected option has next level
        this.setValueAndCursor(event.detail.value, itemHasNextLevel);
    }

    /**
     * fires an event to validate combobox value
     */
    handleBlur() {
        // Remove the last dot from the expression
        if (this._isResourceState && this.state.value.charAt(this.state.value.length - 2) === '.') {
            this.state.value = this.state.value.substring(0, this.state.value.length - 2) + '}';
        }

        // do validation
        this.validate();

        // Only fire event if value has changed
        if (this.state.value && this.state.value !== this._lastRecordedValue) {
            let item;
            if (this._isResourceState) {
                item = this.findItem();
            }

            this.fireValueChangedEvent(
                (item && item.id) ? item.id : this.state.value,
                this._errorMessage
            );

            // Update _lastRecordedValue to the current value
            this._lastRecordedValue = this.state.value;
        }
    }

    /* **************************** */
    /*    Private Helper methods    */
    /* **************************** */

    /**
     * Set the resource state if the value start with '{!' and ends with '}'
     */
    setResourceState() {
        if (this.state.value.startsWith('{!') && this.state.value.endsWith('}')) {
            this._isResourceState = !this.isExpressionIdentifierLiteral(this.state.value, true);
        } else {
            this._isResourceState = false;
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
     * @param {String} value The value to send
     * @param {String} errorMessage optional error message
     */
    fireValueChangedEvent(value, errorMessage) {
        const valueChangedEvent = (errorMessage && errorMessage !== '') ?
            new ValueChangedEvent(value, errorMessage) :
            new ValueChangedEvent(value);
        this.dispatchEvent(valueChangedEvent);
    }

    /**
     * Grabs the item associated with the selected value.
     * If no value is found, returns undefined
     * @returns {Object} the return value
     */
    findItem() {
        let foundItem;
        const groupCount = this.state.menuData.length;
        const sanitizedValue = this.getSanitizedValue();
        // check if the item has already been cached to avoid running through the nested arrays
        if (this._itemCache[sanitizedValue]) {
            return this._itemCache[sanitizedValue];
        }
        for (let i = 0; i < groupCount; i++) {
            foundItem = this.state.menuData[i].items.find(item => {
                // add item to the cache whether or not it's the foundItem
                this._itemCache[item.value] = item;
                return item.value === sanitizedValue;
            });
            if (foundItem) {
                return foundItem;
            }
        }
        return foundItem;
    }

    /**
     * Determines whether a period was entered or deleted
     * @param {String} previousValue the previous value of the combobox
     * @returns {Boolean} whether a period was entered or deleted
     */
    wasPeriodEnteredOrDeleted(previousValue) {
        if (this._isResourceState) {
            // a period was entered or deleted in resource state
            if ((this.state.value.length === previousValue.length + 1 &&
                this.state.value.charAt(this.state.value.length - 2) === '.') ||
                (this.state.value.length === previousValue.length - 1 &&
                previousValue.charAt(previousValue.length - 2) === '.')) {
                return true;
            }
        }
        return false;
    }

    /**
     * Sets the value with braces and places the cursor before the closing brace
     * @param {String} value the value to set
     * @param {String} hasNextLevel whether or not the selected item has a next level
     */
    setValueAndCursor(value, hasNextLevel) {
        const combobox = this.root.querySelector(SELECTORS.GROUPED_COMBOBOX);
        const input = combobox.getElementsByTagName('input')[0];

        // Add a period to the end if selected value has a next level
        if (hasNextLevel) {
            value += '.';
        }

        this.state.value = input.value = '{!' + value + '}';
        // Lightning components team may provide a method to accomplish this in the future
        input.setSelectionRange(this.state.value.length - 1, this.state.value.length - 1);
    }

    /**
     * Get the proper value depending on the combobox state.
     * If in resource state, returns value without {! & }
     * @returns {String} The resource value or full text
     */
    getSanitizedValue() {
        if (this._isResourceState) {
            return this.state.value.substring(2, this.state.value.length - 1);
        }
        return this.state.value;
    }

    /**
     * Returns value after the last . if in resource state.
     * Ex: MyAccount.MyN would return MyN
     * @param {String} sanitizedValue the already sanitized value
     * @returns {String} the filter text to search on
     */
    getFilterText(sanitizedValue) {
        const lastIndex = sanitizedValue.lastIndexOf('.');
        if (this._isResourceState && lastIndex !== -1) {
            return sanitizedValue.substring(lastIndex);
        }
        return sanitizedValue;
    }

    /**
     * Input icon search for no selection otherwise clear.
     */
    updateInputIcon() {
        if (this.state.value && this.state.value.length > 0) {
            this.state.inputIcon = 'utility:clear';
        } else {
            this.state.inputIcon = 'utility:search';
        }
    }

    /**
     * Clears an error message if any previously set on the combobox.
     */
    clearErrorMessage() {
        this.setErrorMessage('');
    }

    /**
     * Set the error message on the combobox.
     * @param {String} customErrorMessage to be set on the combobox.
     */
    setErrorMessage(customErrorMessage) {
        const groupedCombobox = this.getGroupedCombobox();
        if (groupedCombobox) {
            groupedCombobox.setCustomValidity(customErrorMessage);
        }
        this._errorMessage = customErrorMessage;
    }

    /**
     * Returns the lightning grouped combobox element.
     * @returns {Object} the grouped combobox element.
     */
    getGroupedCombobox() {
        return this.root.querySelector(SELECTORS.GROUPED_COMBOBOX);
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
        if (this.state.value) {
            if (this._isResourceState) {
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
            this.validateLiteralForDataType(this.state.value);
        } else {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }

    /**
     * Validates the resource value (value enclosed in {! and } ) selected or entered.
     */
    validateResource() {
        if (this.isExpressionIdentifierLiteral(this.state.value) && this._isLiteralAllowed) {
            this.validateLiteralForDataType(this.state.value);
        } else if (!this.findItem()) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        }
    }

    /**
     * Validates the literal value entered in the combobox against the _dataType
     * @param {String} value literal value
     */
    validateLiteralForDataType(value) {
        switch (this._dataType) {
            case FLOW_DATA_TYPE.NUMBER:
            case FLOW_DATA_TYPE.CURRENCY:
                this.validateNumber(value);
                break;
            case FLOW_DATA_TYPE.DATE:
                this.validateAndFormatDate(value);
                break;
            case FLOW_DATA_TYPE.DATE_TIME:
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
            this.state.value = this.formatDate(dateValue, isDateTime);
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
     * Formats the input date into 'MM/DD/YYYY' for date or 'MM/DD/YYYY HH:MM:SS TZ' for date time
     * Note: Date format is not final yet and might change.
     * @param {String} dateValue input Date value
     * @param {boolean} isDateTime whether to append time
     * @returns {String} formatted date string
     */
    formatDate(dateValue, isDateTime) {
        const datePart = (dateValue.getMonth() + 1).toString().padStart(2, 0) + '/'
            + dateValue.getDate().toString().padStart(2, 0) + '/' + dateValue.getFullYear();
        if (isDateTime) {
            return datePart + ' ' + dateValue.toTimeString();
        }
        return datePart;
    }

    /**
     * Validates if the expression literal identifier is a valid dev name.
     * Eg: {!testVar} - is a valid expression, returns false
     *     {^testVar} - is a valid expression literal, returns true
     * Dot at the end is allowed for SObject where dot signifies to fetch next level data
     * TODO: May not be needed with validation rules.
     * @param {String} inputValue expression literal string
     * @param {boolean} allowDotSuffix to allow dot at the end of the expression identifier
     * @returns {*} returns false if invalid dev name chars or regex result.
     */
    isExpressionIdentifierLiteral(inputValue, allowDotSuffix) {
        let value;
        let devNameRegex;
        if (this.state.value.startsWith('{!') && this.state.value.endsWith('}')) {
            value = this.state.value.substring(2, this.state.value.length - 1);
        }

        if (allowDotSuffix) {
            devNameRegex = new RegExp('^[a-zA-Z]+\\w+[a-zA-Z0-9\\.]$');
        } else {
            devNameRegex = new RegExp('^[a-zA-Z]+\\w+[a-zA-Z0-9]$');
        }

        return value ? !devNameRegex.exec(value) : true; // {!} is valid string constant
    }
}