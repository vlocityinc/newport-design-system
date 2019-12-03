import {
    ticks,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    changeEvent
} from 'builder_platform_interaction/builderTestUtils';
import { typeReferenceOrValueInCombobox } from './comboboxTestUtils';

export const EXPRESSION_BUILDER_SELECTORS = {
    LHS_COMBOBOX: 'builder_platform_interaction-combobox.lhs',
    RHS_COMBOBOX: 'builder_platform_interaction-combobox.rhs',
    OPERATOR_COMBOBOX: 'lightning-combobox.operator'
};

export const selectOperator = (expressionBuilder, operator) => {
    const operatorCombobox = deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.OPERATOR_COMBOBOX
    ]);
    if (operatorCombobox.options.find(option => option.value === operator)) {
        operatorCombobox.dispatchEvent(changeEvent(operator));
        return true;
    }
    return false;
};

export const getLhsCombobox = expressionBuilder => {
    return deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.LHS_COMBOBOX
    ]);
};

export const getRhsCombobox = expressionBuilder => {
    return deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX
    ]);
};

export const validateExpression = async (
    expressionBuilder,
    { lhs, rhs, operator }
) => {
    const lhsCombobox = getLhsCombobox(expressionBuilder);
    const rhsCombobox = getRhsCombobox(expressionBuilder);
    await typeReferenceOrValueInCombobox(lhsCombobox, lhs);
    if (lhsCombobox.errorMessage) {
        return { lhsErrorMessage: lhsCombobox.errorMessage };
    }
    if (operator) {
        if (!selectOperator(expressionBuilder, operator)) {
            return { operatorErrorMessage: `No operator ${operator}` };
        }
        await ticks();
    }
    await typeReferenceOrValueInCombobox(rhsCombobox, rhs);
    if (rhsCombobox.errorMessage) {
        return { rhsErrorMessage: rhsCombobox.errorMessage };
    }
    return {};
};
