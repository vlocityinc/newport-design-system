import { Element, api } from 'engine';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { INPUT_FIELD_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';
import BaseResourcePicker from 'builder_platform_interaction-base-resource-picker';
import { LIGHTNING_INPUT_VARIANTS, getFlowDataTypeByName } from 'builder_platform_interaction-screen-editor-utils';

/*
 * Screen element property editor for input fields.
 */
export default class ScreenInputFieldPropertiesEditor extends Element {
    @api field;

    labels = LABELS;

    handlePropertyChanged = (event) => {
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, this.field.guid, this.field[property]));
        event.stopPropagation();
    }

    /* Handle change of Label combobox */
    handleInputLabelChanged(event) {
        // Set property name so the next handler knows which screen field property to update with new value.
        const property = 'fieldText';
        this.dispatchEvent(new PropertyChangedEvent(property, event.detail.displayText, event.detail.error, this.field.guid, this.field[property]));
        event.stopPropagation();
    }

    /* Handle change of Default Value resource picker */
    handleDefaultValueChanged(event) {
        // Set property name so the next handler knows which screen field property to update with new value.
        const property = 'defaultValue';
        this.dispatchEvent(new PropertyChangedEvent(property, event.detail.displayText, event.detail.error, this.field.guid, this.field[property]));
        event.stopPropagation();
    }

    /* Figure out if the value really changed, and if it did refire the event including the old value */
    handleErrorMessageChanged = (event) => {
        const validationProp = 'validationRule';
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        const currentValue = property && this.field[validationProp] && this.field[validationProp].errorMessage && this.field[validationProp].errorMessage.value;
        if (currentValue !== newValue) {
            this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, this.field.guid, currentValue));
        }
        event.stopPropagation();
    }

    /**
     * Handles reordering a list of the screen fields
     * @param {efvent} event - reorderListEvent
     */
    handleDataTypeChanged(event) {
        if (event.detail.value && event.detail.value.dataType) {
            const newDataType = event.detail.value.dataType;
            const error = event.detail.error;
            this.dispatchEvent(new PropertyChangedEvent('dataType', newDataType, error, this.field.guid, this.field.dataType));
        }
        event.stopPropagation();
    }

    get elementParam() {
        return {
            dataType: getFlowDataTypeByName(this.field.dataType),
            collection: false
        };
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

    get fieldLabel() {
        return this.field.fieldText ? this.field.fieldText.value : null;
    }

    get dataTypeList() {
        return Object.values(INPUT_FIELD_DATA_TYPE);
    }

    get dataTypePickerValue() {
        return  {
            dataType : getValueFromHydratedItem(this.field.type.name),
            scale : null,
            isCollection : false
        };
    }

    get isCheckbox() {
        return this.field.dataType === 'Boolean';
    }

    get isScaleEnabled() {
        return this.field.dataType === 'Number' || this.field.dataType === 'Currency';
    }

    get validationRuleError() {
        return this.field.validationRule ? this.field.validationRule.errorMessage : null;
    }

    get validationRuleFormula() {
        return this.field.validationRule ? this.field.validationRule.formulaExpression : null;
    }

    /**
     * Indicates if the field's subtype property should be editable or not.
     */
    get isSubTypeDisabled() {
        return this.field.isNewMode ? false : true;
    }
}