import { LightningElement, api } from 'lwc';
import {
    PropertyChangedEvent,
    createChoiceAddedEvent,
    createChoiceChangedEvent,
    createChoiceDeletedEvent,
    createChoiceDisplayChangedEvent,
    createSingleOrMultiChoiceTypeChangedEvent,
    NewResourceEvent
} from 'builder_platform_interaction/events';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE, INPUT_FIELD_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    getFieldChoiceData,
    isMultiSelectCheckboxField,
    isMultiSelectPicklistField
} from 'builder_platform_interaction/screenEditorUtils';
import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import {
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME,
    ChoiceDisplayOptions
} from 'builder_platform_interaction/screenEditorUtils';
import { fetchFieldsForEntity, getEntityFieldWithApiName } from 'builder_platform_interaction/sobjectLib';
import { sanitizeDevName } from 'builder_platform_interaction/commonUtils';

const CHOICES_SECTION_NAME = 'choicesSection';
const FLOW_INPUT_FIELD_SUB_TYPES = Object.values(INPUT_FIELD_DATA_TYPE);

export const SINGLE_OR_MULTI_RADIO_GROUP_SELECTOR = 'lightning-radio-group';

/*
 * Screen element property editor for the radio field.
 */
export default class ScreenChoiceFieldPropertiesEditor extends LightningElement {
    labels = LABELS;
    inputFieldMap = INPUT_FIELD_DATA_TYPE;
    private _field;
    expandedSectionNames = [CHOICES_SECTION_NAME];
    _activePicklistValues = [];
    _oldPicklistChoiceData;

    getSingleOrMultiRadioButtons() {
        return this.template.querySelector(SINGLE_OR_MULTI_RADIO_GROUP_SELECTOR);
    }

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

    renderedCallback() {
        // This is needed to select the correct value if the warning is displayed.
        this.getSingleOrMultiRadioButtons().value = this.field.singleOrMultiSelect;
    }

    get isScaleEnabled() {
        const { dataType = null } = this.field;
        return dataType === 'Number' || dataType === 'Currency';
    }

    get isStringDataType() {
        const { dataType = null } = this.field;
        return dataType === 'String';
    }

    updateActivePicklistValues(fieldChoiceData) {
        const picklistChoiceData = fieldChoiceData.find(
            (fieldChoice) => fieldChoice.elementType === ELEMENT_TYPE.PICKLIST_CHOICE_SET
        );
        if (picklistChoiceData) {
            if (!this._oldPicklistChoiceData || picklistChoiceData.guid !== this._oldPicklistChoiceData.guid) {
                fetchFieldsForEntity(picklistChoiceData.picklistObject).then((entity) => {
                    this._activePicklistValues = getEntityFieldWithApiName(
                        entity,
                        picklistChoiceData.picklistField
                    ).activePicklistValues;
                });
                this._oldPicklistChoiceData = picklistChoiceData;
            }
        } else {
            this._activePicklistValues = [];
            this._oldPicklistChoiceData = null;
        }
    }

    get activePicklistValues() {
        return this._activePicklistValues;
    }

    get includeQuickCreateChoiceOption() {
        return this.field?.dataType === FLOW_DATA_TYPE.STRING.value;
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
        this.dispatchEvent(createSingleOrMultiChoiceTypeChangedEvent(this.field, event.detail.value));
    };

    handleChoiceDisplayTypeChanged = (event) => {
        event.stopPropagation();
        this.dispatchEvent(createChoiceDisplayChangedEvent(this.field, event.detail.value));
    };

    handleAddInlineResource = (event: NewResourceEvent) => {
        if (event && event.detail) {
            const newResourceInfo = event.detail.newResourceInfo ? event.detail.newResourceInfo : {};
            newResourceInfo.dataType = this.field.dataType;
            newResourceInfo.newResourceTypeLabel = this.labels.fieldTypeLabelChoice;
            if (newResourceInfo?.userProvidedText) {
                newResourceInfo.resourceTypes = [ELEMENT_TYPE.CHOICE];
                let devName = sanitizeDevName(newResourceInfo.userProvidedText);
                if (devName === '') {
                    devName = 'UniqueName';
                }
                newResourceInfo.newResource = {
                    name: devName,
                    choiceText: newResourceInfo.userProvidedText,
                    storedValue: newResourceInfo.userProvidedText,
                    elementType: ELEMENT_TYPE.CHOICE,
                    dataType: this.field.dataType
                };
            } else {
                newResourceInfo.resourceTypes = [
                    ELEMENT_TYPE.CHOICE,
                    ELEMENT_TYPE.PICKLIST_CHOICE_SET,
                    ELEMENT_TYPE.RECORD_CHOICE_SET
                ];
            }
            event.detail.newResourceInfo = newResourceInfo;
        }
    };

    get fieldChoices() {
        const fieldChoiceData = getFieldChoiceData(this.field);
        this.updateActivePicklistValues(fieldChoiceData);
        return fieldChoiceData;
    }

    get ferovResourcePickerConfig() {
        return {
            allowLiterals: true,
            collection: false,
            elementType: ELEMENT_TYPE.SCREEN
        };
    }

    get choiceResourcePickerConfig() {
        return {
            allowLiterals: false,
            collection: false,
            hideGlobalConstants: true,
            hideSystemVariables: true,
            hideGlobalVariables: true,
            hideNewResource: false,
            newResourceTypeLabel: this.labels.fieldTypeLabelChoice,
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

    get defaultValueVisible() {
        // If the there is at least one choice, user should be able to set a default value
        return getFieldChoiceData(this.field).some((choice) => choice.name !== '');
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

    get singleOrMultiSelectOptions() {
        return [
            {
                label: this.labels.multiSelectChoiceDisplay,
                value: ChoiceDisplayOptions.MULTI_SELECT
            },
            {
                label: this.labels.singleSelectChoiceDisplay,
                value: ChoiceDisplayOptions.SINGLE_SELECT
            }
        ];
    }

    get singleOrMultiSelectOptionValue() {
        return this.field.singleOrMultiSelect;
    }

    get displayTypeOptions() {
        if (this.singleOrMultiSelectOptionValue === ChoiceDisplayOptions.SINGLE_SELECT) {
            return [
                {
                    label: this.labels.fieldTypeLabelPicklist,
                    value: FlowScreenFieldType.DropdownBox
                },
                {
                    label: this.labels.fieldTypeLabelRadioButtons,
                    value: FlowScreenFieldType.RadioButtons
                }
            ];
        }
        return [
            {
                label: this.labels.fieldTypeLabelMultiSelectCheckboxes,
                value: FlowScreenFieldType.MultiSelectCheckboxes
            },
            {
                label: this.labels.fieldTypeLabelMultiSelectPicklist,
                value: FlowScreenFieldType.MultiSelectPicklist
            }
        ];
    }

    get displayTypeValue() {
        return this.field.fieldType;
    }
}
