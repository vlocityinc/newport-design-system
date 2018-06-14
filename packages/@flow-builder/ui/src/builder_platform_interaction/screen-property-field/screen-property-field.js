import { Element, api, track } from 'engine';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { isItemHydratedWithErrors } from 'builder_platform_interaction-data-mutation-lib';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

// QUILL supported formats
const rteFormats = ['abbr', 'address', 'align', 'alt', 'background', 'bdo', 'big', 'blockquote', 'bold', 'cite', 'clean', 'code', 'code-block', 'color', 'data-fileid', 'del', 'dfn', 'direction', 'divider', 'dl', 'dd', 'dt', 'font', 'header', 'image', 'indent', 'ins', 'italic', 'kbd', 'link', 'list', 'q', 'samp', 'script', 'size', 'small', 'strike', 'sup', 'table', 'tt', 'underline', 'var'];

/*
 * A property editor
 */
export default class ScreenPropertyField extends Element {
    @api name;
    @api label;
    @api type;
    @api required =  false;
    @api readOnly = false;
    @api helpText;

    @track _value;
    labels = LABELS;

    @api get formats() {
        return rteFormats;
    }

    @api set formats(value) {
        throw new Error('You cannot change rich text editor formats');
    }

    @api set value(newValue) {
        this._value = newValue;
        const input = this.input;
        if (input && input.setCustomValidity) {
            input.setCustomValidity(this.error);
        }
    }

    @api get value() {
        return this._value;
    }

    get error() {
        return (this.value && this.value.error) || '';
    }

    get classList() {
        return this.value && this.value.error ? 'property-input slds-has-error' : 'property-input';
    }

    get propertyValue() {
        if (this.value) {
            return this.value.value ? this.value.value : this.value;
        }

        return null;
    }

    get isRequired() {
        return this.required && (this.required === 'true' || this.required === 'required');
    }

    get isChecked() {
        return this.isBoolean && (this.value === 'true' || this.value ===  true);
    }

    get isString() {
        return this.type === 'string';
    }

    get isLongString() {
        return this.type === 'long_string';
    }

    get isRichString() {
        return this.type === 'rich_string';
    }

    get isBoolean() {
        return this.type === 'boolean';
    }

    get isNumber() {
        return this.type === 'number';
    }

    get isInput() {
        return !this.isLongString && !this.isRichString;
    }

    get inputType() {
        if (this.isNumber) {
            return 'number';
        } else if (this.isBoolean) {
            return 'checkbox';
        }

        return 'text';
    }

    get input() {
        return this.template.querySelector('.property-input');
    }

    get domValue() {
        const input = this.input;
        if (this.isString || this.isLongString || this.isRichString) {
            return input.value;
        } else if (this.isBoolean) {
            return input.checked;
        } else if (this.isNumber) {
            return input.value;
        }

        throw new Error('Unknown type for property field ' + this.type);
    }

    get dehydratedValue() {
        return isItemHydratedWithErrors(this.value) ? this.value.value : this.value;
    }

    handleEvent = () => {
        const newValue = this.domValue;
        if (this.dehydratedValue !== newValue) {
            this.dispatchEvent(new PropertyChangedEvent(this.name, newValue, null, null, this.value));
        }
    }
}
