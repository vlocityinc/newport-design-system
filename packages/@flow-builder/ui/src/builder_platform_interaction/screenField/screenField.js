import { LightningElement, api } from 'lwc';
import { hydrateWithErrors, getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { GLOBAL_CONSTANT_OBJECTS } from "builder_platform_interaction/systemLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import {
    isExtensionField,
    isNumberField,
    isDateField,
    isDateTimeField,
    isCurrencyField,
    isChoiceField,
    getPlaceHolderLabel
} from "builder_platform_interaction/screenEditorUtils";

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
        return isChoiceField(this.screenfield);
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
        const defaultValue = this.screenfield.defaultValue && this.screenfield.defaultValue.hasOwnProperty('value') ?
                             this.screenfield.defaultValue.value : this.screenfield.defaultValue;
        if (this.screenfield.defaultValueDataType === FEROV_DATA_TYPE.REFERENCE) {
            if (isCurrencyField(this.screenfield) || isNumberField(this.screenfield) || isDateField(this.screenfield) || isDateTimeField(this.screenfield)) {
                return '';
            } else if (!(defaultValue.startsWith('{!') && defaultValue.endsWith('}'))) {
                // Resolve the devName from the guid and add curly braces
                return addCurlyBraces(getElementByGuid(defaultValue).name);
            }
        } else if (defaultValue in GLOBAL_CONSTANT_OBJECTS) {
            // If the default value is global constant, pass the actual default value, not the preview version.
            return defaultValue;
        }

        return defaultValue;
    }
}