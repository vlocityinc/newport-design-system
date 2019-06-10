import { LightningElement, api, track } from 'lwc';
import { getPlaceHolderLabel } from 'builder_platform_interaction/screenEditorUtils';

/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class ScreenDisplayTextField extends LightningElement {
    @api title;
    @api typeName;
    @track _value;

    @api
    get value() {
        if (this._value && this._value.value) {
            // Replacing new line with <br /> tag as done at runtime (see _createOutput in factory.js)
            return this._value.value.replace(/\n/g, '<br />');
        }
        return getPlaceHolderLabel(this.typeName);
    }

    set value(newVal) {
        this._value = newVal;
    }
}
