import { Element, api, track } from 'engine';
import { parseDateTime } from 'lightning-date-time-utils';
import { FetchMenuDataEvent, ValueChangedEvent } from 'builder_platform_interaction-events';
import { filterMatches } from 'builder_platform_interaction-data-mutation-lib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-constant';

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
        filteredMenuData: [],
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
        this.updateInputIcon();
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
        this._fullMenuData = data;
        this.state.filteredMenuData = data;
        this.state.showActivityIndicator = false;
    }

    @api
    get menuData() {
        return this._fullMenuData;
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

    _fullMenuData = [];

    _isResourceState = false;

    _comboboxVariant = 'standard';

    _comboboxLabel;

    _dataType;

    _isLiteralAllowed = true;


    /**
     * Called once the component has finished rendering to set the error message
     */
    renderedCallback() {
        this.setErrorMessage(this.errorMessage);
    }

    /* ************************/
    /*     Event handlers     */
    /* ************************/

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
        // Or if value starts with {! & ends with }
        } else if (this.state.value.startsWith('{!') && this.state.value.endsWith('}')) {
            this._isResourceState = true;
        } else {
            this._isResourceState = false;
        }

        const sanitizedValue = this.getSanitizedValue();

        // If a . is typed or deleted when in resource state, fire an event to fetch new menu data
        if (this.wasPeriodEnteredOrDeleted(previousValue)) {
            this.fetchMenuData(sanitizedValue);
        }

        // Filter the menu data
        this.state.filteredMenuData = filterMatches(this.getFilterText(sanitizedValue), this.menuData);
    }

    /**
     * Fires an event to fetch the next level
     * @param {Object} event - Event fired from grouped-combobox
     */
    handleSelect(event) {
        // Replace the value with selected option value with braces
        // TODO need to add period if hasNextLevel is true
        this.setValueAndCursor(event.detail.value);
        this.updateInputIcon();

        this._isResourceState = true;

        // Get next level menu data
        this.fetchMenuData(this.getSanitizedValue());
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
        this.clearErrorMessage();
        this.validate();

        // fire value changed event with no error
        if (this.getGroupedCombobox() ? this.getGroupedCombobox().checkValidity() : false) {
            this.fireValueChangedEvent();
        }
    }

    /* ******************************/
    /*    Private Helper methods    */
    /* ******************************/

    /**
     * Dispatches the FetchMenuData Event and makes the spinner active
     * @param {String} value - the value to fetch menu data on
     */
    fetchMenuData(value) {
        const fetchMenuDataEvent = new FetchMenuDataEvent(value);
        this.dispatchEvent(fetchMenuDataEvent);
        this.state.showActivityIndicator = true;
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
     */
    setValueAndCursor(value) {
        const combobox = this.root.querySelector(SELECTORS.GROUPED_COMBOBOX);
        const input = combobox.getElementsByTagName('input')[0];

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
        this.fireValueChangedEvent();
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
        this.fireValueChangedEvent(customErrorMessage);
    }

    /**
     * Fire value change event with error message if provided
     * @param {String} errorMessage optional error message
     */
    fireValueChangedEvent(errorMessage) {
        const valueChangedEvent = errorMessage ? new ValueChangedEvent(this.state.value, errorMessage)
            : new ValueChangedEvent(this.state.value);
        this.dispatchEvent(valueChangedEvent);
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
        if (this.state.value) {
            if (this._isResourceState) {
                this.validateResource();
            } else {
                this.validateLiteral();
            }
        } else if (this.required) {
            this.setErrorMessage(ERROR_MESSAGE.GENERIC);
        } else {
            this.clearErrorMessage();
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
        } else {
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
     * TODO: May not be needed with validation rules.
     * @param {String} inputValue expression literal string
     * @returns {*} returns false if invalid dev name chars or regex result.
     */
    isExpressionIdentifierLiteral(inputValue) {
        const value = this.getSanitizedValue(inputValue);
        const devNameRegex = new RegExp('^[a-zA-Z]+\\w+[a-zA-Z0-9]$');
        return value ? !devNameRegex.exec(value) : true; // {!} is valid string constant
    }
}