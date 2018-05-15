import { Element, api, track, unwrap } from 'engine';

// QUILL supported formats
const rteFormats = ['abbr', 'address', 'align', 'alt', 'background', 'bdo', 'big', 'blockquote', 'bold', 'cite', 'clean', 'code', 'code-block', 'color', 'data-fileid', 'del', 'dfn', 'direction', 'divider', 'dl', 'dd', 'dt', 'font', 'header', 'image', 'indent', 'ins', 'italic', 'kbd', 'link', 'list', 'q', 'samp', 'script', 'size', 'small', 'strike', 'sup', 'table', 'tt', 'underline', 'var'];

/*
 * A property editor for the dynamic properties editor (this will be part of the new LC properties editor)
 * Will be refactored as part of  - W-4947239
 */
export default class ScreenPropertyField extends Element {
    @api element;
    @track _property; // TODO: Move back to @api, no need to track? - W-4947239
    @track classlist;
    @track errors;

    @api get formats() {
        return rteFormats;
    }

    @api set formats(value) {
        throw new Error('You cannot change rich text editor formats');
    }

    @api get property() {
        return this._property;
    }

    @api set property(value) {
        this._property = unwrap(value);
        this.setVisible(this._property);
    }

    @api setVisible(value) {
        this.classlist = value ? 'container prop-visible' : 'container prop-invisible';
    }

    @api setErrors(errors) {
        this.errors = errors;
    }

    @api clearErrors() {
        if (this.errors && this.errors.length) {
            this.errors = null;
        }
    }

    get propertyValue() {
        return this.element[this.property.name];
    }

    get isString() {
        return this.property.type === 'string';
    }

    get isLongString() {
        return this.property.type === 'long_string';
    }

    get isRichString() {
        return this.property.type === 'rich_string';
    }

    get isBoolean() {
        return this.property.type === 'boolean';
    }

    get isNumber() {
        return this.property.type === 'number';
    }

    @api setValue(newValue) {
        this.property.value = newValue;
    }

    @api getValue() {
        const input = this.root.querySelector('.property-input');
        if (this.isString || this.isLongString || this.isRichString) {
            return input.value;
        } else if (this.isBoolean) {
            return input.checked;
        } else if (this.isNumber) {
            return input.value;
        }

        throw new Error('Unknown type for property field ' + this.property.type);
    }

    handleChange = (event) => {
        this.dispatchEvent(new CustomEvent('valuechange', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {field: this, event}
        }));
        event.stopPropagation();
    }

    handleBlur = (event) => {
        this.dispatchEvent(new CustomEvent('blur', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {field: this, event}
        }));
        event.stopPropagation();
    }
}
