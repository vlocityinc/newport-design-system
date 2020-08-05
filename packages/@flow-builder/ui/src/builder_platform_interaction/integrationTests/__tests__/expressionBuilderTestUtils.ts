import {
    ticks,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    changeEvent,
    clickPill
} from 'builder_platform_interaction/builderTestUtils';
import { typeReferenceOrValueInCombobox } from './comboboxTestUtils';
import Combobox from 'builder_platform_interaction/combobox';

export const EXPRESSION_BUILDER_SELECTORS = {
    LHS_COMBOBOX: 'builder_platform_interaction-combobox.lhs',
    RHS_COMBOBOX: 'builder_platform_interaction-combobox.rhs',
    OPERATOR_COMBOBOX: 'lightning-combobox.operator'
};

export const getBaseExpressionBuilder = (expressionBuilder) =>
    expressionBuilder.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER);

export const getOperatorCombobox = (expressionBuilder) => {
    return deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.OPERATOR_COMBOBOX
    ]);
};

export const selectOperator = (expressionBuilder, operator) => {
    const operatorCombobox = getOperatorCombobox(expressionBuilder);
    if (operatorCombobox.options.find((option) => option.value === operator)) {
        operatorCombobox.dispatchEvent(changeEvent(operator));
        return true;
    }
    return false;
};

/**
 * Returns combobox component removing pill if needed
 * @param {HTMLElement} expressionBuilder - current expression builder containing the combobox
 * @param {string} comboboxSelector - combobox selector (eg: rhs combobox selector @link{EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX}
 * @param {boolean} [clickOnPill=false] - if true we do click on the pill switching to merge field notation
 * @returns {Promise<HTMLElement>} - promise fulfilled with combobox component
 * @private
 */
const getCombobox = async (
    expressionBuilder: HTMLElement,
    comboboxSelector: string,
    clickOnPill = false
): Promise<Combobox> => {
    const combobox = deepQuerySelector(expressionBuilder, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        comboboxSelector
    ]);
    if (clickOnPill) {
        await clickPill(combobox);
    }
    return combobox;
};

/**
 * Returns LHS combobox component removing pill if needed
 * @param {HTMLElement} expressionBuilder - current expression builder containing the combobox
 * @param {boolean} [clickOnPill=false] - if true we do click on the pill switching to merge field notation
 * @returns {Promise<Combobox>} - promise fulfilled with LHS combobox component
 */
export const getLhsCombobox = async (expressionBuilder: HTMLElement, clickOnPill = false): Promise<Combobox> =>
    getCombobox(expressionBuilder, EXPRESSION_BUILDER_SELECTORS.LHS_COMBOBOX, clickOnPill);

/**
 * Returns RHS combobox component removing pill if needed
 * @param {HTMLElement} expressionBuilder - current expression builder containing the combobox
 * @param {boolean} [clickOnPill=false] - if true we do click on the pill switching to merge field notation
 * @returns {Promise<Combobox>} - promise fulfilled with RHS combobox component
 */
export const getRhsCombobox = async (expressionBuilder: HTMLElement, clickOnPill = false): Promise<Combobox> =>
    getCombobox(expressionBuilder, EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX, clickOnPill);

export const validateExpression = async (expressionBuilder, { lhs, rhs, operator }) => {
    const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
    await typeReferenceOrValueInCombobox(lhsCombobox, lhs);
    if (lhsCombobox.errorMessage) {
        return { lhsErrorMessage: lhsCombobox.errorMessage };
    }
    if (operator) {
        if (!selectOperator(expressionBuilder, operator)) {
            return { operatorErrorMessage: `No operator ${operator}` };
        }
        await ticks(50);
    }
    const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
    await typeReferenceOrValueInCombobox(rhsCombobox, rhs);
    if (rhsCombobox.errorMessage) {
        return { rhsErrorMessage: rhsCombobox.errorMessage };
    }
    return {};
};
