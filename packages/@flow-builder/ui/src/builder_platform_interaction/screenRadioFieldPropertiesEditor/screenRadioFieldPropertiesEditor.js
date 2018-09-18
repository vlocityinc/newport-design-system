import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { INPUT_FIELD_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { addGuidAndCurrentValueToEvent, addHydratedCurrentValueToEvent } from "builder_platform_interaction/screenEditorUtils";


const ALL_SECTION_NAMES = ['validationOptions', 'helpText'];
const FLOW_INPUT_FIELD_SUB_TYPES = Object.values(INPUT_FIELD_DATA_TYPE);

/*
 * Screen element property editor for the radio field.
 */
export default class ScreenRadioFieldPropertiesEditor extends LightningElement {
    @api field;

    labels = LABELS;
    inputFieldMap = INPUT_FIELD_DATA_TYPE;

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

    handleDataTypeChanged(event) {
        event.stopPropagation();
        const newFieldDataType = this.getFlowDataTypeFromInputType(event.detail.value.dataType);
        this.dispatchEvent(new PropertyChangedEvent("dataType", newFieldDataType, event.detail.error, this.field.guid, this.field.dataType));
    }

    handleDefaultValuePropertyChanged = (/* event */) => {
        // TODO whatever handling will be required for choices.
    }

    // TODO change to make choices show up.
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

    get isFieldDisabled() {
        // TODO reverse this once newField is correctly added to new fields.
        // Left like this for testing during development
        return this.field.isNewField;
    }

    get dataTypePickerValue() {
        return this.field.dataType ? this.getInputTypeFromFieldDataType : undefined;
    }

    get dataTypeList() {
        return FLOW_INPUT_FIELD_SUB_TYPES;
    }

    // Convert the value selected from the data type drop down menu to the corresponding flow data type.
    get getInputTypeFromFieldDataType() {
        for (const key in this.inputFieldMap) {
            if (this.field.dataType === key) {
                return { dataType : this.inputFieldMap[key].value };
            }
        }
        throw new Error("Screen field data type is set, but unable to find corresponding flow data type: " + this.field.dataType);
    }

    // Convert flow data type to the value from the data type drop down list.
    getFlowDataTypeFromInputType(newValue) {
        for (const key in this.inputFieldMap) {
            if (this.inputFieldMap[key].value === newValue) {
                return key;
            }
        }
        throw new Error("Unable to find Flow data type for provided screen field input type: " + newValue);
    }
}