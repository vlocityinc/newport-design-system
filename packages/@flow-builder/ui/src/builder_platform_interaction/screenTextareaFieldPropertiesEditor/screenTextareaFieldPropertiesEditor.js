import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { LIGHTNING_INPUT_VARIANTS, addGuidAndCurrentValueToEvent, addHydratedCurrentValueToEvent } from "builder_platform_interaction/screenEditorUtils";

const ALL_SECTION_NAMES = ['validationOptions', 'helpText'];

/*
 * Screen element property editor for the text area field.
 */
export default class ScreenTextareaFieldPropertiesEditor extends LightningElement {
    @api field;

    labels = LABELS;

    get allSectionNames() {
        return ALL_SECTION_NAMES;
    }

    handlePropertyChanged = (event) => {
        this.dispatchEvent(addGuidAndCurrentValueToEvent(event, this.field));
        event.stopPropagation();
    }

    handleHelpTextChanged = (event) => {
        this.dispatchEvent(addHydratedCurrentValueToEvent(event, this.field, this.helpTextValue));
        event.stopPropagation();
    }

    /* Handle change of Default Value resource picker */
    handleDefaultValueChanged(event) {
        const property = 'defaultValue';
        this.dispatchEvent(new PropertyChangedEvent(property, event.detail.value, event.detail.error, this.field.guid, this.field[property]));
        event.stopPropagation();
    }

    get resourceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.fieldDefaultValue, // Label
            LABELS.resourcePickerPlaceholder, // Placeholder
            null, // errorMessage
            true, // literalsAllowed
            false, // required
            false, // disabled
            this.field.dataType, // type
            LIGHTNING_INPUT_VARIANTS.STANDARD); // variant
    }

    get helpTextValue() {
        return this.field.helpText && this.field.helpText.value ? this.field.helpText : null;
    }
}