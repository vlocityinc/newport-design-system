import { Element, track, api } from 'engine';
import { getVariant, booleanValue, CURRENCY_FORMAT, LIGHTNING_INPUT_TYPES } from 'builder_platform_interaction-screen-editor-utils';


/**
 * Wrapper used to represent visual preview of screen fields which are are input fields.
 */
export default class ScreenInputField extends Element {
    @api name;
    @api label = ' '; // empty label is not allowed by the lightning component used to render this field type.
    @api value;
    @api required = false;
    @api disabled = false;
    @track formatter;
    @track type;
    @track _typeName;
    @track _helpText;

    @api
    get typeName() {
        return this._typeName;
    }

    @api
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

    @api
    get variant() {
        return getVariant(this.label);
    }

    @api
    set helpText(newValue) {
        this._helptext = newValue;
    }

    @api
    get helpText() {
        return this._helptext ? this._helptext.value : null;
    }

    get checked() {
        return this.type === LIGHTNING_INPUT_TYPES.CHECKBOX && booleanValue(this.value);
    }
}