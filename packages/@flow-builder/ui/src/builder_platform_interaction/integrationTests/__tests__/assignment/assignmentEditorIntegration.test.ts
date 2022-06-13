import { updateElement } from 'builder_platform_interaction/actions';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    removeEvent,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { createStartElementForPropertyEditor, createVariable } from 'builder_platform_interaction/elementFactory';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getElementByDevName, getStartElement } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as recordTriggeredFlow from 'mock/flows/recordTriggeredFlow.json';
import { ComboboxTestComponent } from '../comboboxTestUtils';
import { ExpressionBuilderComponentTest, getExpressionTester } from '../expressionBuilderTestUtils';
import { FLOW_BUILDER_VALIDATION_ERROR_MESSAGES, resetState, setupStateForFlow } from '../integrationTestUtils';
import {
    addNewResourceEventListener,
    removeNewResourceEventListener,
    setNextInlineResource
} from '../resourceTestUtils';

jest.mock('@salesforce/label/FlowBuilderElementLabels.actionAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel', () => ({ default: 'New Resource' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderElementConfig.variablePluralLabel', () => ({ default: 'Variables' }), {
    virtual: true
});
jest.mock(
    '@salesforce/label/FlowBuilderElementConfig.sObjectPluralLabel',
    () => ({ default: 'Record (Single) Variables' }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementConfig.apexVariablePluralLabel',
    () => ({ default: 'Apex-Defined Variables' }),
    { virtual: true }
);

jest.mock('@salesforce/label/FlowBuilderElementConfig.subflowPluralLabel', () => ({ default: 'Subflows' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderElementConfig.actionPluralLabel', () => ({ default: 'Actions' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderDataTypes.textDataTypeLabel', () => ({ default: 'Text' }), { virtual: true });

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordCreateIdAsResourceText',
    () => ({ default: '{0}Id from {1}' }),
    { virtual: true }
);

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText',
    () => ({ default: '{0} from {1}' }),
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.loopAsResourceText',
    () => {
        return { default: 'Current Item from Loop {0}' };
    },
    { virtual: true }
);
jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.lightningComponentScreenFieldAsResourceText',
    () => {
        return { default: '{0}' };
    },
    { virtual: true }
);

const createComponentForTest = (assignmentElement) => {
    const el = createElement('builder_platform_interaction-assignment-editor', {
        is: AssignmentEditor
    });
    Object.assign(el, { node: assignmentElement });
    setDocumentBodyChildren(el);
    return el;
};

const getFerToFerovExpressionBuilder = (assignment) =>
    new ExpressionBuilderComponentTest(
        deepQuerySelector(assignment, [INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER])
    );

describe('Assignment Editor', () => {
    let assignment, assignmentForPropertyEditor;
    let expressionBuilder: ExpressionBuilderComponentTest;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
        const assignmentElement = getElementByDevName('assignment1');
        assignmentForPropertyEditor = getElementForPropertyEditor(assignmentElement);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(() => {
        assignment = createComponentForTest(assignmentForPropertyEditor);
        expressionBuilder = getFerToFerovExpressionBuilder(assignment);
    });
    describe('Validation', () => {
        const testExpression = getExpressionTester(() => expressionBuilder.element);
        describe('When LHS is a picklist', () => {
            // eslint-disable-next-line no-unused-expressions
            testExpression.each`
            lhs                                            | operator    | rhs                                                     | rhsErrorMessage
            ${'{!accountSObjectVariable.AccountSource}'}   | ${'Assign'} | ${'Advertisement'}                                      | ${undefined}
            ${'{!accountSObjectVariable.AccountSource}'}   | ${'Assign'} | ${'NotAPicklistValue'}                                  | ${undefined}
            `;
        });
        describe('When LHS is a number', () => {
            // eslint-disable-next-line no-unused-expressions
            testExpression.each`
            lhs                                            | operator    | rhs                                                     | rhsErrorMessage
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'500.0'}                                              | ${undefined}
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'not a number'}                                       | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Add'}    | ${'{!accountSObjectVariable.Name}'}                     | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            `;
        });
        describe('cross-object field references', () => {
            it('does not allow a merge field with more than 10 levels', async () => {
                const lhs = '{!stringVariable}';
                const operator = 'Assign';
                const rhs =
                    '{!accountSObjectVariable.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.Name}';
                expect(
                    await expressionBuilder.validateExpression({
                        lhs,
                        operator,
                        rhs
                    })
                ).toEqual({
                    rhsErrorMessage: 'FlowBuilderMergeFieldValidation.maximumNumberOfLevelsReached'
                });
            });
            it('does allow a merge field with 9 levels', async () => {
                const lhs = '{!stringVariable}';
                const operator = 'Assign';
                const rhs =
                    '{!accountSObjectVariable.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.Name}';
                expect(
                    await expressionBuilder.validateExpression({
                        lhs,
                        operator,
                        rhs
                    })
                ).toEqual({});
            });
            describe('When rhs is a cross-Object Field Reference using Polymorphic Relationships', () => {
                // eslint-disable-next-line no-unused-expressions
                testExpression.each`
                lhs                                            | operator    | rhs                                                     | rhsErrorMessage
                ${'{!numberVariable}'}                         | ${'Assign'} | ${'{!feedItemVariable.Parent:Account.BillingLatitude}'} | ${undefined}
                ${'{!numberVariable}'}                         | ${'Assign'} | ${'{!feedItemVariable.Parent:Account.Name}'}            | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                `;
            });
            describe('Operator reset when changing LHS value if new value does not support previous operator', () => {
                let lhsCombobox: ComboboxTestComponent;
                beforeEach(async () => {
                    lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                });
                function isOperatorReset(originalOperator) {
                    return expressionBuilder.getOperatorComboboxElement().value !== originalOperator;
                }
                it.each`
                    originalLhs                                    | originalOperator | newLhs                                          | resetOperator
                    ${'{!numberVariable}'}                         | ${'Subtract'}    | ${'{!accountSObjectVariable.BillingLongitude}'} | ${false}
                    ${'{!numberVariable}'}                         | ${'Add'}         | ${'{!stringVariable}'}                          | ${false}
                    ${'{!numberVariable}'}                         | ${'Subtract'}    | ${'{!stringVariable}'}                          | ${true}
                    ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Add'}         | ${'{!accountSObjectVariable.BillingLongitude}'} | ${false}
                    ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Subtract'}    | ${'{!numberVariable}'}                          | ${false}
                    ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Subtract'}    | ${'{!accountSObjectVariable.Name}'}             | ${true}
                    ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Subtract'}    | ${'{!accountSObjectVariable.Name}'}             | ${true}
                    ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Subtract'}    | ${'{!accountSObjectVariable}'}                  | ${true}
                `(
                    'Should reset operator when switching LHS from $originalLhs to $newLhs: $resetOperator',
                    async ({ originalLhs, originalOperator, newLhs, resetOperator }) => {
                        await lhsCombobox.typeReferenceOrValue(originalLhs, true);
                        expect(expressionBuilder.selectOperator(originalOperator)).toBe(true);
                        await lhsCombobox.typeReferenceOrValue(newLhs, true);

                        expect(isOperatorReset(originalOperator)).toBe(resetOperator);
                    }
                );
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
                const pillCombobox = lhsCombobox.getPillElement();
                pillCombobox.dispatchEvent(removeEvent());
                await ticks(1);
                const operatorCombobox = expressionBuilder.getOperatorComboboxElement();
                expect(operatorCombobox.disabled).toBe(true);
                const rhsCombobox = await expressionBuilder.getRhsCombobox();
                expect(rhsCombobox.element.pill).toBeNull();
                expect(rhsCombobox.element.disabled).toBe(true);
            });
        });
        describe('When using Apex types on LHS or RHS', () => {
            // eslint-disable-next-line no-unused-expressions
            testExpression.each`
            lhs                                             | operator    | rhs                                                     | rhsErrorMessage
            ${'{!apexCall_Car_automatic_output.car}'}       | ${'Assign'} | ${'{!apexCarVariable}'}                                 | ${undefined}
            ${'{!stringVariable}'}                          | ${'Assign'} | ${'{!apexCarVariable.wheel.type}'}                      | ${undefined}
            ${'{!apexComplexTypeVariable}'}                 | ${'Assign'} | ${'{!apexComplexTypeVariable}'}                         | ${undefined}
            ${'{!apexComplexTypeVariable.acct}'}            | ${'Assign'} | ${'{!apexComplexTypeVariable}'}                         | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!apexComplexTypeVariable.acct}'}            | ${'Assign'} | ${'{!accountSObjectVariable}'}                          | ${undefined}
            ${'{!accountSObjectVariable}'}                  | ${'Assign'} | ${'{!apexComplexTypeVariable.acct}'}                    | ${undefined}
            ${'{!accountSObjectVariable}'}                  | ${'Assign'} | ${'{!apexComplexTypeVariable.doesNotExist}'}            | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
            `;
            it('can traverse more than 2 levels in the LHS', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                expect(await lhsCombobox.selectItemBy('text', ['apexCarVariable', 'wheel'])).toMatchObject({
                    displayText: '{!apexCarVariable.wheel}'
                });
                await lhsCombobox.clickPill();
                expect(await lhsCombobox.selectItemBy('text', ['apexCarVariable', 'wheel', 'type'])).toMatchObject({
                    displayText: '{!apexCarVariable.wheel.type}'
                });
            });
            it('can traverse SObject in the Apex types', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                expect(
                    await lhsCombobox.selectItemBy('text', ['apexComplexTypeVariable', 'acct', 'AccountSource'])
                ).toMatchObject({
                    displayText: '{!apexComplexTypeVariable.acct.AccountSource}'
                });
            });
            it('cannot traverse more than one level of an SObject in the Apex types', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                expect(
                    await lhsCombobox.selectItemBy('text', ['apexComplexTypeVariable', 'acct', 'CreatedBy'])
                ).toBeUndefined();
            });
        });
        describe('Automatic handling mode', () => {
            // eslint-disable-next-line no-unused-expressions
            testExpression.each`
            lhs                                                | operator    | rhs                                                                                    | rhsErrorMessage
            ${'{!stringVariable}'}                             | ${'Assign'} | ${'{!apexCall_account_automatic_output.generatedAccount.LastModifiedBy.Account.Name}'} | ${undefined}
            ${'{!numberVariable}'}                             | ${'Assign'} | ${'{!apexCall_account_automatic_output.generatedAccount.LastModifiedBy.Account.Name}'} | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!stringVariable}'}                             | ${'Assign'} | ${'{!lookupRecordAutomaticOutput.LastModifiedBy.Account.Name}'}                        | ${undefined}
            ${'{!numberVariable}'}                             | ${'Assign'} | ${'{!lookupRecordAutomaticOutput.LastModifiedBy.Account.Name}'}                        | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!emailScreenFieldAutomaticOutput.disabled}'}   | ${'Assign'} | ${'{!$GlobalConstant.True}'}                                                           | ${undefined}
            ${'{!emailScreenFieldAutomaticOutput.disabled}'}   | ${'Assign'} | ${'myString'}                                                                          | ${'FlowBuilderCombobox.genericErrorMessage'}
            ${'{!stringVariable}'}                             | ${'Assign'} | ${'{!createAccountWithAutomaticOutput}'}                                               | ${undefined}
            ${'{!numberVariable}'}                             | ${'Assign'} | ${'{!createAccountWithAutomaticOutput}'}                                               | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!subflowAutomaticOutput.output1}'}             | ${'Assign'} | ${'myString'}                                                                          | ${undefined}
            ${'{!subflowAutomaticOutput.carOutput.wheel.type}'}| ${'Assign'} | ${'myString'}                                                                          | ${undefined}
            ${'{!numberVariable}'}                             | ${'Assign'} | ${'{!subflowAutomaticOutput.accountOutput.BillingLatitude}'}                           | ${undefined}
            ${'{!numberVariable}'}                             | ${'Assign'} | ${'{!subflowAutomaticOutput.accountOutput.Name}'}                                      | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            `;
        });
        describe('$Record__Prior is not available for screen flows', () => {
            // eslint-disable-next-line no-unused-expressions
            testExpression.each`
            lhs                                             | operator    | rhs                                    | rhsErrorMessage
            ${'{!accountSObjectVariable}'}                  | ${'Assign'} | ${'{!$Record__Prior}'}                 | ${'FlowBuilderCombobox.genericErrorMessage'}
            ${'{!stringVariable}'}                          | ${'Assign'} | ${'{!$Record__Prior.Name}'}            | ${'FlowBuilderMergeFieldValidation.unknownResource'}
            `;
        });
    });
    describe('Inline Resource creation', () => {
        beforeEach(async () => {
            addNewResourceEventListener();
        });
        afterEach(() => {
            removeNewResourceEventListener();
        });
        it('autofills the combobox', async () => {
            const inlineVariable = createVariable({
                name: 'myInlineTextVar',
                dataType: 'String'
            });
            setNextInlineResource(inlineVariable);
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
            await lhsCombobox.selectItemBy('text', ['New Resource']);
            await ticks(50);
            expect(lhsCombobox.element.value).toMatchObject({
                dataType: 'String',
                displayText: '{!myInlineTextVar}'
            });
        });
    });
    describe('Traversal', () => {
        it('is limited to 10 levels', async () => {
            // Given
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
            const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
            await lhsCombobox.typeMergeField('{!stringVariable}');
            expressionBuilder.selectOperator('Assign');

            // When
            const comboboxItem = await rhsCombobox.selectItemBy(
                'text',
                [
                    'accountSObjectVariable',
                    'LastModifiedBy',
                    'CreatedBy',
                    'LastModifiedBy',
                    'CreatedBy',
                    'LastModifiedBy',
                    'CreatedBy',
                    'LastModifiedBy',
                    'CreatedBy'
                ],
                { blur: false }
            );

            // Then
            expect(comboboxItem.hasNext).toBe(true);
            for (const item of rhsCombobox.getItems()) {
                expect(item.hasNext).toBeUndefined();
            }
        });
        it.each`
            lhs                                           | expectedErrorMessage
            ${'{!apexComplexTypeVariable.acct}'}          | ${null}
            ${'{!apexComplexTypeVariable.doesNotExist}'}  | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
            ${'{!apexComplexTypeVariable.doesNotExist.}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
        `('error for "$lhs should be : $expectedErrorMessage', async ({ lhs, expectedErrorMessage }) => {
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
            await lhsCombobox.typeReferenceOrValue(lhs);
            expect(lhsCombobox.element.errorMessage).toEqual(expectedErrorMessage);
        });
    });
    describe('pill', () => {
        describe('pill in error?', () => {
            describe('RHS change', () => {
                it('should  not display RHS pill in error after changing RHS value to one incompatible with LHS value', async () => {
                    const lhsCombobox = await expressionBuilder.getLhsCombobox();
                    expect(lhsCombobox.element.value.displayText).toEqual('{!stringVariable}');
                    expect(lhsCombobox.element.pill).toEqual({ label: 'stringVariable', iconName: 'utility:text' });
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
                    ${'{!feedItemVariable.IsClosed}'}                            | ${'{!feedItemVariable.IsClosed}'}                            | ${{ iconName: 'utility:toggle', label: 'feedItemVariable > Is Closed' }}                                           | ${{ iconName: 'utility:toggle', label: 'feedItemVariable > Is Closed' }}
                    ${'{!apexComplexTypeVariable.acct}'}                         | ${'{!apexComplexTypeVariable.acct}'}                         | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}                                        | ${{ iconName: 'utility:sobject', label: 'apexComplexTypeVariable > acct' }}
                    ${'{!apexComplexTypeVariable.acct.BillingCity}'}             | ${'{!apexComplexTypeVariable.acct.BillingCity}'}             | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > acct > Billing City' }}                            | ${{ iconName: 'utility:text', label: 'apexComplexTypeVariable > acct > Billing City' }}
                    ${'{!emailScreenFieldAutomaticOutput.readonly}'}             | ${'{!emailScreenFieldAutomaticOutput.readonly}'}             | ${{ iconName: 'utility:toggle', label: 'emailScreenFieldAutomaticOutput > Read Only' }}                            | ${{ iconName: 'utility:toggle', label: 'emailScreenFieldAutomaticOutput > Read Only' }}
                    ${'{!apexCall_Car_automatic_output.car}'}                    | ${'{!apexCall_Car_automatic_output.car}'}                    | ${{ iconName: 'utility:apex', label: 'Outputs from apexCall_Car_automatic_output > car' }}                         | ${{ iconName: 'utility:apex', label: 'Outputs from apexCall_Car_automatic_output > car' }}
                    ${'{!subflowAutomaticOutput.accountOutput}'}                 | ${'{!subflowAutomaticOutput.accountOutput}'}                 | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}                   | ${{ iconName: 'utility:sobject', label: 'Outputs from subflowAutomaticOutput > accountOutput' }}
                    ${'{!subflowAutomaticOutput.accountOutput.BillingLatitude}'} | ${'{!subflowAutomaticOutput.accountOutput.BillingLatitude}'} | ${{ iconName: 'utility:topic2', label: 'Outputs from subflowAutomaticOutput > accountOutput > Billing Latitude' }} | ${{ iconName: 'utility:topic2', label: 'Outputs from subflowAutomaticOutput > accountOutput > Billing Latitude' }}
                    ${'{!lookupRecordAutomaticOutput}'}                          | ${'{!lookupRecordAutomaticOutput}'}                          | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}                              | ${{ iconName: 'utility:sobject', label: 'Account from lookupRecordAutomaticOutput' }}
                    ${'{!lookupRecordAutomaticOutput.BillingCity}'}              | ${'{!lookupRecordAutomaticOutput.BillingCity}'}              | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}                  | ${{ iconName: 'utility:text', label: 'Account from lookupRecordAutomaticOutput > Billing City' }}
                    ${'{!feedItemVariable.IsClosed}'}                            | ${'$GlobalConstant.False'}                                   | ${{ iconName: 'utility:toggle', label: 'feedItemVariable > Is Closed' }}                                           | ${{ iconName: 'utility:toggle', label: 'FlowBuilderPill.globalConstantFalse' }}
                    ${'{!feedItemVariable.IsClosed}'}                            | ${'$GlobalConstant.True'}                                    | ${{ iconName: 'utility:toggle', label: 'feedItemVariable > Is Closed' }}                                           | ${{ iconName: 'utility:toggle', label: 'FlowBuilderPill.globalConstantTrue' }}
                    ${'$Flow.CurrentStage'}                                      | ${'$GlobalConstant.EmptyString'}                             | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.flowCurrentStage' }}                                         | ${{ iconName: 'utility:text', label: 'FlowBuilderPill.globalConstantEmptyString' }}
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
                        ${'{!feedItemVariable.CreatedBy:User.Name}'}
                        ${'{!apexComplexTypeVariable.acct.BillingCity2}'}
                    `('LHS should have no pill as in error state with empty RHS', async ({ lhs }) => {
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        await lhsCombobox.typeMergeField(lhs);
                        expect(lhsCombobox.element.errorMessage).not.toBeNull();
                        expect(lhsCombobox.element.pill).toBeNull();
                    });
                });
                describe('RHS kept as it is (incompatible type)', () => {
                    it('should see RHS pill in error after changing LHS value to one incompatible with RHS value', async () => {
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        expect(lhsCombobox.element.pill).toBeNull();
                        expect(lhsCombobox.element.value.displayText).toEqual('{!stringVariable}');
                        await lhsCombobox.selectItemBy('text', ['feedItemVariable']);
                        expect(lhsCombobox.element.value.displayText).toEqual('{!feedItemVariable}');
                        expect(lhsCombobox.element.pill).toEqual({
                            label: 'feedItemVariable',
                            iconName: 'utility:sobject'
                        });
                        const rhsCombobox = await expressionBuilder.getRhsCombobox();
                        expect(rhsCombobox.element.errorMessage).not.toBeNull();
                        expect(rhsCombobox.element.hasPillError).toBe(true);
                        expect(rhsCombobox.element.pill).toEqual({
                            label: 'numberVariable',
                            iconName: 'utility:topic2'
                        });
                        expect(rhsCombobox.element.pillTooltip).toEqual(
                            expect.stringContaining(rhsCombobox.element.errorMessage || '')
                        );
                    });
                });
            });
            describe('RHS error', () => {
                beforeEach(async () => {
                    const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                    await lhsCombobox.typeMergeField('{!dateVariable}');
                });
                it.each`
                    rhs
                    ${'{!feedItemVariable}'}
                    ${'{!feedItemVariableItDoesNotExistThatsForSure}'}
                    ${'{!feedItemVariable.CreatedBy:User.Name}'}
                    ${'{!feedItemVariable.IsClosed}'}
                    ${'{!apexComplexTypeVariable.acct}'}
                    ${'{!apexComplexTypeVariable.acct.BillingCity}'}
                    ${'{!accountSObjectVariable}'}
                `(
                    'RHS should have no pill as in error state for RHS: $rhs and LHS (with incompatible type): {!dateVariable}',
                    async ({ rhs }) => {
                        const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                        await rhsCombobox.typeMergeField(rhs);
                        expect(rhsCombobox.element.errorMessage).not.toBeNull();
                        expect(rhsCombobox.element.pill).toBeNull();
                    }
                );
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
                    ${'feedItemVariable.IsClosed'}                                         | ${'feedItemVariable.IsClosed'}                                         | ${{ iconName: 'utility:toggle', label: 'feedItemVariable > Is Closed' }}                                           | ${{ iconName: 'utility:toggle', label: 'feedItemVariable > Is Closed' }}
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
                    ${['stringVariable']} | ${['$GlobalConstant.True']}        | ${{ iconName: 'utility:text', label: 'stringVariable' }} | ${{ iconName: 'utility:toggle', label: 'FlowBuilderPill.globalConstantTrue' }}
                    ${['stringVariable']} | ${['$GlobalConstant.False']}       | ${{ iconName: 'utility:text', label: 'stringVariable' }} | ${{ iconName: 'utility:toggle', label: 'FlowBuilderPill.globalConstantFalse' }}
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
    describe('Selection using comboboxes', () => {
        const itCanSelectInLhs = (lhs, expectedItem = {}) =>
            it(`can select [${lhs}] on lhs`, async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                await expect(lhsCombobox).canSelectInCombobox('text', lhs);
                expect(lhsCombobox.element.value).toMatchObject(expectedItem);
            });
        const itCanSelectInRhs = (rhs, expectedItem = {}) =>
            it(`can select [${rhs}] on rhs`, async () => {
                const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                await expect(rhsCombobox).canSelectInCombobox('text', rhs);
                expect(rhsCombobox.element.value).toMatchObject(expectedItem);
            });
        describe('groups', () => {
            it.each`
                item                                                 | group
                ${'apexComplexTypeVariable'}                         | ${'APEX-DEFINED VARIABLES'}
                ${'Outputs from subflowAutomaticOutput'}             | ${'SUBFLOWS'}
                ${'Outputs from apexCall_Car_automatic_output'}      | ${'ACTIONS'}
                ${'AccountId from createAccountWithAutomaticOutput'} | ${'VARIABLES'}
                ${'Account from lookupRecordAutomaticOutput'}        | ${'RECORD (SINGLE) VARIABLES'}
            `('$item should be in group $group', async ({ item, group }) => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                const groupLabel = lhsCombobox.getGroupLabel('text', item);
                expect(groupLabel).toEqual(group);
            });
        });
        describe('apex variables', () => {
            itCanSelectInLhs(['apexComplexTypeVariable', 'acct'], {
                iconName: 'utility:sobject',
                displayText: '{!apexComplexTypeVariable.acct}'
            });
            itCanSelectInLhs(['apexComplexTypeVariable', 'acct', 'Name'], {
                displayText: '{!apexComplexTypeVariable.acct.Name}'
            });
        });
        describe('lookup records automatic output', () => {
            itCanSelectInLhs(['Account from lookupRecordAutomaticOutput'], {
                iconName: 'utility:sobject',
                displayText: '{!lookupRecordAutomaticOutput}'
            });
            itCanSelectInLhs(['Account from lookupRecordAutomaticOutput', 'Name'], {
                displayText: '{!lookupRecordAutomaticOutput.Name}'
            });
            itCanSelectInRhs(['Account from lookupRecordAutomaticOutput', 'Name'], {
                displayText: '{!lookupRecordAutomaticOutput.Name}'
            });
        });
        describe('create records automatic output', () => {
            itCanSelectInLhs(['AccountId from createAccountWithAutomaticOutput'], {
                iconName: 'utility:text',
                subTextNoHighlight: 'Text',
                displayText: '{!createAccountWithAutomaticOutput}'
            });
            itCanSelectInRhs(['AccountId from createAccountWithAutomaticOutput'], {
                iconName: 'utility:text',
                subTextNoHighlight: 'Text',
                displayText: '{!createAccountWithAutomaticOutput}'
            });
        });
        describe('action automatic output', () => {
            itCanSelectInLhs(['Outputs from apexCall_Car_automatic_output', 'car'], {
                iconName: 'utility:apex',
                displayText: '{!apexCall_Car_automatic_output.car}'
            });
        });
        describe('subflow automatic output', () => {
            it('The items in the combobox are the output variables from the active version', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                await lhsCombobox.selectItemBy('text', ['Outputs from subflowAutomaticOutput'], {
                    blur: false
                });
                expect(lhsCombobox.getItems()).toEqual([
                    expect.objectContaining({ text: 'accountOutput' }),
                    expect.objectContaining({ text: 'carOutput' }),
                    expect.objectContaining({ text: 'accountOutputCollection' }),
                    expect.objectContaining({ text: 'carOutputCollection' }),
                    expect.objectContaining({ text: 'inputOutput1' }),
                    expect.objectContaining({ text: 'inputOutput2' }),
                    expect.objectContaining({ text: 'output1' }),
                    expect.objectContaining({ text: 'output2' }),
                    expect.objectContaining({ text: 'output3' })
                ]);
            });
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'output2'], {
                displayText: '{!subflowAutomaticOutput.output2}'
            });
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'accountOutput'], {
                displayText: '{!subflowAutomaticOutput.accountOutput}'
            });
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'accountOutput', 'Name'], {
                displayText: '{!subflowAutomaticOutput.accountOutput.Name}'
            });
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'carOutput', 'wheel', 'type'], {
                displayText: '{!subflowAutomaticOutput.carOutput.wheel.type}'
            });
        });
        describe('loop automatic output', () => {
            itCanSelectInLhs(['Current Item from Loop loopOnAccountAutoOutput', 'Name'], {
                displayText: '{!loopOnAccountAutoOutput.Name}'
            });
            itCanSelectInLhs(['Current Item from Loop loopOnTextCollectionAutoOutput'], {
                displayText: '{!loopOnTextCollectionAutoOutput}'
            });
            itCanSelectInLhs(['Current Item from Loop loopOnApexAutoOutput', 'name'], {
                displayText: '{!loopOnApexAutoOutput.name}'
            });
            it('cannot select loop with manual output', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                await lhsCombobox.typeReferenceOrValue('{!loopOnTextCollectionManualOutput}');
                expect(lhsCombobox.element.errorMessage).toBe('FlowBuilderMergeFieldValidation.unknownResource');
            });
        });
    });
});
describe('Assignment Editor for record triggered flow', () => {
    let store;
    beforeAll(async () => {
        store = await setupStateForFlow(recordTriggeredFlow);
    });
    afterAll(() => {
        resetState();
    });
    describe('Validation', () => {
        let assignmentForPropertyEditor;
        let expressionBuilder: ExpressionBuilderComponentTest;
        const testExpression = getExpressionTester(() => expressionBuilder.element);
        beforeAll(() => {
            const assignmentElement = getElementByDevName('assign');
            assignmentForPropertyEditor = getElementForPropertyEditor(assignmentElement);
        });
        beforeEach(() => {
            const assignmentComponent = createComponentForTest(assignmentForPropertyEditor);
            expressionBuilder = getFerToFerovExpressionBuilder(assignmentComponent);
        });
        describe('$Record__Prior is not allowed on LHS', () => {
            it.each`
                lhs                        | expectedErrorMessage
                ${'{!Record__Prior}'}      | ${'FlowBuilderMergeFieldValidation.unknownResource'}
                ${'{!Record__Prior.Name}'} | ${'FlowBuilderMergeFieldValidation.unknownResource'}
            `('error for "$lhs should be : $expectedErrorMessage', async ({ lhs, expectedErrorMessage }) => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                await lhsCombobox.typeReferenceOrValue(lhs);
                expect(lhsCombobox.element.errorMessage).toEqual(expectedErrorMessage);
            });
        });
        describe('When using $Record__Prior on RHS', () => {
            // eslint-disable-next-line no-unused-expressions
            testExpression.each`
                lhs                                             | operator    | rhs                                    | rhsErrorMessage
                ${'{!accountSObjectVariable}'}                  | ${'Assign'} | ${'{!$Record__Prior}'}                 | ${undefined}
                ${'{!stringVariable}'}                          | ${'Assign'} | ${'{!$Record__Prior.Name}'}            | ${undefined}
            `;
        });
    });
    describe('Validation on "Done"', () => {
        let assignmentForPropertyEditor;
        const updateRecordTriggerType = (recordTriggerType: string) => {
            const startElement = getStartElement();
            const updatedStartElement = createStartElementForPropertyEditor(
                Object.assign(startElement, { recordTriggerType })
            );
            store.dispatch(updateElement(updatedStartElement));
        };
        beforeAll(() => {
            const assignmentElement = getElementByDevName('assign');
            assignmentForPropertyEditor = getElementForPropertyEditor(assignmentElement);
        });
        test('No validation error when the start element is not modified via its record trigger type', () => {
            const assignmentComponent = createComponentForTest(assignmentForPropertyEditor);
            const errors = assignmentComponent.validate();
            expect(errors).toEqual([]);
        });
        test('there should be a validation error when we switch from a recordTriggerType where $Record__Prior is supported to a recordTriggerType where it is not supported', () => {
            updateRecordTriggerType('Create');
            const assignmentComponent = createComponentForTest(assignmentForPropertyEditor);
            const errors = assignmentComponent.validate();
            expect(errors).toEqual([
                { errorString: 'FlowBuilderMergeFieldValidation.unknownResource', key: 'rightHandSide' }
            ]);
        });
    });
});
