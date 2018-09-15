import { LightningElement, api } from 'lwc';
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { addGuidAndCurrentValueToEvent, addHydratedCurrentValueToEvent } from "builder_platform_interaction/screenEditorUtils";

const ALL_SECTION_NAMES = ['validationOptions', 'helpText'];

/*
 * Screen element property editor for the password field.
 */
export default class ScreenPasswordFieldPropertiesEditor extends LightningElement {
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

    /*
     * Lets the next handler know the default value should be stored in a string.
     */
    handleDefaultValuePropertyChanged = (event) => {
        event.detail.defaultValueDataType = 'String';
    }

    get defaultValueResourcePickerConfig() {
        return {
            allowLiterals: true,
            collection: false,
            objectType: 'String',
            elementType: ELEMENT_TYPE.SCREEN
        };
    }

    get helpTextValue() {
        return this.field.helpText && this.field.helpText.value ? this.field.helpText : null;
    }
}