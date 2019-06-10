import { LightningElement, api } from 'lwc';
import {
    hydrateWithErrors,
    getErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import {
    isObject,
    isReference
} from 'builder_platform_interaction/commonUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { normalizeFEROV } from 'builder_platform_interaction/expressionUtils';
import {
    isExtensionField,
    isNumberField,
    isDateField,
    isDateTimeField,
    isCurrencyField,
    isChoiceField,
    getPlaceHolderLabel
} from 'builder_platform_interaction/screenEditorUtils';

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api screenfield;
    labels = LABELS;

    get hasErrors() {
        const errors =
            this.screenfield && getErrorsFromHydratedElement(this.screenfield);
        return errors && errors.length > 0;
    }

    get isExtension() {
        return isExtensionField(this.screenfield.type);
    }

    get isInputFieldType() {
        return (
            this.screenfield.type.fieldType === 'InputField' ||
            this.screenfield.type.fieldType === 'PasswordField'
        );
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
        return this.screenfield && this.screenfield.name
            ? this.screenfield.name.value
            : '';
    }

    get displayName() {
        return this.screenfield.type.label !== null
            ? this.screenfield.type.label
            : this.screenfield.type.name;
    }

    get fieldText() {
        // The LWC components used to render these screen fields require a value for this property. however Flow doesn't require this.
        // If the user didn't provide a label, use a placeholder label for preview.
        if (
            this.screenfield &&
            this.screenfield.fieldText &&
            this.screenfield.fieldText.value !== null
        ) {
            return this.screenfield.fieldText;
        }
        return hydrateWithErrors(
            getPlaceHolderLabel(this.screenfield.type.name)
        );
    }

    get defaultValue() {
        let defaultValue =
            this.screenfield.defaultValue &&
            this.screenfield.defaultValue.hasOwnProperty('value')
                ? this.screenfield.defaultValue.value
                : this.screenfield.defaultValue;

        const shouldNotPreviewFERs =
            isCurrencyField(this.screenfield) ||
            isNumberField(this.screenfield) ||
            isDateField(this.screenfield) ||
            isDateTimeField(this.screenfield);

        if (
            this.screenfield.defaultValueDataType ===
                FEROV_DATA_TYPE.REFERENCE &&
            shouldNotPreviewFERs
        ) {
            defaultValue = '';
        } else if (!isReference(defaultValue)) {
            const normalizedValue = normalizeFEROV(defaultValue)
                .itemOrDisplayText;
            defaultValue = isObject(normalizedValue)
                ? normalizedValue.displayText
                : normalizedValue;
        }

        return defaultValue;
    }
}
