import { Element, track, api } from 'engine';
import { getVariant, currencyFormat, lightningInputTypes } from 'builder_platform_interaction-screen-editor-utils';


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
            this.formatter = currencyFormat;
        }

        // This type is used for the lightning input component used to render this field.
        if (newValue === 'TextBox') {
            // if no type is specified, you get a simple text box, as that is the default.
            this.type = null;
        } else if (newValue === 'Number') {
            this.type = lightningInputTypes.number;
        } else if (newValue === 'Currency') {
            this.type = lightningInputTypes.number;
        } else if (newValue === 'Date') {
            this.type = lightningInputTypes.date;
        } else if (newValue === 'DateTime') {
            this.type = lightningInputTypes.dateTime;
        } else if (newValue === 'Checkbox') {
            this.type = lightningInputTypes.checkbox;
        } else if (newValue === 'Password') {
            this.type = lightningInputTypes.password;
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
        return (this._helptext && this._helptext.value) || null;
    }
}