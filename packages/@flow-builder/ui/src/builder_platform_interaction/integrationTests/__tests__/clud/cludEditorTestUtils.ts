import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

const getBaseResourcePickerCombobox = element => {
    return deepQuerySelector(element, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
    ]);
};

export const getOutputResourcePickerCombobox = outputResourcePicker =>
    getBaseResourcePickerCombobox(outputResourcePicker);

export const getResourceCombobox = recordEditor =>
    getBaseResourcePickerCombobox(
        deepQuerySelector(recordEditor, [
            INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER
        ])
    );

export const getResourceGroupedCombobox = recordEditor =>
    deepQuerySelector(getResourceCombobox(recordEditor), [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);

export const newFilterItem = (lhsValue = '', operatorValue = '', rhsValue = '', rhsDataType = '') => ({
    leftHandSide: {
        value: lhsValue,
        error: null
    },
    rightHandSide: {
        value: rhsValue,
        error: null
    },
    rightHandSideDataType: {
        value: rhsDataType,
        error: null
    },
    operator: {
        value: operatorValue,
        error: null
    }
});

export const getRadioGroups = parentElement =>
    parentElement.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

export const getRecordVariablePickerChildGroupedComboboxComponent = parentPickerComponent =>
    deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const getEntityResourcePickerChildGroupedComboboxComponent = parentPickerComponent =>
    deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const getEntityResourcePicker = editor =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);

export const getFieldToFerovExpressionBuilders = parentElement =>
    parentElement.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER);

export const getFilterCustomConditionLogicInput = parentElement =>
    deepQuerySelector(parentElement, [
        INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER,
        INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT
    ]);

export const getFilterConditionLogicCombobox = parentElement =>
    deepQuerySelector(parentElement, [
        INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER,
        INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
    ]);
