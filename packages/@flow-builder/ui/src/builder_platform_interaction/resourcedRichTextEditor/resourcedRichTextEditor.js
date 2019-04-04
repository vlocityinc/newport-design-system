import { LightningElement, api, track } from 'lwc';
import { booleanAttributeValue } from 'builder_platform_interaction/screenEditorUtils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LABELS } from './resourcedRichTextEditorLabels';
import { convertHTMLToQuillHTML } from './richTextConverter';
import { LIGHTNING_INPUT_VARIANTS } from "builder_platform_interaction/screenEditorUtils";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

// all formats except 'video'
const RTE_FORMATS = ['table', 'background', 'bold', 'color', 'font', 'code', 'italic', 'link', 'size', 'strike', 'script', 'underline', 'blockquote', 'header', 'indent', 'list', 'align', 'direction', 'code-block', 'clean', 'image'];

const SELECTORS = {
    INPUT_RICH_TEXT: 'lightning-input-rich-text',
    FEROV_RESOURCE_PICKER: 'builder_platform_interaction-ferov-resource-picker',
    INPUT_RICH_TEXT_UPLOAD_IMG_BUTTON:'.slds-button.slds-button_icon-border-filled.ql-image'
};

/**
 * Rich text editor with a combobox to insert a resource. This component supports all quill formats except 'video'.
 */
export default class ResourcedRichTextEditor extends LightningElement {
    @api label;
    @api helpText;
    @api required =  false;
    @api showGlobalVariables = false;

    // IMPORTANT: For new resource to work, the containing property editor must have newResourcesCallback included
    // in the call to invokePropertyEditor in editor.js
    @api hideNewResource = false;

    @track state = {
        value : '',
        error : null
    };
    labels = LABELS;
    hydrated = false;
    isHTMLSanitized = false;
    initialized = false;

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

    elementConfig = {
            elementType: ELEMENT_TYPE.SCREEN,
        };

    get isRequired() {
        return booleanAttributeValue(this, 'required');
    }

    get formats() {
        return RTE_FORMATS;
    }

    @api get value() {
        return this.hydrated ?  {value: this.state.value, error: this.state.error} : this.state.value;
    }

    set value(val) {
        this.hydrated = val && val.hasOwnProperty('value') && val.hasOwnProperty('error');

        if (this.hydrated) {
            this.state.value = val.value;
            this.state.error = val.error;
        } else {
            this.state.value = val;
        }
    }

    get inputRichTextValue() {
        // Replacing new line with <br /> tag as done at runtime (see _createOutput in factory.js)
        // if html is sanitized, this has already been done
        if (this.state.value != null && !this.isHTMLSanitized) {
            return this.replaceNewLinesWithBrTags(this.state.value);
        }
        return this.state.value;
    }

    get classList() {
        return 'container slds-grid slds-grid_vertical' + (this.state.error ? ' has-error' : '');
    }

    // Replace new line with <br /> tag as done at runtime (see _createOutput in factory.js)
    replaceNewLinesWithBrTags(value) {
        return value.replace(/\n/g, '<br />');
    }

    handleChangeEvent(event) {
        event.stopPropagation();
        let value = event.detail.value;
        if (!this.isHTMLSanitized) {
            // when inputRichText is activated we get a change event
            // except if html text is empty
            if (this.state.value != null && this.state.value !== '') {
                // we replace new line with <br /> tag as done at runtime
                value = this.replaceNewLinesWithBrTags(this.state.value);
                value = convertHTMLToQuillHTML(value);
            }
            this.isHTMLSanitized = true;
        }
        const errors = this.validateMergeFields(value);
        const error = errors.length > 0 ? errors[0].message : null;
        this.fireChangeEvent(value, error);
    }

    handleBlurEvent() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    validateMergeFields(textWithMergeFields) {
        const options = { allowGlobalConstants : false, allowCollectionVariables : true };
        const errors = validateTextWithMergeFields(textWithMergeFields, options);
        return errors;
    }

    fireChangeEvent(value, error) {
        const event = new CustomEvent('change', {detail: {value, error}, cancelable: true, composed: true, bubbles: true});
        this.dispatchEvent(event);
    }

    handleResourcePickerFocusout() {
        Promise.resolve().then(() => {
            const ferovResourcePicker = this.template.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
            ferovResourcePicker.value = null;
            ferovResourcePicker.errorMessage = null;
        });
    }

    handleResourcePickerSelection(event) {
        event.stopPropagation();
        const text = event.detail.item.displayText;
        if (text) {
            const inputRichText = this.template.querySelector(SELECTORS.INPUT_RICH_TEXT);
            inputRichText.insertTextAtCursor(text);
            inputRichText.focus();
        }
    }

    renderedCallback() {
        if (!this.initialized) {
             // Temp "BETA" tooltip addition for lighnting rich text input upload img button
             const inputRichText = this.template.querySelector(SELECTORS.INPUT_RICH_TEXT);
             if (inputRichText.shadowRoot) {
                const uploadImgBtn = inputRichText.shadowRoot.querySelector(SELECTORS.INPUT_RICH_TEXT_UPLOAD_IMG_BUTTON);
                if (uploadImgBtn) {
                    uploadImgBtn.title = LABELS.richTextInputUploadImgBtnBetaTitle;
                }
             }
             this.initialized = true;
        }
     }
}