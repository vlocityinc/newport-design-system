import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

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
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, this.field.guid, this.field[property]));
        event.stopPropagation();
    }

    handleHelpTextChanged = (event) => {
        const currentValue = this.helpTextValue;
        if (currentValue !== event.detail.value) {
            // Hydrate the current value before sending in to ensure the new value is hydrated also.
            this.dispatchEvent(new PropertyChangedEvent(event.detail.propertyName, event.detail.value, event.detail.error, this.field.guid, {value: currentValue, error: null}));
        }
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