// @ts-nocheck
import { LightningElement, api } from 'lwc';
import {
    PropertyChangedEvent,
    createChoiceAddedEvent,
    createChoiceChangedEvent,
    createChoiceDeletedEvent
} from 'builder_platform_interaction/events';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { INPUT_FIELD_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    getFieldChoiceData,
    isPicklistField,
    isMultiSelectCheckboxField,
    isMultiSelectPicklistField,
    isRadioField
} from 'builder_platform_interaction/screenEditorUtils';
import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { hydrateIfNecessary } from 'builder_platform_interaction/dataMutationLib';
import {
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME,
    CHOICE_SCREEN_FIELDS
} from 'builder_platform_interaction/screenEditorUtils';

const CHOICES_SECTION_NAME = 'choicesSection';
const FLOW_INPUT_FIELD_SUB_TYPES = Object.values(INPUT_FIELD_DATA_TYPE);
const CHOICE_DISPLAY_OPTIONS = {
    SINGLE_SELECT: 'SingleSelect',
    MULTI_SELECT: 'MultiSelect'
};

/*
 * Screen element property editor for the radio field.
 */
export default class ScreenChoiceFieldPropertiesEditor extends LightningElement {
    labels = LABELS;
    inputFieldMap = INPUT_FIELD_DATA_TYPE;
    defaultValueNone = {
        label: this.labels.noDefaultValueSelected,
        value: ''
    };

    private _field;
    private singleOrMultiSelectOption;
    expandedSectionNames = [CHOICES_SECTION_NAME];

    set field(value) {
        this._field = value;
        if (hasScreenFieldVisibilityCondition(this._field) && this.expandedSectionNames.length === 1) {
            this.expandedSectionNames = [CHOICES_SECTION_NAME, SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME];
        }
    }

    @api
    get field() {
        return this._field;
    }

    @api
    editorParams;

    get isScaleEnabled() {
        const { dataType = null } = this.field;
        return dataType === 'Number' || dataType === 'Currency';
    }

