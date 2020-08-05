import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';

export const getFieldToFerovExpressionBuilders = (parentElement) =>
    parentElement.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER);

export const getFilterConditionLogicCombobox = (parentElement) =>
    deepQuerySelector(parentElement, [
        INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER,
        INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
    ]);

export const getFilterCustomConditionLogicInput = (parentElement) =>
    deepQuerySelector(parentElement, [
        INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER,
        INTERACTION_COMPONENTS_SELECTORS.CONDITION_LIST,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT
    ]);

export const getRecordGroupedComboox = (parentElement) =>
    deepQuerySelector(parentElement, [
        INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const emptyFilterItem = {
    leftHandSide: { error: null, value: '' },
    operator: { error: null, value: '' },
    rightHandSide: { error: null, value: '' },
    rightHandSideDataType: { error: null, value: '' }
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
