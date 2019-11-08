import {
    ticks,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import {
    blurEvent,
    textInputEvent,
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    OnChangeEvent
} from './integrationTestUtils';
import {
    addCurlyBraces,
    removeCurlyBraces,
    splitStringBySeparator,
    isReference
} from 'builder_platform_interaction/commonUtils';

export const EXPRESSION_BUILDER_SELECTORS = {
    LHS_COMBOBOX: 'builder_platform_interaction-combobox.lhs',
    RHS_COMBOBOX: 'builder_platform_interaction-combobox.rhs',
    OPERATOR_COMBOBOX: 'lightning-combobox.operator'
};

export const typeLiteralValueInCombobox = async (combobox, value) => {
    const groupedCombobox = deepQuerySelector(combobox, [
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
    groupedCombobox.dispatchEvent(textInputEvent(value));
    await ticks();
    groupedCombobox.dispatchEvent(blurEvent);
};

export const typeMergeFieldInCombobox = async (combobox, mergeField) => {
    const groupedCombobox = deepQuerySelector(combobox, [
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
    const parts = splitStringBySeparator(removeCurlyBraces(mergeField));
    let promise = Promise.resolve();
    for (let i = 0; i < parts.length; i++) {
        promise = promise.then(() => {
            let displayText = parts.slice(0, i + 1).join('.');
            displayText = addCurlyBraces(displayText);
            groupedCombobox.dispatchEvent(textInputEvent(displayText));
            return ticks();
        });
    }
    await promise;
    groupedCombobox.dispatchEvent(blurEvent);
};

export const validateExpression = async (
    expressionBuilder,
    { lhs, rhs, operator }
) => {
    const lhsCombobox = deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.LHS_COMBOBOX
    ]);
    const rhsCombobox = deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX
    ]);
    if (isReference(lhs)) {
        await typeMergeFieldInCombobox(lhsCombobox, lhs);
    } else {
        await typeLiteralValueInCombobox(lhsCombobox, lhs);
    }
    if (lhsCombobox.errorMessage) {
        return { lhsErrorMessage: lhsCombobox.errorMessage };
    }
    if (operator) {
        const operatorCombobox = deepQuerySelector(expressionBuilder, [
            INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
            EXPRESSION_BUILDER_SELECTORS.OPERATOR_COMBOBOX
        ]);
        if (
            operatorCombobox.options.find(option => option.value === operator)
        ) {
            operatorCombobox.dispatchEvent(new OnChangeEvent(operator));
            await ticks();
        } else {
            return { operatorErrorMessage: `No operator ${operator}` };
        }
    }
    if (isReference(rhs)) {
        await typeMergeFieldInCombobox(rhsCombobox, rhs);
    } else {
        await typeLiteralValueInCombobox(rhsCombobox, rhs);
    }
    if (rhsCombobox.errorMessage) {
        return { rhsErrorMessage: rhsCombobox.errorMessage };
    }
    return {};
};
