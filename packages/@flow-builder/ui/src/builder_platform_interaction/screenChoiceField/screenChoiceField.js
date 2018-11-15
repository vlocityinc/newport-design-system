import { LightningElement, api } from 'lwc';
import { getPlaceHolderLabel, isRadioField, isMultiSelectCheckboxField, isPicklistField, isMultiSelectPicklistField } from "builder_platform_interaction/screenEditorUtils";
import { getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { getElementForPropertyEditor } from "builder_platform_interaction/propertyEditorFactory";

/**
 * Wrapper used to represent visual preview of choiced based screen fields, including
 * radio, drop-down, multi-select picklist, and multi-select checkboxes.
 */
export default class ScreenChoiceField extends LightningElement {
    @api field;
    @api label;
    @api value;

    get choices() {
        if (this.field.choiceReferences && this.field.choiceReferences.length > 0) {
            return this.field.choiceReferences.map((choice) => {
                if (choice && choice.choiceReference && choice.choiceReference.value !== "") {
                    const choiceElement = getElementByGuid(choice.choiceReference.value);
                    if (!choiceElement) {
                        throw new Error('Unable to find choice: ' + choice);
                    }

                    const previewChoice = getElementForPropertyEditor(choiceElement);

                    // Figure out which property should be used as the label, based on choice type.
                    let label;
                    if (previewChoice.elementType === ELEMENT_TYPE.PICKLIST_CHOICE_SET) {
                        label = previewChoice.picklistField.value;
                    } else if (previewChoice.elementType === ELEMENT_TYPE.RECORD_CHOICE_SET) {
                        label = '[' + LABELS.dynamicRecordChoiceLabel + '] ' + choiceElement.displayField;
                    } else if (previewChoice.elementType === ELEMENT_TYPE.CHOICE) {
                        label = previewChoice.choiceText.value;
                    } else {
                        throw new Error("Unknown choice type: " + choiceElement.elementType);
                    }

                    return {
                        label,
                        value: previewChoice.guid
                    };
                }
                return {
                    label: '',
                    value: ''
                };
            });
        }
        return [];
    }

    get defaultChoice() {
        // The component used to render preview for this type of field expects a list.
        const defaultValue = getValueFromHydratedItem(this.field.defaultSelectedChoiceReference);
        if (this.isMultiSelectCheckboxField) {
            if (defaultValue !== '') {
                return [defaultValue];
            }
            // If no default is selected, return an empty list, not the actual default which
            // is stored as '' because that can match a choice that is in the middle of being
            // configured and make the preview render incorrectly.
            return [];
        }
        return defaultValue !== '' ? defaultValue : null;
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