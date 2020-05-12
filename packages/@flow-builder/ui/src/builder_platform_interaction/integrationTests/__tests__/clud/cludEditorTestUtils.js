// @ts-nocheck
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

export const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getBaseResourcePickerCombobox = element => {
    return deepQuerySelector(element, [SELECTORS.BASE_RESOURCE_PICKER, SELECTORS.INTERACTION_COMBOBOX]);
};

export const getOutputResourcePickerCombobox = outputResourcePicker => {
    return getBaseResourcePickerCombobox(outputResourcePicker);
};

export const getResourceCombobox = recordEditor => {
    return getBaseResourcePickerCombobox(
        deepQuerySelector(recordEditor, [
            SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER,
            SELECTORS.FEROV_RESOURCE_PICKER
        ])
    );
};

export const getResourceGroupedCombobox = recordEditor => {
    return deepQuerySelector(getResourceCombobox(recordEditor), [SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
};

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

export const getRadioGroups = parentElement => {
    return parentElement.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);
};

export const getRecordVariablePickerChildGroupedComboboxComponent = parentPickerComponent => {
    return deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.INTERACTION_COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

export const getEntityResourcePickerChildGroupedComboboxComponent = parentPickerComponent => {
    return deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

export const getEntityResourcePicker = editor => {
    return editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);
};

export const getFieldToFerovExpressionBuilders = parentElement => {
    return parentElement.shadowRoot.querySelectorAll(
        INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER
    );
};

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
