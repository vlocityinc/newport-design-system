import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { ExpressionBuilderComponentTest, getExpressionTester } from '../expressionBuilderTestUtils';
import { createComponentForTest, getFerToFerovExpressionBuilder } from './decisionEditorTestUtils';
import { resetState, setupStateForFlow, FLOW_BUILDER_VALIDATION_ERROR_MESSAGES } from '../integrationTestUtils';

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
    let expressionBuilder: ExpressionBuilderComponentTest;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
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
        const testExpression = getExpressionTester(() => expressionBuilder.element);
        // eslint-disable-next-line no-unused-expressions
        testExpression.each`
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
        `;
        it('can select account field of apex type', async () => {
            // Given
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);

            // When
            const selectedItem = await lhsCombobox.selectItemBy('text', ['apexComplexTypeVariable', 'acct'], {
                blur: true
            });

            // Then
            expect(selectedItem).toBeDefined();
            expect(lhsCombobox.element.errorMessage).toBeNull();
        });
        it('can only select WasVisited on loop with manual output', async () => {
            // Given
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
            await lhsCombobox.typeReferenceOrValue('{!loopOnTextCollection}');

            // When
            const operators = expressionBuilder.getOperatorComboboxElement().options;

            // Then
            expect(operators).toHaveLength(1);
            expect(operators[0].value).toContain('WasVisited');
        });
        it('Operator and RHS disabled (without pill) when LHS value is emptied (LHS was initially in pill mode)', async () => {
            const lhsCombobox = await expressionBuilder.getLhsCombobox();
            expect(lhsCombobox.element.pill).not.toBeNull();
            await lhsCombobox.typeReferenceOrValue('', true);
            const operatorCombobox = expressionBuilder.getOperatorComboboxElement();
            expect(operatorCombobox.disabled).toBe(true);
            const rhsCombobox = await expressionBuilder.getRhsCombobox();
            expect(rhsCombobox.element.pill).toBeNull();
            expect(rhsCombobox.element.disabled).toBe(true);
        });
        it('Operator and RHS disabled (without pill) when LHS pill removed)', async () => {
            const lhsCombobox = await expressionBuilder.getLhsCombobox();
            expect(lhsCombobox.element.pill).not.toBeNull();
            await lhsCombobox.removePill();
            const operatorCombobox = expressionBuilder.getOperatorComboboxElement();
            expect(operatorCombobox.disabled).toBe(true);
            const rhsCombobox = await expressionBuilder.getRhsCombobox();
            expect(rhsCombobox.element.pill).toBeNull();
            expect(rhsCombobox.element.disabled).toBe(true);
        });
    });
    describe('pill', () => {
        describe('pill in error?', () => {
            describe('RHS change', () => {
                it('should  not display RHS pill in error after changing RHS value to one incompatible with LHS value', async () => {
                    const lhsCombobox = await expressionBuilder.getLhsCombobox();
                    expect(lhsCombobox.element.value.displayText).toEqual('{!accountSObjectVariable}');
                    expect(lhsCombobox.element.pill).toEqual({
                        label: 'accountSObjectVariable',
                        iconName: 'utility:sobject'
                    });
                    const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                    await rhsCombobox.typeMergeField('{!feedItemVariable}');
                    expect(rhsCombobox.element.errorMessage).not.toBeNull();
                    expect(rhsCombobox.element.pill).toBeNull();
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
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        await lhsCombobox.typeMergeField(lhs);
                        expect(lhsCombobox.element.pill).toEqual(expectedLhsPill);
                        const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                        await rhsCombobox.typeMergeField(rhs);
                        expect(rhsCombobox.element.pill).toEqual(expectedRhsPill);
                    }
                );
            });
            describe('LHS error', () => {
                describe('RHS emptied', () => {
                    beforeEach(async () => {
                        const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                        await rhsCombobox.typeReferenceOrValue('');
                    });
                    it.each`
                        lhs
                        ${'{!feedItemVariableItDoesNotExistThatsForSure}'}
                        ${'{!apexComplexTypeVariable.acct.BillingCity2}'}
                    `(
                        'LHS (displayText: $lhs) should have no pill as in error state with empty RHS',
                        async ({ lhs }) => {
                            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                            await lhsCombobox.typeMergeField(lhs);
                            expect(lhsCombobox.element.errorMessage).not.toBeNull();
                            expect(lhsCombobox.element.pill).toBeNull();
                        }
                    );
                });
                describe('RHS kept as it is (incompatible type)', () => {
                    it('should see RHS pill in error after changing LHS value to one incompatible with RHS value', async () => {
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        expect(lhsCombobox.element.pill).toBeNull();
                        expect(lhsCombobox.element.value.displayText).toEqual('{!accountSObjectVariable}');
                        await lhsCombobox.selectItemBy('text', ['dateVariable']);
                        expect(lhsCombobox.element.value.displayText).toEqual('{!dateVariable}');
                        expect(lhsCombobox.element.pill).toEqual({ label: 'dateVariable', iconName: 'utility:event' });
                        const rhsCombobox = await expressionBuilder.getRhsCombobox();
                        expect(rhsCombobox.element.errorMessage).not.toBeNull();
                        expect(rhsCombobox.element.hasPillError).toBe(true);
                        expect(rhsCombobox.element.pill).toEqual({
                            label: 'accountSObjectVariable',
                            iconName: 'utility:sobject'
                        });
                        expect(rhsCombobox.element.pillTooltip).toEqual(
                            expect.stringContaining(rhsCombobox.element.errorMessage || '')
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
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        await lhsCombobox.selectItemBy('text', lhs.split('.'));
                        expect(lhsCombobox.element.pill).toEqual(expectedLhsPill);
                        const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                        await rhsCombobox.selectItemBy('text', rhs.split('.'));
                        expect(rhsCombobox.element.pill).toEqual(expectedRhsPill);
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
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        await lhsCombobox.selectItemBy('text', lhs);
                        expect(lhsCombobox.element.pill).toEqual(expectedLhsPill);
                        const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                        await rhsCombobox.selectItemBy('text', rhs);
                        expect(rhsCombobox.element.pill).toEqual(expectedRhsPill);
                    }
                );
            });
            describe('Error', () => {
                // W-7714259
                it('Lhs on error selecting invalid "$flow" entry', async () => {
                    const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                    await lhsCombobox.selectItemBy('text', ['$Flow']);
                    expect(lhsCombobox.element.errorMessage).toEqual(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.MERGE_FIELD_NOT_VALID
                    );
                    expect(lhsCombobox.element.pill).toBeNull();
                    await lhsCombobox.typeReferenceOrValue('');
                    await lhsCombobox.selectItemBy('text', ['$Flow']);
                    expect(lhsCombobox.element.errorMessage).toEqual(
                        FLOW_BUILDER_VALIDATION_ERROR_MESSAGES.MERGE_FIELD_NOT_VALID
                    );
                    expect(lhsCombobox.element.pill).toBeNull();
                });
            });
        });
    });
});
describe('Decision Editor expression builder for record triggered flow', () => {
    let expressionBuilder: ExpressionBuilderComponentTest;
    beforeAll(async () => {
        await setupStateForFlow(recordTriggeredFlow);
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
        const testExpression = getExpressionTester(() => expressionBuilder.element);
        // eslint-disable-next-line no-unused-expressions
        testExpression.each`
            lhs                                                          | operator         | rhs                            | rhsErrorMessage
            ${'{!$Record__Prior.BillingLatitude}'}                       | ${'EqualTo'}     | ${'500.0'}                     | ${undefined}
            ${'{!$Record__Prior.BillingLatitude}'}                       | ${'EqualTo'}     | ${'my string'}                 | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!$Record.Name}'}                                         | ${'EqualTo'}     | ${'{!$Record__Prior.Name}'}    | ${undefined}
        `;
    });
});
