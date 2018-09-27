import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent, createChoiceAddedToScreenField } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { INPUT_FIELD_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import {  getFieldChoiceData } from "builder_platform_interaction/screenEditorUtils";
import { addCurrentValueToEvent } from "builder_platform_interaction/screenEditorCommonUtils";

const ALL_SECTION_NAMES = ['choice', 'helpText'];
const FLOW_INPUT_FIELD_SUB_TYPES = Object.values(INPUT_FIELD_DATA_TYPE);
const CHOICE_FRP_CONFIG = {
    allowLiterals: false,
    collection: false,
    elementType: ELEMENT_TYPE.SCREEN // TODO this needs to be changed to CHOICE once Choice selector is added
};

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
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, this.field[event.detail.propertyName]));
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

    handleChoiceChanged = (/* event */) => {
        // TODO
    }

    handleChoiceDeleted = (/* event */) => {
        // TODO
    }

    handleChoiceAdded = (event) => {
        event.stopPropagation();
        this.dispatchEvent(createChoiceAddedToScreenField(this.field, event.detail.index));
    }

    get fieldChoices() {
        return getFieldChoiceData(this.field);
    }

    get choiceResourcePickerConfig() {
        return CHOICE_FRP_CONFIG;
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

    get showDelete() {
        return this.field.choiceReferences.length > 1;
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