import { LightningElement, api, track } from 'lwc';
import { booleanAttributeValue } from 'builder_platform_interaction/screenEditorUtils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LABELS } from './resourcedRichTextEditorLabels';

// all formats except 'image' and 'video'
const RTE_FORMATS = ['table', 'background', 'bold', 'color', 'font', 'code', 'italic', 'link', 'size', 'strike', 'script', 'underline', 'blockquote', 'header', 'indent', 'list', 'align', 'direction', 'code-block', 'clean'];

/**
 * Rich text editor with a combobox to insert a resource. This component supports all quill formats except 'image' and 'video'.
 */
export default class ResourcedRichTextEditor extends LightningElement {
    @api label;
    @api helpText;
    @api required =  false;

    @track state = {
        value : '',
        error : null
    };
    labels = LABELS;
    hydrated = false;
    firstChangeEvent = false;

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

    handleChangeEvent(event) {
        event.stopPropagation();
        const value = event.detail.value;
        if (!this.firstChangeEvent) {
            // when inputRichText is activated we get a change event
            // TODO : convert to html that quill can understand (value = ...)
            this.firstChangeEvent = true;
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
}