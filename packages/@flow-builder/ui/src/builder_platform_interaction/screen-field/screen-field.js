import { LightningElement, api } from "lwc";
import { isExtensionField, getPlaceHolderLabel } from 'builder_platform_interaction-screen-editor-utils';
import { hydrateWithErrors } from 'builder_platform_interaction-data-mutation-lib';

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api screenfield;

    get isExtension() {
        return isExtensionField(this.screenfield.type);
    }

    get isInputFieldType() {
        return this.screenfield.type.fieldType === 'InputField' || this.screenfield.type.fieldType === 'PasswordField';
    }

    get isTextAreaType() {
        return this.screenfield.type.name === 'LargeTextArea';
    }

    get isDisplayTextType() {
        return this.screenfield.type.fieldType === 'DisplayText';
    }

    get isRequired() {
        // There is no concept of required for a checkbox.
        if (this.screenfield.type.name === 'Checkbox') {
            return false;
        }
        return this.screenfield.isRequired;
    }

    get name() {
        return this.screenfield && this.screenfield.name ? this.screenfield.name.value : '';
    }

    get fieldText() {
        // The LWC components used to render these screen fields require a value for this property. however Flow doesn't require this.
        // If the user didn't provide a label, use a placeholder label for preview.
        if (this.screenfield && this.screenfield.fieldText && this.screenfield.fieldText.value !== null) {
            return this.screenfield.fieldText;
        }
        return hydrateWithErrors(getPlaceHolderLabel(this.screenfield.type.name));
    }
}
