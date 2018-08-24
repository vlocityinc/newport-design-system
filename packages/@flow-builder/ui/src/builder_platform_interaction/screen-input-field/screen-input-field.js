import { LightningElement, track, api } from 'lwc';
import { getVariant, booleanValue, getPlaceHolderLabel, CURRENCY_FORMAT, LIGHTNING_INPUT_TYPES } from 'builder_platform_interaction-screen-editor-utils';
import { isMergeField } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Wrapper used to represent visual preview of screen fields which are are input fields.
 */
export default class ScreenInputField extends LightningElement {
    @api name;
    @api value;
    @api required = false;
    @api disabled = false;
    @track formatter;
    @track type;
    @track _typeName;
    @track _helpText;
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
        } else if (newValue === 'Number') {
            this.type = LIGHTNING_INPUT_TYPES.NUMBER;
        } else if (newValue === 'Currency') {
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
        // The lightning components used to render canvas preview for date and dateTime need
        // to be ISO format in order to be previewed. Perform this translation for preview
        // purposes only.
        if ((this.type === LIGHTNING_INPUT_TYPES.DATE || this.type === LIGHTNING_INPUT_TYPES.DATE_TIME) && this.value) {
            // If the value is a merge field, display nothing. In the case of date and dateTime, we can't display a preview
            // of a merge field.
            if (isMergeField(this.value)) {
                return '';
            }
            return new Date(this.value).toISOString();
        }
        return this.value;
    }

    @api
    get variant() {
        return getVariant(this.label);
    }

    set helpText(newValue) {
        this._helptext = newValue;
    }

    @api
    get helpText() {
        return this._helptext ? this._helptext.value : null;
    }

    @api
    get label() {
        // Empty label is not allowed by the lightning component used to render this field type.
        // Use a placeholder label if none was provided.
        return this._label && this._label.value ? this._label.value : getPlaceHolderLabel(this.typeName);
    }

    set label(value) {
        this._label = value;
    }

    get checked() {
        return this.type === LIGHTNING_INPUT_TYPES.CHECKBOX && booleanValue(this.value);
    }
}