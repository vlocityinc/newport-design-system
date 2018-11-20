import { LightningElement, api, track } from 'lwc';
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { validateTextWithMergeFields } from "builder_platform_interaction/mergeFieldLib";
import { LIGHTNING_INPUT_VARIANTS, booleanAttributeValue } from "builder_platform_interaction/screenEditorUtils";
import { LABELS } from "./resourcedTextareaLabels";

const SELECTORS = {
    TEXTAREA: 'textarea',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker'
};

export default class ResourcedTextarea extends LightningElement {
    elementConfig = {
        elementType: ELEMENT_TYPE.SCREEN,
    };

    resourceComboBoxConfig = BaseResourcePicker.getComboboxConfig(
        LABELS.resourcePickerTitle, // Label
        LABELS.resourcePickerPlaceholder, // Placeholder
        null, // errorMessage
        false, // literalsAllowed
        false, // required
        false, // disabled
        'String', // type
        true, // enableFieldDrilldown
        LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN, // variant
    );

    @api name;
    @api label;
    @api required =  false;
    @api readOnly = false;
    @api helpText;
    @api maxLength;
    @api spinnerAlternativeText;
    @api showGlobalVariables = false;

    // IMPORTANT: For new resource to work, the containing property editor must have newResourcesCallback included
    // in the call to invokePropertyEditor in editor.js
    @api hideNewResource = false;

    @track error;
    @track spinnerActive;
    @track _value;

    labels = LABELS;
    _hydrated;

    @api setCustomValidity(message) {
        this.error = message;
    }

    @api get value() {
        return this._hydrated ?  {value: this._value, error: this.error} : this._value;
    }

    set value(val) {
        this._hydrated = val && val.hasOwnProperty('value') && val.hasOwnProperty('error');

        if (this._hydrated) {
            this._value = val.value;
            this.setCustomValidity(val.error);
        } else {
            this._value = val;
        }

        const textarea = this.template.querySelector(SELECTORS.TEXTAREA);
        if (textarea) {
            textarea.value = this._value;
        }
    }

    get classList() {
        return  'container slds-grid slds-grid_vertical' + (this.error ? ' has-error' : '');
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
            textarea.value = (pre + text + post);
            textarea.setSelectionRange(start + text.length, start + text.length);
            this.fireEvent(textarea.value, null);

            Promise.resolve().then(() => {
                this.template.querySelector(SELECTORS.FEROV_RESOURCE_PICKER).value = null;
            });
        }
    }

    handleEvent(event) {
        event.stopPropagation();

        const val = event.target.value;
        this._value = val;

        const options = { allowGlobalConstants : false };
        const errors = validateTextWithMergeFields(val, options);
        // TODO: The screenEditor expects just an error message while the
        // rest of the editors expect an array. We'll need to standardize
        // this at some point.
        const error = errors.length > 0 ? errors[0].message : null;
        this.fireEvent(val, error);
    }

    fireEvent(value, error) {
        const event = new CustomEvent('change', {detail: {value: value && value.trim(), error}, cancelable: true, composed: true, bubbles: true});
        this.dispatchEvent(event);
    }
}