import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import {
    validateExpression,
    getLhsCombobox
} from '../expressionBuilderTestUtils';
import {
    createComponentForTest,
    getFerToFerovExpressionBuilder
} from './decisionEditorTestUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { setupStateForProcessType, resetState } from '../integrationTestUtils';
import { selectComboboxItemBy } from '../comboboxTestUtils';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';

describe('Decision Editor expression builder', () => {
    let decisionForPropertyEditor, decisionEditor, store;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FLOW);
        setApexClasses(apexTypesForFlow);
    });
    afterAll(() => {
        resetState();
    });
    describe('Validation', () => {
        let expressionBuilder;
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
        });
        beforeEach(async () => {
            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
            await ticks();
            expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
        });

        test.each`
            lhs                                                          | operator         | rhs            | rhsErrorMessage
            ${'{!accountSObjectVariable.BillingLatitude}'}               | ${'EqualTo'}     | ${'500.0'}     | ${undefined}
            ${'{!accountSObjectVariable.BillingLatitude}'}               | ${'EqualTo'}     | ${'my string'} | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!feedItemVariable.CreatedBy:User.DigestFrequency}'}      | ${'EqualTo'}     | ${'D'}         | ${undefined}
            ${'{!feedItemVariable.CreatedBy:User.DigestFrequency}'}      | ${'EqualTo'}     | ${'D'}         | ${undefined}
            ${'{!feedItemVariable.CreatedBy:User.NumberOfFailedLogins}'} | ${'GreaterThan'} | ${'2'}         | ${undefined}
            ${'{!feedItemVariable.CreatedBy:User.NumberOfFailedLogins}'} | ${'GreaterThan'} | ${'myString'}  | ${'FlowBuilderCombobox.numberErrorMessage'}
        `(
            '"$lhs $operator $rhs" should be $rhsErrorMessage',
            async ({ lhs, operator, rhs, rhsErrorMessage }) => {
                expect(
                    await validateExpression(expressionBuilder, {
                        lhs,
                        operator,
                        rhs
                    })
                ).toEqual({ rhsErrorMessage });
            }
        );
        it('can select account field of apex type', async () => {
            // Given
            const lhsCombobox = getLhsCombobox(expressionBuilder);

            // When
            const selectedItem = await selectComboboxItemBy(
                lhsCombobox,
                'text',
                ['apexComplexTypeVariable', 'acct'],
                { blur: true }
            );

            // Then
            expect(selectedItem).toBeDefined();
            expect(lhsCombobox.errorMessage).toBeNull();
        });
    });
});
