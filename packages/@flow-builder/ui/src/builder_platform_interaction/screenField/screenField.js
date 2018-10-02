import { LightningElement, api } from 'lwc';
import { isExtensionField, getPlaceHolderLabel } from "builder_platform_interaction/screenEditorUtils";
import { hydrateWithErrors, getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { isReference, addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api screenfield;

    get calculatedClass() {
        const errors = getErrorsFromHydratedElement(this.screenfield);
        const hasError = errors && errors.length > 0;
        return 'container slds-m-around_xxx-small slds-p-horizontal_small slds-p-vertical_x-small' + (hasError ? ' has-error' : '');
    }

    get isExtension() {
        return isExtensionField(this.screenfield.type);
    }

    get isInputFieldType() {
        return this.screenfield.type.fieldType === 'InputField' || this.screenfield.type.fieldType === 'PasswordField';
    }

    get isRadioField() {
        return this.screenfield.type.fieldType === 'RadioButtons';
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

    get defaultValue() {
        // Hack due to guid->devName swapping inconsistencies
        // TODO: Need to update this when changing uid swapping
        const defaultValue = this.screenfield.previewDefaultValue && this.screenfield.previewDefaultValue.value ? this.screenfield.previewDefaultValue.value : this.screenfield.previewDefaultValue;
        if (this.screenfield.defaultValueDataType === FEROV_DATA_TYPE.REFERENCE && !isReference(defaultValue)) {
            return addCurlyBraces(defaultValue);
        }
        return defaultValue;
    }
}