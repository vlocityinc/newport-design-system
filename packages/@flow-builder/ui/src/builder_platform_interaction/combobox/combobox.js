import { Element, api, track } from 'engine';
import { FetchMenuDataEvent, ValueChangedEvent } from 'builder_platform_interaction-events';
import { filterMatches } from 'builder_platform_interaction-data-mutation-lib';

const SELECTORS = {
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
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
            this.comboboxVariant = 'label-hidden';
        } else {
            this.comboboxLabel = value;
        }
    }

    @api
    get label() {
        return this.comboboxLabel;
    }

    /**
     * Pass the error message on to lightning-grouped-combobox
     * @type {String}
     */
    @api errorMessage;

    /**
     * If true, only references are allowed in this combobox
     */
    @api noLiteralsAllowed = false;

    /**
     * Input value for the combobox.
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
     * Datatype for this combobox
     * Only needed for date/dateTime since this changes the shape of the combobox
     * TODO We may or may not need another property for literalsAllowed (error on blur)
     * @param {String} dataType The dataType that this combobox accepts
     */
    @api
    set type(dataType) {
        // TODO Need to configure this once the dependency for extra combobox
        // is completed. Show/hide certain options
        this.dataType = dataType;
    }

    @api
    get type() {
        return this.dataType;
    }

    /**
     * Menu items that the combobox would show.
     * Expected in the exact format the lightning-grouped-combobox needs.
     * @param {Array} data - the menu data
     */
    @api
    set menuData(data) {
        this.fullMenuData = data;
        this.state.filteredMenuData = data;
        this.state.showActivityIndicator = false;
    }

    @api
    get menuData() {
        return this.fullMenuData;
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

    fullMenuData = [];

    isResourceState = false;

    comboboxVariant = 'standard';

    comboboxLabel;

    dataType;

    /**
     * Called once the component has finished rendering to set the error message
     */
    renderedCallback() {
        const groupedCombobox = this.root.querySelector(SELECTORS.GROUPED_COMBOBOX);
        if (groupedCombobox && this.errorMessage) {
            groupedCombobox.setCustomValidity(this.errorMessage);
        }
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
            previousValue === '{' && !this.isResourceState) {
            this.isResourceState = true;
            this.setValueAndCursor('');
        // Or if value starts with {! & ends with }
        } else if (this.state.value.startsWith('{!') && this.state.value.endsWith('}')) {
            this.isResourceState = true;
        } else {
            this.isResourceState = false;
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

        // Get next level menu data
        this.fetchMenuData(this.getSanitizedValue());
    }

    /**
     * fires an event to validate combobox value
     */
    handleBlur() {
        // do validation
        if (this.isResourceState && this.state.value.charAt(this.state.value.length - 2) === '.') {
            this.state.value = this.state.value.substring(0, this.state.value.length - 2) + '}';
        }

        if (this.state.value) {
            const valueChangedEvent = new ValueChangedEvent(
                this.state.value);
            this.dispatchEvent(valueChangedEvent);
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
        if (this.isResourceState) {
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
        if (this.isResourceState) {
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
        if (this.isResourceState && lastIndex !== -1) {
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
}