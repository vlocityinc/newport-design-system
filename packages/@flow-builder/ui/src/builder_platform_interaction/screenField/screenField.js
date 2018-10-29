import { LightningElement, api } from 'lwc';
import { isExtensionField, isNumberField, isCurrencyField, isRadioField, isMultiSelectCheckboxField, isMultiSelectPicklistField,
         isPicklistField, getPlaceHolderLabel } from "builder_platform_interaction/screenEditorUtils";
import { hydrateWithErrors, getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { isReference, addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api screenfield;
    labels = LABELS;

    get hasErrors() {
        const errors = this.screenfield && getErrorsFromHydratedElement(this.screenfield);
        return errors && errors.length > 0;
    }

    get isExtension() {
        return isExtensionField(this.screenfield.type);
    }

    get isInputFieldType() {
        return this.screenfield.type.fieldType === 'InputField' || this.screenfield.type.fieldType === 'PasswordField';
    }

    get isChoiceField() {
        return isRadioField(this.screenfield) || isMultiSelectCheckboxField(this.screenfield) ||
               isMultiSelectPicklistField(this.screenfield) || isPicklistField(this.screenfield);
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

    get displayName() {
        return this.screenfield.type.label !== null ? this.screenfield.type.label : this.screenfield.type.name;
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
        // Hack due to guid->devName swapping inconsistencies (Jesun David)
        // TODO: Need to update this when changing uid swapping
        const defaultValue = this.screenfield.previewDefaultValue && this.screenfield.previewDefaultValue.hasOwnProperty('value') ? this.screenfield.previewDefaultValue.value : this.screenfield.previewDefaultValue;
        if (this.screenfield.defaultValueDataType === FEROV_DATA_TYPE.REFERENCE && (isCurrencyField(this.screenfield) ||
            isNumberField(this.screenfield))) {
            // If the field has a reference for it's default value and the field type makes it such that we can't display
            // the reference name (due to limitations of the components we're using to render the preview),
            // don't display anything.
            return '';
        }
        if (this.screenfield.defaultValueDataType === FEROV_DATA_TYPE.REFERENCE && !isReference(defaultValue)) {
            return addCurlyBraces(defaultValue);
        }
        return defaultValue;
    }
}