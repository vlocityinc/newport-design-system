import {
    ticks,
    deepQuerySelector,
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    blurEvent,
    textInputEvent,
    selectEvent,
    changeEvent
} from 'builder_platform_interaction/builderTestUtils';
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
    if (isReference(lhs)) {
        await typeMergeFieldInCombobox(lhsCombobox, lhs);
    } else {
        await typeLiteralValueInCombobox(lhsCombobox, lhs);
    }
    if (lhsCombobox.errorMessage) {
        return { lhsErrorMessage: lhsCombobox.errorMessage };
    }
    if (operator) {
        if (!selectOperator(expressionBuilder, operator)) {
            return { operatorErrorMessage: `No operator ${operator}` };
        }
        await ticks();
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

export const getGroupedComboboxItemBy = (
    groupedCombobox,
    propertyName,
    propertyValue
) => {
    for (const item of groupedCombobox.items) {
        if (item.items) {
            for (const subItem of item.items) {
                if (subItem[propertyName] === propertyValue) {
                    return subItem;
                }
            }
        } else if (item[propertyName] === propertyValue) {
            return item;
        }
    }
    return undefined;
};

export const selectComboboxItemBy = async (
    combobox,
    propertyName,
    propertyValues,
    { blur = true }
) => {
    let promise = Promise.resolve();
    for (const propertyValue of propertyValues) {
        promise = promise.then(() => {
            const comboboxItem = getGroupedComboboxItemBy(
                combobox,
                propertyName,
                propertyValue
            );
            if (!comboboxItem) {
                return undefined;
            }
            combobox.dispatchEvent(selectEvent(comboboxItem.value));
            return ticks(50).then(() => comboboxItem);
        });
    }
    const comboboxItem = await promise;
    if (blur) {
        combobox.dispatchEvent(blurEvent);
    }
    await ticks();
    return comboboxItem;
};