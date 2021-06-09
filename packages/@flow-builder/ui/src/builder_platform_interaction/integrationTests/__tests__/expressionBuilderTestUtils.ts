import {
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    changeEvent,
    clickPill
} from 'builder_platform_interaction/builderTestUtils';
import { ComboboxTestComponent } from './comboboxTestUtils';
import { TestComponent } from './testComponent';
import FerToFerovExpressionBuilder from 'builder_platform_interaction/ferToFerovExpressionBuilder';
import FieldToFerovExpressionBuilder from 'builder_platform_interaction/fieldToFerovExpressionBuilder';
import BaseExpressionBuilder from 'builder_platform_interaction/baseExpressionBuilder';

export const EXPRESSION_BUILDER_SELECTORS = {
    LHS_COMBOBOX: 'builder_platform_interaction-combobox.lhs',
    RHS_COMBOBOX: 'builder_platform_interaction-combobox.rhs',
    OPERATOR_COMBOBOX: 'lightning-combobox.operator'
};

export class ExpressionBuilderComponentTest extends TestComponent<
    FerToFerovExpressionBuilder | FieldToFerovExpressionBuilder
> {
    public getBaseExpressionBuilderElement() {
        return this.element.shadowRoot!.querySelector(
            INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER
        ) as BaseExpressionBuilder & HTMLElement;
    }

    public getOperatorComboboxElement() {
        return this.deepQuerySelector([
            INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
            EXPRESSION_BUILDER_SELECTORS.OPERATOR_COMBOBOX
        ]);
    }

    public selectOperator(operator) {
        const operatorCombobox = this.getOperatorComboboxElement();
        if (operatorCombobox.options.find((option) => option.value === operator)) {
            operatorCombobox.dispatchEvent(changeEvent(operator));
            return true;
        }
        return false;
    }

    /**
     * Returns combobox component removing pill if needed
     *
     * @param {string} comboboxSelector - combobox selector (eg: rhs combobox selector @link{EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX}
     * @param {boolean} [clickOnPill=false] - if true we do click on the pill switching to merge field notation
     * @returns {Promise<HTMLElement>} - promise fulfilled with combobox component
     */
    private async getCombobox(comboboxSelector: string, clickOnPill = false) {
        const combobox = this.deepQuerySelector([
            INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
            comboboxSelector
        ]);
        if (clickOnPill) {
            await clickPill(combobox);
        }
        return new ComboboxTestComponent(combobox);
    }

    /**
     * Returns LHS combobox component removing pill if needed
     *
     * @param {HTMLElement} expressionBuilder - current expression builder containing the combobox
     * @param {boolean} [clickOnPill=false] - if true we do click on the pill switching to merge field notation
     * @returns {Promise<Combobox>} - promise fulfilled with LHS combobox component
     */
    public async getLhsCombobox(clickOnPill = false) {
        return this.getCombobox(EXPRESSION_BUILDER_SELECTORS.LHS_COMBOBOX, clickOnPill);
    }

    /**
     * Returns RHS combobox component removing pill if needed
     *
     * @param {HTMLElement} expressionBuilder - current expression builder containing the combobox
     * @param {boolean} [clickOnPill=false] - if true we do click on the pill switching to merge field notation
     * @returns {Promise<Combobox>} - promise fulfilled with RHS combobox component
     */
    public async getRhsCombobox(clickOnPill = false) {
        return this.getCombobox(EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX, clickOnPill);
    }

    public async validateExpression({ lhs, rhs, operator }: { lhs: string; rhs: string; operator: string }) {
        const lhsCombobox = await this.getLhsCombobox(true);
        await lhsCombobox.typeReferenceOrValue(lhs);
        if (lhsCombobox.element.errorMessage) {
            return { lhsErrorMessage: lhsCombobox.element.errorMessage };
        }
        if (operator) {
            if (!this.selectOperator(operator)) {
                return { operatorErrorMessage: `No operator ${operator}` };
            }
            await ticks(50);
        }
        const rhsCombobox = await this.getRhsCombobox(true);
        await rhsCombobox.typeReferenceOrValue(rhs);
        if (rhsCombobox.element.errorMessage) {
            return { rhsErrorMessage: rhsCombobox.element.errorMessage };
        }
        return {};
    }
}

/**
 * Get an expression tester
 *
 * Can be used that way :
 * const testExpression = getExpressionTester(() => expressionBuilder);
 *
 * testExpression.each`
 *   lhs                                            | operator    | rhs                                                     | rhsErrorMessage
 *   ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'500.0'}                                              | ${undefined}
 *   ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'not a number'}                                       | ${'FlowBuilderCombobox.numberErrorMessage'}
 *   `;
 *
 * @param expressionBuilderProvider Function that provides the expression builder
 */
export const getExpressionTester = (
    expressionBuilderProvider: () => (FerToFerovExpressionBuilder | FieldToFerovExpressionBuilder) & HTMLElement
) => ({
    each: (strings: TemplateStringsArray, ...keys: (string | undefined)[]) => {
        it.each(strings, ...keys)(
            'error for "$lhs $operator $rhs" should be : $rhsErrorMessage',
            async ({ lhs, operator, rhs, rhsErrorMessage }) => {
                const expressionBuilderTestComponent = new ExpressionBuilderComponentTest(expressionBuilderProvider());
                expect(
                    await expressionBuilderTestComponent.validateExpression({
                        lhs,
                        operator,
                        rhs
                    })
                ).toEqual({ rhsErrorMessage });
            }
        );
    }
});
