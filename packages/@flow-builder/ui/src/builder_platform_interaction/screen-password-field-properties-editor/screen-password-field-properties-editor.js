import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

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
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, this.field.guid, this.field[property]));
        event.stopPropagation();
    }

    /* Figure out if the value really changed, and if it did refire the event including the old value */
    handleErrorMessageChanged = (event) => {
        const error = event.detail.error;
        const currentValue = this.field.errorMessage ? this.field.errorMessage : null;
        if (currentValue !== event.detail.value) {
            // Hydrate the current value before sending in to ensure the new value is hydrated too.
            this.dispatchEvent(new PropertyChangedEvent(event.detail.propertyName, event.detail.value, error, this.field.guid, {value: currentValue, error: null}));
        }
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

    get validationRuleError() {
        return this.field.errorMessage ? this.field.errorMessage.value : null;
    }

    get validationRuleFormula() {
        return this.field.formulaExpression ? this.field.formulaExpression.value : null;
    }

    get helpTextValue() {
        return this.field.helpText && this.field.helpText.value ? this.field.helpText : null;
    }
}