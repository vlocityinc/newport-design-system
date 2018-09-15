import { LightningElement, api } from 'lwc';
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { addGuidAndCurrentValueToEvent, addHydratedCurrentValueToEvent } from "builder_platform_interaction/screenEditorUtils";

const ALL_SECTION_NAMES = ['validationOptions', 'helpText'];

/*
 * Screen element property editor for input fields.
 */
export default class ScreenInputFieldPropertiesEditor extends LightningElement {
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

    get defaultValueResourcePickerConfig() {
        return {
            allowLiterals: true,
            collection: false,
            objectType: this.field.dataType,
            elementType: ELEMENT_TYPE.SCREEN
        };
    }

    get isCheckbox() {
        return this.field.dataType === 'Boolean';
    }

    get isScaleEnabled() {
        return this.field.dataType === 'Number' || this.field.dataType === 'Currency';
    }

    get helpTextValue() {
        return this.field.helpText && this.field.helpText.value ? this.field.helpText : null;
    }
}