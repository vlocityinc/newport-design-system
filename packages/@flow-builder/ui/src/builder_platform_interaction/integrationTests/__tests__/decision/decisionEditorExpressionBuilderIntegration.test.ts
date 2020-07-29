import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { validateExpression, getLhsCombobox, getOperatorCombobox, getRhsCombobox } from '../expressionBuilderTestUtils';
import { createComponentForTest, getFerToFerovExpressionBuilder } from './decisionEditorTestUtils';
import { getComboboxPill, removeEvent, ticks } from 'builder_platform_interaction/builderTestUtils';
import {
    resetState,
    translateFlowToUIAndDispatch,
    setupStateForFlow,
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES
} from '../integrationTestUtils';
import { selectComboboxItemBy, typeMergeFieldInCombobox, typeReferenceOrValueInCombobox } from '../comboboxTestUtils';

jest.mock('@salesforce/label/FlowBuilderElementLabels.actionAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => ({ default: '{0} from {1}' }),
    { virtual: true }
);

describe('Decision Editor expression builder', () => {
    let expressionBuilder;
    beforeAll(async () => {
        const store = await setupStateForFlow(flowWithAllElements);
        translateFlowToUIAndDispatch(flowWithAllElements, store);
    });
    beforeEach(() => {
        const element = getElementByDevName('decision');
        const decisionForPropertyEditor = getElementForPropertyEditor(element);
        const decisionEditor = createComponentForTest(decisionForPropertyEditor);
        expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
    });
    afterAll(() => {
        resetState();
    });
    describe('Validation', () => {
        test.each`
            lhs                                                          | operator         | rhs                            | rhsErrorMessage
            ${'{!accountSObjectVariable.BillingLatitude}'}               | ${'EqualTo'}     | ${'500.0'}                     | ${undefined}
            ${'{!accountSObjectVariable.BillingLatitude}'}               | ${'EqualTo'}     | ${'my string'}                 | ${'FlowBuilderCombobox.numberErrorMessage'}
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
            const lhsCombobox = await getLhsCombobox(expressionBuilder, true);

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
            const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
            await typeReferenceOrValueInCombobox(lhsCombobox, '{!loopOnTextCollection}');

            // When
            const operators = getOperatorCombobox(expressionBuilder).options;

            // Then
            expect(operators).toHaveLength(1);
            expect(operators[0].value).toContain('WasVisited');
        });
        it('Operator and RHS disabled (without pill) when LHS value is emptied (LHS was initially in pill mode)', async () => {
            const lhsCombobox = await getLhsCombobox(expressionBuilder);
            expect(lhsCombobox.pill).not.toBeNull();
            await typeReferenceOrValueInCombobox(lhsCombobox, '', true);
            const operatorCombobox = getOperatorCombobox(expressionBuilder);
            expect(operatorCombobox.disabled).toBe(true);
            const rhsCombobox = await getRhsCombobox(expressionBuilder);
            expect(rhsCombobox.pill).toBeNull();
            expect(rhsCombobox.disabled).toBe(true);
        });
        it('Operator and RHS disabled (without pill) when LHS pill removed)', async () => {
            const lhsCombobox = await getLhsCombobox(expressionBuilder);
            expect(lhsCombobox.pill).not.toBeNull();
            const pillCombobox = getComboboxPill(lhsCombobox);
            pillCombobox.dispatchEvent(removeEvent());
            await ticks(1);
            const operatorCombobox = getOperatorCombobox(expressionBuilder);
            expect(operatorCombobox.disabled).toBe(true);
            const rhsCombobox = await getRhsCombobox(expressionBuilder);
            expect(rhsCombobox.pill).toBeNull();
            expect(rhsCombobox.disabled).toBe(true);
        });
    });
    describe('pill', () => {
        describe('pill in error?', () => {
            describe('RHS change', () => {
                it('should  not display RHS pill in error after changing RHS value to one incompatible with LHS value', async () => {
                    const lhsCombobox = await getLhsCombobox(expressionBuilder);
                    expect(lhsCombobox.value.displayText).toEqual('{!accountSObjectVariable}');
                    expect(lhsCombobox.pill).toEqual({ label: 'accountSObjectVariable', iconName: 'utility:sobject' });
                    const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                    await typeMergeFieldInCombobox(rhsCombobox, '{!feedItemVariable}');
                    expect(rhsCombobox.errorMessage).not.toBeNull();
                    expect(rhsCombobox.pill).toBeNull();
                });
            });
        });
        describe('On typing and blur (LHS/RHS changes)', () => {
            describe('No error', () => {
                it.each`
                    lhs                                                          | rhs                                                          | expectedLhsPill                                                                                                    | expectedRhsPill
                    ${'{!feedItemVariable}'}                                     | ${'{!feedItemVariable}'}                                     | ${{ iconName: 'utility:sobject', label: 'feedItemVariable' }}                                                      | ${{ iconName: 'utility:sobject', label: 'feedItemVariable' }}
                    ${'{!stringVariable}'}                                       | ${'{!feedItemVariable.CreatedBy:User.Name}'}                 | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'feedItemVariable > Created By ID (User) > Full Name' }}
                    ${'{!stringVariable}'}                                       | ${'{!stringConstant}'}                                       | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'stringConstant' }}
                    ${'{!stringVariable}'}                                       | ${'{!textTemplate1}'}                                        | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'textTemplate1' }}
                    ${'{!dateVariable}'}                                         | ${'{!dateVariable}'}                                         | ${{ iconName: 'utility:event', label: 'dateVariable' }}                                                            | ${{ iconName: 'utility:event', label: 'dateVariable' }}
                    ${'{!numberVariable}'}                                       | ${'{!numberVariable}'}                                       | ${{ iconName: 'utility:topic2', label: 'numberVariable' }}                                                         | ${{ iconName: 'utility:topic2', label: 'numberVariable' }}
                    ${'{!currencyVariable}'}                                     | ${'{!currencyVariable}'}                                     | ${{ iconName: 'utility:currency', label: 'currencyVariable' }}                                                     | ${{ iconName: 'utility:currency', label: 'currencyVariable' }}
                    ${'{!feedItemVariable.IsClosed}'}                            | ${'{!feedItemVariable.IsClosed}'}                            | ${{ iconName: 'utility:crossfilter', label: 'feedItemVariable > Is Closed' }}                                      | ${{ iconName: 'utility:crossfilter', label: 'feedItemVariable > Is Closed' }}
                    ${'{!apexComplexTypeVariable.acct}'}                         | ${'{!apexComplexTypeVariable.acct}'}                         | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}                                        | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                    ${'{!apexComplexTypeVariable.acct.BillingCity}'}             | ${'{!apexComplexTypeVariable.acct.BillingCity}'}             | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > acct > Billing City' }}                            | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > acct > Billing City' }}
                    ${'{!apexCall_Car_automatic_output.car}'}                    | ${'{!apexCall_Car_automatic_output.car}'}                    | ${{ iconName: 'utility:apex', label: 'Outputs from apexCall_Car_automatic_output > car' }}                         | ${{ iconName: 'utility:apex', label: 'Outputs from apexCall_Car_automatic_output > car' }}
                    ${'{!subflowAutomaticOutput.accountOutput}'}                 | ${'{!subflowAutomaticOutput.accountOutput}'}                 | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}                   | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                    ${'{!subflowAutomaticOutput.accountOutput.BillingLatitude}'} | ${'{!subflowAutomaticOutput.accountOutput.BillingLatitude}'} | ${{ iconName: 'utility:topic2', label: 'Outputs from subflowAutomaticOutput > accountOutput > Billing Latitude' }} | ${{ iconName: 'utility:topic2', label: 'Outputs from subflowAutomaticOutput > accountOutput > Billing Latitude' }}
                    ${'{!lookupRecordAutomaticOutput}'}                          | ${'{!lookupRecordAutomaticOutput}'}                          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}                              | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                    ${'{!lookupRecordAutomaticOutput.BillingCity}'}              | ${'{!lookupRecordAutomaticOutput.BillingCity}'}              | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}                  | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}
                    ${'{!feedItemVariable.IsClosed}'}                            | ${'{!$GlobalConstant.False}'}                                | ${{ iconName: 'utility:crossfilter', label: 'feedItemVariable > Is Closed' }}                                      | ${{ iconName: 'utility:crossfilter', label: 'FlowBuilderPill.globalConstantFalse' }}
                    ${'{!feedItemVariable.IsClosed}'}                            | ${'{!$GlobalConstant.True}'}                                 | ${{ iconName: 'utility:crossfilter', label: 'feedItemVariable > Is Closed' }}                                      | ${{ iconName: 'utility:crossfilter', label: 'FlowBuilderPill.globalConstantTrue' }}
                    ${'{!$Flow.CurrentStage}'}                                   | ${'{!$GlobalConstant.EmptyString}'}                          | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.flowCurrentStage' }}                                         | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.globalConstantEmptyString' }}
                `(
                    'LHS Pill should be: $expectedLhsPill for LHS: $lhs, RHS pill should be: $expectedRhsPill for RHS: $rhs',
                    async ({ lhs, rhs, expectedLhsPill, expectedRhsPill }) => {
                        const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                        await typeMergeFieldInCombobox(lhsCombobox, lhs);
                        expect(lhsCombobox.pill).toEqual(expectedLhsPill);
                        const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                        await typeMergeFieldInCombobox(rhsCombobox, rhs);
                        expect(rhsCombobox.pill).toEqual(expectedRhsPill);
                    }
                );
            });
            describe('LHS error', () => {
                describe('RHS emptied', () => {
                    beforeEach(async () => {
                        const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                        await typeReferenceOrValueInCombobox(rhsCombobox, '');
                    });
                    it.each`
                        lhs
                        ${'{!feedItemVariableItDoesNotExistThatsForSure}'}
                        ${'{!apexComplexTypeVariable.acct.BillingCity2}'}
                    `(
                        'LHS (displayText: $lhs) should have no pill as in error state with empty RHS',
                        async ({ lhs }) => {
                            const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                            await typeMergeFieldInCombobox(lhsCombobox, lhs);
                            expect(lhsCombobox.errorMessage).not.toBeNull();
                            expect(lhsCombobox.pill).toBeNull();
                        }
                    );
                });
                describe('RHS kept as it is (incompatible type)', () => {
                    it('should see RHS pill in error after changing LHS value to one incompatible with RHS value', async () => {
                        const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                        expect(lhsCombobox.pill).toBeNull();
                        expect(lhsCombobox.value.displayText).toEqual('{!accountSObjectVariable}');
                        await selectComboboxItemBy(lhsCombobox, 'text', ['dateVariable']);
                        expect(lhsCombobox.value.displayText).toEqual('{!dateVariable}');
                        expect(lhsCombobox.pill).toEqual({ label: 'dateVariable', iconName: 'utility:event' });
                        const rhsCombobox = await getRhsCombobox(expressionBuilder);
                        expect(rhsCombobox.errorMessage).not.toBeNull();
                        expect(rhsCombobox.hasPillError).toBe(true);
                        expect(rhsCombobox.pill).toEqual({
                            label: 'accountSObjectVariable',
                            iconName: 'utility:sobject'
                        });
                        expect(rhsCombobox.pillTooltip).toEqual(
                            expect.stringContaining(rhsCombobox.errorMessage || '')
                        );
                    });
                });
            });
        });
        describe('On selecting and blur (LHS/RHS changes)', () => {
            describe('No error', () => {
                it.each`
                    lhs                                                                    | rhs                                                                    | expectedLhsPill                                                                                                    | expectedRhsPill
                    ${'feedItemVariable'}                                                  | ${'feedItemVariable'}                                                  | ${{ iconName: 'utility:sobject', label: 'feedItemVariable' }}                                                      | ${{ iconName: 'utility:sobject', label: 'feedItemVariable' }}
                    ${'stringVariable'}                                                    | ${'stringVariable'}                                                    | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'stringVariable' }}
                    ${'stringVariable'}                                                    | ${'feedItemVariable.CreatedBy (User).Name'}                            | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'feedItemVariable > Created By ID (User) > Full Name' }}
                    ${'stringVariable'}                                                    | ${'stringConstant'}                                                    | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'stringConstant' }}
                    ${'stringVariable'}                                                    | ${'textTemplate1'}                                                     | ${{ iconName: 'utility:text', label: 'stringVariable' }}                                                           | ${{ iconName: 'utility:text', label: 'textTemplate1' }}
                    ${'dateVariable'}                                                      | ${'dateVariable'}                                                      | ${{ iconName: 'utility:event', label: 'dateVariable' }}                                                            | ${{ iconName: 'utility:event', label: 'dateVariable' }}
                    ${'numberVariable'}                                                    | ${'numberVariable'}                                                    | ${{ iconName: 'utility:topic2', label: 'numberVariable' }}                                                         | ${{ iconName: 'utility:topic2', label: 'numberVariable' }}
                    ${'currencyVariable'}                                                  | ${'currencyVariable'}                                                  | ${{ iconName: 'utility:currency', label: 'currencyVariable' }}                                                     | ${{ iconName: 'utility:currency', label: 'currencyVariable' }}
                    ${'Outputs from apexCall_Car_automatic_output.car'}                    | ${'Outputs from apexCall_Car_automatic_output.car'}                    | ${{ iconName: 'utility:apex', label: 'Outputs from apexCall_Car_automatic_output > car' }}                         | ${{ iconName: 'utility:apex', label: 'Outputs from apexCall_Car_automatic_output > car' }}
                    ${'Outputs from subflowAutomaticOutput.accountOutput'}                 | ${'Outputs from subflowAutomaticOutput.accountOutput'}                 | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}                   | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                    ${'Outputs from subflowAutomaticOutput.accountOutput.BillingLatitude'} | ${'Outputs from subflowAutomaticOutput.accountOutput.BillingLatitude'} | ${{ iconName: 'utility:topic2', label: 'Outputs from subflowAutomaticOutput > accountOutput > Billing Latitude' }} | ${{ iconName: 'utility:topic2', label: 'Outputs from subflowAutomaticOutput > accountOutput > Billing Latitude' }}
                    ${'accountSObjectVariable'}                                            | ${'accountSObjectVariable'}                                            | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}                                                | ${{ iconName: 'utility:sobject', label: 'accountSObjectVariable' }}
                    ${'accountSObjectVariable.BillingCity'}                                | ${'accountSObjectVariable.BillingCity'}                                | ${{ iconName: 'utility:text', label: 'accountSObjectVariable > Billing City' }}                                    | ${{ iconName: 'utility:text', label: 'accountSObjectVariable > Billing City' }}
                    ${'Account from lookupRecordAutomaticOutput'}                          | ${'Account from lookupRecordAutomaticOutput'}                          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}                              | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                    ${'Account from lookupRecordAutomaticOutput.BillingCity'}              | ${'Account from lookupRecordAutomaticOutput.BillingCity'}              | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}                  | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}
                    ${'apexComplexTypeVariable.acct'}                                      | ${'apexComplexTypeVariable.acct'}                                      | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}                                        | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                    ${'apexComplexTypeVariable.acct.BillingCity'}                          | ${'apexComplexTypeVariable.acct.BillingCity'}                          | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > acct > Billing City' }}                            | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > acct > Billing City' }}
                    ${'feedItemVariable.IsClosed'}                                         | ${'feedItemVariable.IsClosed'}                                         | ${{ iconName: 'utility:crossfilter', label: 'feedItemVariable > Is Closed' }}                                      | ${{ iconName: 'utility:crossfilter', label: 'feedItemVariable > Is Closed' }}
                    ${'$Flow.CurrentStage'}                                                | ${'$Flow.CurrentStage'}                                                | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.flowCurrentStage' }}                                         | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.flowCurrentStage' }}
                `(
                    'LHS Pill should be: $expectedLhsPill for LHS: $lhs , RHS pill should be: $expectedRhsPill for RHS: $rhs',
                    async ({ lhs, rhs, expectedLhsPill, expectedRhsPill }) => {
                        const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                        await selectComboboxItemBy(lhsCombobox, 'text', lhs.split('.'));
                        expect(lhsCombobox.pill).toEqual(expectedLhsPill);
                        const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                        await selectComboboxItemBy(rhsCombobox, 'text', rhs.split('.'));
                        expect(rhsCombobox.pill).toEqual(expectedRhsPill);
                    }
                );
                it.each`
                    lhs                   | rhs                                | expectedLhsPill                                          | expectedRhsPill
                    ${['stringVariable']} | ${['$GlobalConstant.True']}        | ${{ iconName: 'utility:text', label: 'stringVariable' }} | ${{ iconName: 'utility:crossfilter', label: 'FlowBuilderPill.globalConstantTrue' }}
                    ${['stringVariable']} | ${['$GlobalConstant.False']}       | ${{ iconName: 'utility:text', label: 'stringVariable' }} | ${{ iconName: 'utility:crossfilter', label: 'FlowBuilderPill.globalConstantFalse' }}
                    ${['stringVariable']} | ${['$GlobalConstant.EmptyString']} | ${{ iconName: 'utility:text', label: 'stringVariable' }} | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.globalConstantEmptyString' }}
                `(
                    'RHS Global constants - LHS Pill should be: $expectedLhsPill for LHS: $lhs, RHS pill should be: $expectedRhsPill for RHS: $rhs',
                    async ({ lhs, rhs, expectedLhsPill, expectedRhsPill }) => {
                        const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                        await selectComboboxItemBy(lhsCombobox, 'text', lhs);
                        expect(lhsCombobox.pill).toEqual(expectedLhsPill);
                        const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                        await selectComboboxItemBy(rhsCombobox, 'text', rhs);
                        expect(rhsCombobox.pill).toEqual(expectedRhsPill);
                    }
                );
            });
            describe('Error', () => {
                // W-7714259
                it('Lhs on error selecting invalid "$flow" entry', async () => {
                    const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                    await selectComboboxItemBy(lhsCombobox, 'text', ['$Flow']);
                    expect(lhsCombobox.errorMessage).toEqual(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.MERGE_FIELD_NOT_VALID
                    );
                    expect(lhsCombobox.pill).toBeNull();
                    await typeReferenceOrValueInCombobox(lhsCombobox, '');
                    await selectComboboxItemBy(lhsCombobox, 'text', ['$Flow']);
                    expect(lhsCombobox.errorMessage).toEqual(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.MERGE_FIELD_NOT_VALID
                    );
                    expect(lhsCombobox.pill).toBeNull();
                });
            });
        });
    });
});