    handlePropertyChanged = (event) => {
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, this.field[event.detail.propertyName]));
        event.stopPropagation();
    };

    handleDataTypeChanged(event) {
        event.stopPropagation();
        const newFieldDataType = this.getFlowDataTypeFromInputType(event.detail.value.dataType);
        this.dispatchEvent(
            new PropertyChangedEvent(
                'dataType',
                newFieldDataType,
                event.detail.error,
                this.field.guid,
                this.field.dataType
            )
        );
    }

    handleDefaultValuePropertyChanged = (event) => {
        event.stopPropagation();

        // If user is trying to set default value back to nothing, set the value to null,
        // otherwise get the GUID corresponding to the new default choice.
        let newValue = null;
        if (event && event.detail && event.detail.guid) {
            // We get the display value from the event, which might be something
            // like {!choice1}, but we want the devName. Get the devName by using the GUID.
            newValue = event.detail.guid;
        }

        this.dispatchEvent(
            new PropertyChangedEvent(
                event.detail.propertyName,
                hydrateIfNecessary(newValue),
                event.detail.error,
                event.detail.guid ? event.detail.guid : null,
                hydrateIfNecessary(this.field.defaultSelectedChoiceReference)
            )
        );
    };

    handleChoiceChanged = (event) => {
        event.stopPropagation();

        // We get the display value from the event, which might be something
        // like {!choice1}, but we want the devName. Get the devName by using the GUID.
        if (event && event.detail) {
            // If the choice value didn't actually change, don't do anything.
            if (
                this.field.choiceReferences[event.detail.listIndex] &&
                this.field.choiceReferences[event.detail.listIndex].choiceReference &&
                this.field.choiceReferences[event.detail.listIndex].choiceReference.value === event.detail.guid &&
                this.field.choiceReferences[event.detail.listIndex].choiceReference.error === event.detail.error
            ) {
                return;
            }

            this.dispatchEvent(
                createChoiceChangedEvent(
                    this.field,
                    {
                        value: event.detail.guid,
                        error: event.detail.error
                    },
                    event.detail.listIndex
                )
            );
        }
    };

    handleChoiceDeleted = (event) => {
        event.stopPropagation();
        this.dispatchEvent(createChoiceDeletedEvent(this.field, event.detail.index));
    };

    handleChoiceAdded = (event) => {
        event.stopPropagation();
        this.dispatchEvent(createChoiceAddedEvent(this.field, this.field.choiceReferences.length));
    };

    handleSingleOrMultiSelectChange = (event) => {
        event.stopPropagation();
        this.singleOrMultiSelectOption = event.detail.value;
    };

    handleChoiceDisplayTypeChanged = (event) => {
        event.stopPropagation();
        // Dispatch Event
    };

    get fieldChoices() {
        return getFieldChoiceData(this.field);
    }

    get choiceResourcePickerConfig() {
        return {
            allowLiterals: false,
            collection: false,
            hideGlobalConstants: true,
            hideSystemVariables: true,
            hideGlobalVariables: true,
            hideNewResource: false,
            elementConfig: {
                elementType: ELEMENT_TYPE.SCREEN,
                dataType: this.field.dataType,
                choices: true
            }
        };
    }

    get isDataTypeDisabled() {
        // For certain choice based fields, dataType will always be disabled because there is no option.
        return (
            !this.field.isNewField || isMultiSelectCheckboxField(this.field) || isMultiSelectPicklistField(this.field)
        );
    }

    get isDataTypeRequired() {
        // These field types don't offer a dataType option. We just display the only valid setting
        // available. For the the rest, dataType is a configurable and required setting.
        return !isMultiSelectCheckboxField(this.field) && !isMultiSelectPicklistField(this.field);
    }

    get showIsRequired() {
        // Picklist fields are currently always required at runtime, so we default isRequired to true and hide the checkbox
        return !isPicklistField(this.field);
    }

    get dataTypePickerValue() {
        return this.field.dataType ? this.getInputTypeFromFieldDataType : { dataType: null };
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
                return { dataType: this.inputFieldMap[key].value };
            }
        }
        throw new Error(
            'Screen field data type is set, but unable to find corresponding flow data type: ' + this.field.dataType
        );
    }

    get choiceDisabled() {
        // If the dataType isn't set yet, user should not be able to set any choice values.
        return this.field.dataType === null;
    }

    // Convert flow data type to the value from the data type drop down list.
    getFlowDataTypeFromInputType(newValue) {
        for (const key in this.inputFieldMap) {
            if (this.inputFieldMap[key].value === newValue) {
                return key;
            }
        }
        throw new Error('Unable to find Flow data type for provided screen field input type: ' + newValue);
    }

    // Used to figure out which choices are available as possible values for the default value setting.
    // The only options should be those that are associated with this field (not all choices in the flow).
    get defaultValueChoices() {
        const defaultChoices = [this.defaultValueNone];
        const choices = getFieldChoiceData(this.field);
        for (let i = 0; i < choices.length; i++) {
            // Only use this choice if it's a valid as a defaultValue option.
            if (choices[i].defaultValueOption) {
                defaultChoices.push({
                    label: choices[i].name,
                    value: choices[i].value
                });
            }
        }
        return defaultChoices;
    }

    get singleOrMultiSelectOptions() {
        return [
            {
                label: this.labels.singleSelectChoiceDisplay,
                value: CHOICE_DISPLAY_OPTIONS.SINGLE_SELECT
            },
            {
                label: this.labels.multiSelectChoiceDisplay,
                value: CHOICE_DISPLAY_OPTIONS.MULTI_SELECT
            }
        ];
    }

    get singleOrMultiSelectOptionValue() {
        if (this.singleOrMultiSelectOption) {
            return this.singleOrMultiSelectOption;
        } else if (isMultiSelectPicklistField(this.field) || isMultiSelectCheckboxField(this.field)) {
            this.singleOrMultiSelectOption = CHOICE_DISPLAY_OPTIONS.MULTI_SELECT;
        } else {
            this.singleOrMultiSelectOption = CHOICE_DISPLAY_OPTIONS.SINGLE_SELECT;
        }
        return this.singleOrMultiSelectOption;
    }

    get displayTypeOptions() {
        if (this.singleOrMultiSelectOption === CHOICE_DISPLAY_OPTIONS.SINGLE_SELECT) {
            return [
                {
                    label: this.labels.fieldTypeLabelPicklist,
                    value: CHOICE_SCREEN_FIELDS.PICKLIST
                },
                {
                    label: this.labels.fieldTypeLabelRadioButtons,
                    value: CHOICE_SCREEN_FIELDS.RADIO_BUTTONS
                }
            ];
        }
        return [
            {
                label: this.labels.fieldTypeLabelMultiSelectCheckboxes,
                value: CHOICE_SCREEN_FIELDS.CHECKBOX_GROUP
            },
            {
                label: this.labels.fieldTypeLabelMultiSelectPicklist,
                value: CHOICE_SCREEN_FIELDS.MULTI_SELECT_PICKLIST
            }
        ];
    }

    get displayTypeValue() {
        let displayTypeValue;
        if (this.singleOrMultiSelectOption === CHOICE_DISPLAY_OPTIONS.MULTI_SELECT) {
            if (isMultiSelectPicklistField(this.field)) {
                displayTypeValue = CHOICE_SCREEN_FIELDS.MULTI_SELECT_PICKLIST;
            } else if (isMultiSelectCheckboxField(this.field)) {
                displayTypeValue = CHOICE_SCREEN_FIELDS.CHECKBOX_GROUP;
            }
        } else if (this.singleOrMultiSelectOption === CHOICE_DISPLAY_OPTIONS.SINGLE_SELECT) {
            if (isPicklistField(this.field)) {
                displayTypeValue = CHOICE_SCREEN_FIELDS.PICKLIST;
            } else if (isRadioField(this.field)) {
                displayTypeValue = CHOICE_SCREEN_FIELDS.RADIO_BUTTONS;
            }
        }
        return displayTypeValue;
    }

    get defaultValue() {
        if (this.field.defaultSelectedChoiceReference && this.field.defaultSelectedChoiceReference.value) {
            return this.field.defaultSelectedChoiceReference;
        }
        // Select the 'nothing selected' option (i.e. no default set).
        // We can't use null here, because the component used to render the defaultValue options
        // wants a real string.
        return this.defaultValueNone;
    }
}
