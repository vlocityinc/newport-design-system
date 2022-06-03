import { isObject, isReference } from 'builder_platform_interaction/commonUtils';
import {
    getErrorsFromHydratedElement,
    hydrateWithErrors,
    isItemHydrated
} from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { normalizeFEROV } from 'builder_platform_interaction/expressionUtils';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    getPlaceHolderLabel,
    isChoiceField,
    isCurrencyField,
    isDateField,
    isDateTimeField,
    isExtensionField,
    isFieldCompoundAddress,
    isFieldCompoundName,
    isNumberField,
    ScreenFieldName
} from 'builder_platform_interaction/screenEditorUtils';
import { api, LightningElement } from 'lwc';

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api screenfield;
    @api selectedItemGuid;
    @api movedItemGuid; // guid of the component being reordered

    labels = LABELS;

    get calculatedClass() {
        let classString = '';
        if (!this.isExtension && !this.hasErrors) {
            classString = this.isSectionType
                ? 'slds-p-vertical_medium'
                : 'slds-p-vertical_x-small slds-p-horizontal_small';
        }
        return classString;
    }

    get hasErrors(): boolean {
        const errors = this.screenfield && getErrorsFromHydratedElement(this.screenfield);
        return this.screenfield.hasErrors === true || (errors?.length > 0 && !this.isSectionType);
    }

    get isExtension(): boolean {
        return isExtensionField(this.screenfield.type);
    }

    get isInputFieldType() {
        return (
            this.screenfield.type.fieldType === FlowScreenFieldType.InputField ||
            this.screenfield.type.fieldType === FlowScreenFieldType.PasswordField ||
            (this.isObjectProvided() &&
                !this.isTextAreaType &&
                !this.isDropdownType() && // For 236, automatic field of picklist type has no preview
                !this.isAutomaticFieldCompound) // For 238, automatic field of coumpound type has no preview
        );
    }

    get isChoiceField(): boolean {
        return isChoiceField(this.screenfield);
    }

    get isTextAreaType() {
        return this.screenfield.type.name === ScreenFieldName.LargeTextArea;
    }

    get isDisplayTextType() {
        return this.screenfield.type.fieldType === FlowScreenFieldType.DisplayText;
    }

    get isSectionType() {
        return this.screenfield.type.name === ScreenFieldName.Section;
    }

    get isRequired(): boolean {
        // There is no concept of required for a checkbox.
        return this.screenfield.type.name === ScreenFieldName.Checkbox ? false : this.screenfield.isRequired;
    }

    get name(): string {
        return this.screenfield && this.screenfield.name ? this.screenfield.name.value : '';
    }

    get displayName(): string {
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
        let defaultValue = isItemHydrated(this.screenfield.defaultValue)
            ? this.screenfield.defaultValue.value
            : this.screenfield.defaultValue;

        const shouldNotPreviewFERs =
            isCurrencyField(this.screenfield) ||
            isNumberField(this.screenfield) ||
            isDateField(this.screenfield) ||
            isDateTimeField(this.screenfield);

        if (this.screenfield.defaultValueDataType === FEROV_DATA_TYPE.REFERENCE && shouldNotPreviewFERs) {
            defaultValue = '';
        } else if (!isReference(defaultValue)) {
            const normalizedValue = normalizeFEROV(defaultValue).itemOrDisplayText;
            defaultValue = isObject(normalizedValue)
                ? (normalizedValue as UI.ComboboxItem).displayText
                : normalizedValue;
        }

        return defaultValue;
    }

    @api focusChildElement(index) {
        const section = this.template.querySelector('builder_platform_interaction-screen-section-field') as any;
        section.focusChildElement(index);
    }

    /**
     * Whether or not the current field type is an ObjectProvided one, aka "automatic field"
     * of picklist type
     *
     * @returns true if the current field type is an ObjectProvided one, aka "automatic field" of
     * picklist type, otherwise false
     */
    get isAutomaticFieldPicklist() {
        return this.isObjectProvided() && this.isDropdownType();
    }

    /**
     * Whether or not the current field type is an ObjectProvided one, aka "automatic field"
     * of compound name type
     *
     * @returns true if the current field type is an ObjectProvided one, aka "automatic field" of
     * compound name type, otherwise false
     */
    get isAutomaticFieldCompoundName(): boolean {
        return this.isObjectProvided() && isFieldCompoundName(this.screenfield);
    }

    /**
     * Determines whether the current field type is an ObjectProvided one, aka "automatic field"
     * of compound address type
     *
     * @returns true if the current field type is an automatic field of compound address type
     */
    get isAutomaticFieldCompoundAddress(): boolean {
        return this.isObjectProvided() && isFieldCompoundAddress(this.screenfield);
    }

    /**
     * Whether or not the current field type is an ObjectProvided one, aka "automatic field"
     * and does not support preview
     *
     * @returns true if the current field type is an ObjectProvided one, aka "automatic field" of
     * compound name type and has no preview available, otherwise false
     */
    get isAutomaticFieldWithNoPreview(): boolean {
        return this.isAutomaticFieldCompound || this.isAutomaticFieldPicklist;
    }

    /**
     * Determines whether the current field type is an ObjectProvided one, aka "automatic field"
     * of compound type (Name or Address)
     *
     * @returns true if the current field type is an automatic compound field
     */
    get isAutomaticFieldCompound(): boolean {
        return this.isAutomaticFieldCompoundName || this.isAutomaticFieldCompoundAddress;
    }

    /**
     * Whether or not the current field is an ObjectProvided one, aka "automatic field"
     *
     * @returns true if the current field is an ObjectProvided one, otherwise false
     */
    private isObjectProvided() {
        return this.screenfield.type.fieldType === FlowScreenFieldType.ObjectProvided;
    }

    /**
     * Whether or not the current field type is of dropdown type
     *
     * @returns true if the current field type is dropdown type, otherwise false
     */
    private isDropdownType() {
        return this.screenfield?.type?.name === FlowScreenFieldType.DropdownBox;
    }
}
