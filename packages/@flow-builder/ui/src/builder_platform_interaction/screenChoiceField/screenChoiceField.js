import { LightningElement, api } from 'lwc';
import { getPlaceHolderLabel, getFieldChoiceData, isRadioField, isMultiSelectCheckboxField, isPicklistField, isMultiSelectPicklistField } from "builder_platform_interaction/screenEditorUtils";
import { getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
/**
 * Wrapper used to represent visual preview of choiced based screen fields, including
 * radio, drop-down, multi-select picklist, and multi-select checkboxes.
 */
export default class ScreenChoiceField extends LightningElement {
    @api field;
    @api label;
    @api value;

    get choices() {
        return getFieldChoiceData(this.field);
    }

    get defaultChoice() {
        // The component used to render preview for this type of field expects a list.
        if (this.isMultiSelectCheckboxField) {
            return [getValueFromHydratedItem(this.field.defaultSelectedChoiceReference)];
        }
        return getValueFromHydratedItem(this.field.defaultSelectedChoiceReference);
    }

    get displayLabel() {
        // Empty label is not allowed by the lightning component used to render this field type.
        // Use a placeholder label if none was provided.
        return this.label && this.label.value ? this.label.value : getPlaceHolderLabel(this.field.fieldType);
    }

    get isRadioField() {
        return isRadioField(this.field);
    }

    get isMultiSelectCheckboxField() {
        return isMultiSelectCheckboxField(this.field);
    }

    get isPickListField() {
        return isPicklistField(this.field);
    }

    get isMultiSelectPickListField() {
        return isMultiSelectPicklistField(this.field);
    }

    get isPickListType() {
        return this.isPickListField || this.isMultiSelectPickListField;
    }

    get helpText() {
        return this.field.helpText ? this.field.helpText.value : null;
    }
}