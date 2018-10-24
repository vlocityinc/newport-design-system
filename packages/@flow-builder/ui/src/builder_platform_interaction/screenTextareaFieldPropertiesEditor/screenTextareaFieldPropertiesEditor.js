import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { LIGHTNING_INPUT_VARIANTS } from "builder_platform_interaction/screenEditorUtils";
import { addCurrentValueToEvent } from "builder_platform_interaction/screenEditorCommonUtils";

/*
 * Screen element property editor for the text area field.
 */
export default class ScreenTextareaFieldPropertiesEditor extends LightningElement {
    @api field;

    labels = LABELS;

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    }

    /* Handle change of Default Value resource picker */
    handleDefaultValueChanged(event) {
        this.dispatchEvent(new PropertyChangedEvent('defaultValue', event.detail.value, event.detail.error, this.field.guid, this.field.defaultValue));
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
}