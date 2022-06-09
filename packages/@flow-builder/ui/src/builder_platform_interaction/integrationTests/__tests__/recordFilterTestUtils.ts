import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import FieldToFerovExpressionBuilder from 'builder_platform_interaction/fieldToFerovExpressionBuilder';
import { ComboboxTestComponent } from './comboboxTestUtils';
import { ExpressionBuilderComponentTest } from './expressionBuilderTestUtils';

export const getFieldToFerovExpressionBuilders = (parentElement) =>
    Array.from(
        parentElement.shadowRoot.querySelectorAll(INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER)
    ).map((element) => new ExpressionBuilderComponentTest(element as FieldToFerovExpressionBuilder & HTMLElement));

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

export const getRecordCombobox = (parentElement) =>
    new ComboboxTestComponent(
        deepQuerySelector(parentElement, [
            INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
        ])
    );

/*
 * Get RHS combobox from parent component having a record filter
 * @param parentElement parent component of the record filter
 * @param filterIndex index of the condition filter (by default 0: first filter condition)
 * @return RHS combobox
 */
export const getRHSCombobox = (parentElement, filterIndex = 0) =>
    getFieldToFerovExpressionBuilders(
        parentElement.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER)
    )[filterIndex].getRhsCombobox();

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
