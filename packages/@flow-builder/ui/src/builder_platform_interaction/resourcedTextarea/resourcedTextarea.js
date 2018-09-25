import { LightningElement, api, track } from 'lwc';
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LIGHTNING_INPUT_VARIANTS, booleanAttributeValue } from "builder_platform_interaction/screenEditorUtils";
import { LABELS } from "./resourcedTextareaLabels";

const SELECTORS = {
    TEXTAREA: 'textarea',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker'
};

export default class ScreenTextAreaPropertyField extends LightningElement {
    elementConfig = {
        elementType: ELEMENT_TYPE.SCREEN,
        shouldBeWritable: true
    };

    resourceComboBoxConfig = BaseResourcePicker.getComboboxConfig(
        LABELS.resourcePickerTitle, // Label
        LABELS.resourcePickerPlaceholder, // Placeholder
        null, // errorMessage
        false, // literalsAllowed
        false, // required
        false, // disabled
        'String', // type
        LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN // variant
    );

    @api name;
    @api label;
    @api required =  false;
    @api readOnly = false;
    @api helpText;
    @track error;
    labels = LABELS;
    _value; // Not tracking cause we have to set the value of the textarea directly in the dom in order to set the position of the cursor

    @api setCustomValidity(message) {
        this.error = message;
    }

    @api get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
    }

    get classList() {
        return  'container slds-input slds-grid slds-grid_vertical' + (this.error ? ' has-error' : '');
    }

    get isRequired() {
        return booleanAttributeValue(this, 'required');
    }

    handleResourcePickerSelection = (event) => {
        event.stopPropagation();
        const text = event.detail.item.displayText;
        if (text && !event.detail.item.hasNext) {
            // Insert the item at cursor position and notify up
            const textarea = this.template.querySelector(SELECTORS.TEXTAREA);
            const val = textarea.value;
            const start = textarea.selectionStart || 0;
            const end = textarea.selectionEnd || start;
            const pre = val.substring(0, start);
            const post = val.substring(end, val.length);
            const cursorPosition = start + text.length;
            this._value = (pre + text + post);
            textarea.value = this._value;
            textarea.setSelectionRange(cursorPosition, cursorPosition);
            Promise.resolve().then(() => {
                this.template.querySelector(SELECTORS.FEROV_RESOURCE_PICKER).value = null;
                this.fireEvent(this._value, null);
            });
        }
    }

    handleEvent(event) {
        // Change events are not composed, let's re-dispatch
        const val = this.template.querySelector(SELECTORS.TEXTAREA).value;
        if (val !== this.value) {
            this.value = val;
            this.fireEvent(val, null);
        }

        event.stopPropagation();
    }

    fireEvent(value, error) {
        const event = new CustomEvent('change', {detail:{value, error}, cancelable: true, composed: true, bubbles: true});
        this.dispatchEvent(event);
    }
}