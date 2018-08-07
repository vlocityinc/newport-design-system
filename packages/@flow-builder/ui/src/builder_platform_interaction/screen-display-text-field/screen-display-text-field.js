import { Element, api, track } from 'engine';
import { getPlaceHolderLabel } from 'builder_platform_interaction-screen-editor-utils';

/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class ScreenDisplayTextField extends Element {
    @api title;
    @api typeName;
    @track _value;

    get isDisplayRichTextType() {
        return this.typeName === 'DisplayRichText';
    }

    @api
    get value() {
        return this._value && this._value.value ? this._value.value : getPlaceHolderLabel(this.typeName);
    }

    @api
    set value(newVal) {
        this._value = newVal;
    }
}