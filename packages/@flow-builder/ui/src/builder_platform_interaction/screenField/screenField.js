import { LightningElement, api } from 'lwc';
import { hydrateWithErrors, getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { GLOBAL_CONSTANT_OBJECTS, getSystemVariables } from "builder_platform_interaction/systemLib";
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
            // For certain field types, if the defaultValue is a reference, we don't display anything in the canvas preview.
            if (isCurrencyField(this.screenfield) || isNumberField(this.screenfield) || isDateField(this.screenfield) || isDateTimeField(this.screenfield)) {
                return '';
            } else if (defaultValue in getSystemVariables()) {
                return addCurlyBraces(defaultValue);
            } else if (!(defaultValue.startsWith('{!') && defaultValue.endsWith('}'))) {
                // This should be a GUID for an element created by the user.
                // Resolve the devName from the guid and add curly braces for preview.
                const defaultValueElement = getElementByGuid(defaultValue);
                if (defaultValueElement) {
                    return addCurlyBraces(defaultValueElement.name);
                }
                // If we couldn't find the element by the GUID, display nothing in the preview
                // and log an error. Theoretically, this should never happen.
                throw new Error("Unable to find element: " + defaultValue);
            }
        } else if (defaultValue in GLOBAL_CONSTANT_OBJECTS) {
            // Global constants are "sort of" references. We store their defaultValueDataType as the actual
            // data type corresponding to the the global constant though, not as a reference.
            // As of 218, the only global constant types we have are either boolean or string.
            return addCurlyBraces(defaultValue);
        }

        // If it's a literal, just display it as is.
        return defaultValue;
    }
}