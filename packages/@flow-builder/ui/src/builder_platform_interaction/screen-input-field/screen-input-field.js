import { Element, track, api } from 'engine';
import {
    hiddenLabel,
    standardLabel
} from 'builder_platform_interaction-screen-editor-utils';

/**
 * Wrapper used to represent visual preview of screen fields which are are input fields.
 */
export default class ScreenInputField extends Element {
    @api name;
    @api label = ' '; // empty label is not allowed by the lightning component used to render this field type.
    @api value;
    @api required = false;
    @api disabled = false;
    @track _formatter;
    @track _typeName;

    @api
    get typeName() {
        return this._typeName;
    }

    @api
    get formatter() {
        return this._formatter;
    }

    @api
    set typeName(newValue) {
        this._typeName = newValue;
        if (newValue === 'Currency') {
            this._formatter = 'currency';
        }
    }

    @api
    get variant() {
        // field labels are not required in flow, but they are required by the lightning component
        // we're using to preview them. Hide the label if the label is an empty string or equivalent.
        if (this.label === undefined || this.label === null || this.label.trim().length === 0) {
            return hiddenLabel;
        }
        return standardLabel;
    }

    @api
    get type() {
        if (this._typeName === 'TextBox') {
            // if no type is specified, you get a simple text box, as that is the default.
            return null;
        }
        if (this._typeName === 'Number') {
            return 'number';
        }
        if (this._typeName === 'Currency') {
            return 'number';
        }
        if (this._typeName === 'Date') {
            return 'date';
        }
        if (this._typeName === 'DateTime') {
            return 'datetime-local';
        }
        if (this._typeName === 'Checkbox') {
            return 'checkbox';
        }
        if (this._typeName === 'Password') {
            return 'password';
        }
        throw new Error('Unknown typeName: ' + this.typeName);
    }
}