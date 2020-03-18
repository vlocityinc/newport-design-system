import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { validateExpression, getLhsCombobox, getOperatorCombobox } from '../expressionBuilderTestUtils';
import { createComponentForTest, getFerToFerovExpressionBuilder } from './decisionEditorTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { setupStateForProcessType, resetState, translateFlowToUIAndDispatch } from '../integrationTestUtils';
import { selectComboboxItemBy, typeReferenceOrValueInCombobox } from '../comboboxTestUtils';

describe('Decision Editor expression builder', () => {
    let decisionForPropertyEditor, decisionEditor, store;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FLOW);
    });
    afterAll(() => {
        resetState();
    });
    describe('Validation', () => {
        let expressionBuilder;
        beforeAll(() => {
            translateFlowToUIAndDispatch(flowWithAllElements, store);
        });
        beforeEach(async () => {
            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
            await ticks();
            expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
        });

        test.each`
            lhs                                                          | operator         | rhs                            | rhsErrorMessage
            ${'{!accountSObjectVariable.BillingLatitude}'}               | ${'EqualTo'}     | ${'500.0'}                     | ${undefined}
            ${'{!accountSObjectVariable.BillingLatitude}'}               | ${'EqualTo'}     | ${'my string'}                 | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!feedItemVariable.CreatedBy:User.DigestFrequency}'}      | ${'EqualTo'}     | ${'D'}                         | ${undefined}
            ${'{!feedItemVariable.CreatedBy:User.DigestFrequency}'}      | ${'EqualTo'}     | ${'D'}                         | ${undefined}
            ${'{!feedItemVariable.CreatedBy:User.NumberOfFailedLogins}'} | ${'GreaterThan'} | ${'2'}                         | ${undefined}
            ${'{!feedItemVariable.CreatedBy:User.NumberOfFailedLogins}'} | ${'GreaterThan'} | ${'myString'}                  | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!loopOnAccountAutoOutput}'}                              | ${'WasVisited'}  | ${'{!$GlobalConstant.True}'}   | ${undefined}
            ${'{!loopOnAccountAutoOutput}'}                              | ${'EqualTo'}     | ${'{!accountSObjectVariable}'} | ${undefined}
            ${'{!loopOnAccountAutoOutput.BillingLatitude}'}              | ${'EqualTo'}     | ${'500.0'}                     | ${undefined}
            ${'{!loopOnTextCollectionAutoOutput}'}                       | ${'EqualTo'}     | ${'my string'}                 | ${undefined}
            ${'{!loopOnTextCollectionAutoOutput}'}                       | ${'WasVisited'}  | ${'{!$GlobalConstant.True}'}   | ${undefined}
            ${'{!loopOnApexAutoOutput}'}                                 | ${'WasVisited'}  | ${'{!$GlobalConstant.True}'}   | ${undefined}
            ${'{!loopOnApexAutoOutput.name}'}                            | ${'EqualTo'}     | ${'myString'}                  | ${undefined}
            ${'{!loopOnTextCollection}'}                                 | ${'WasVisited'}  | ${'{!$GlobalConstant.True}'}   | ${undefined}
        `('"$lhs $operator $rhs" should be $rhsErrorMessage', async ({ lhs, operator, rhs, rhsErrorMessage }) => {
            expect(
                await validateExpression(expressionBuilder, {
                    lhs,
                    operator,
                    rhs
                })
            ).toEqual({ rhsErrorMessage });
        });
        it('can select account field of apex type', async () => {
            // Given
            const lhsCombobox = getLhsCombobox(expressionBuilder);

            // When
            const selectedItem = await selectComboboxItemBy(lhsCombobox, 'text', ['apexComplexTypeVariable', 'acct'], {
                blur: true
            });

            // Then
            expect(selectedItem).toBeDefined();
            expect(lhsCombobox.errorMessage).toBeNull();
        });
        it('can only select WasVisited on loop with manual output', async () => {
            // Given
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            await typeReferenceOrValueInCombobox(lhsCombobox, '{!loopOnTextCollection}');

            // When
            const operators = getOperatorCombobox(expressionBuilder).options;

            // Then
            expect(operators).toHaveLength(1);
            expect(operators[0].value).toContain('WasVisited');
        });
    });
});
