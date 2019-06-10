import { LightningElement, track, api } from 'lwc';
import {
    getVariant,
    booleanValue,
    getPlaceHolderLabel,
    CURRENCY_FORMAT,
    LIGHTNING_INPUT_TYPES
} from 'builder_platform_interaction/screenEditorUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';

/**
 * Wrapper used to represent visual preview of screen fields which are are input fields.
 */
export default class ScreenInputField extends LightningElement {
    @api name;
    @api value;
    @api valueType;
    @api helpText;
    @api required = false;
    @api disabled = false;
    @track formatter;
    @track type;
    @track _typeName;
    @track _label;

    @api
    get typeName() {
        return this._typeName;
    }

    set typeName(newValue) {
        this._typeName = newValue;
        if (newValue === 'Currency') {
            this.formatter = CURRENCY_FORMAT;
        }

        // This type is used for the lightning input component used to render this field.
        if (newValue === 'TextBox') {
            // if no type is specified, you get a simple text box, as that is the default.
            this.type = null;
        } else if (newValue === 'Number' || newValue === 'Currency') {
            this.type = LIGHTNING_INPUT_TYPES.NUMBER;
        } else if (newValue === 'Date') {
            this.type = LIGHTNING_INPUT_TYPES.DATE;
        } else if (newValue === 'DateTime') {
            this.type = LIGHTNING_INPUT_TYPES.DATE_TIME;
        } else if (newValue === 'Checkbox') {
            this.type = LIGHTNING_INPUT_TYPES.CHECKBOX;
        } else if (newValue === 'Password') {
            this.type = LIGHTNING_INPUT_TYPES.PASSWORD;
        } else {
            throw new Error('Unknown typeName: ' + newValue);
        }
    }

    get displayValue() {
        const hydrated = this.value && this.value.hasOwnProperty('value');
        const displayValue = hydrated ? this.value.value : this.value;

        // The lightning components used to render canvas preview for date and dateTime need
        // to be ISO format in order to be previewed. Perform this translation for preview
        // purposes only.
        if (
            (this.type === LIGHTNING_INPUT_TYPES.DATE ||
                this.type === LIGHTNING_INPUT_TYPES.DATE_TIME) &&
            displayValue &&
            displayValue.trim() !== ''
        ) {
            // Don't try to convert to a date if the value is a reference.
            // As long as this value isn't blank, we should get a valid date back. The value itself
            // should have already been validated as being a valid date from the combobox component.
            try {
                return new Date(displayValue).toISOString();
            } catch (e) {
                // If we run into any issues trying to convert the value into a date, display nothing.
                return '';
            }
        }
        return displayValue;
    }

    @api
    get variant() {
        return getVariant(this.label);
    }

    @api
    get label() {
        // Empty label is not allowed by the lightning component used to render this field type.
        // Use a placeholder label if none was provided.
        return this._label && this._label.value
            ? this._label.value
            : getPlaceHolderLabel(this.typeName);
    }

    set label(value) {
        this._label = value;
    }

    get checked() {
        if (this.type === LIGHTNING_INPUT_TYPES.CHECKBOX) {
            if (this.value === GLOBAL_CONSTANTS.BOOLEAN_TRUE) {
                return true;
            } else if (this.value === GLOBAL_CONSTANTS.BOOLEAN_FALSE) {
                return false;
            }
            return this.value ? booleanValue(this.value) : false;
        }
        return false;
    }
}
