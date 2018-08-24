import { LightningElement, api, track } from 'lwc';
import { getVariant, getPlaceHolderLabel } from 'builder_platform_interaction-screen-editor-utils';

/**
 * Wrapper used to represent visual preview of screen fields which are are text areas.
 */
export default class ScreenTextareaField extends LightningElement {
    @api value;
    @api required = false;
    @track _helpText;
    @track _label;

    @api
    get variant() {
        return getVariant(this.label);
    }

    set helpText(newValue) {
        this._helptext = newValue;
    }

    @api
    get helpText() {
        return (this._helptext && this._helptext.value) || null;
    }

    set label(value) {
        this._label = value;
    }

    @api
    get label() {
        // Empty label is not allowed by the lightning component used to render this field type.
        // Use a placeholder label if none was provided.
        return this._label && this._label.value ? this._label.value : getPlaceHolderLabel('LargeTextArea');
    }
}