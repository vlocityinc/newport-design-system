import { createElement } from 'lwc';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setupStateForFlow, resetState } from '../integrationTestUtils';
import {
    ticks,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { validateExpression, getLhsCombobox, getRhsCombobox, selectOperator } from '../expressionBuilderTestUtils';
import {
    selectComboboxItemBy,
    typeMergeFieldInCombobox,
    getComboboxItems,
    typeReferenceOrValueInCombobox,
    getComboboxGroupLabel
} from '../comboboxTestUtils';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import {
    addNewResourceEventListener,
    removeNewResourceEventListener,
    setNextInlineResource
} from '../inlineResourceTestUtils';

jest.mock('@salesforce/label/FlowBuilderElementLabels.actionAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});

jest.mock('@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel', () => ({ default: 'New Resource' }), {
    virtual: true
});

jest.mock('@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText', () => ({ default: 'Outputs from {0}' }), {
    virtual: true
});

jest.mock(
    '@salesforce/label/FlowBuilderSubflows.variableInLatestVersionOnly',
    () => ({ default: '{0} (Latest Version Only)' }),
    { virtual: true }
);

jest.mock(
    '@salesforce/label/FlowBuilderSubflows.variableInActiveVersionOnly',
    () => ({ default: '{0} (Active Version Only)' }),
    { virtual: true }
);

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

const createComponentForTest = assignmentElement => {
    const el = createElement('builder_platform_interaction-assignment-editor', {
        is: AssignmentEditor
    });
    Object.assign(el, { node: assignmentElement });
    document.body.appendChild(el);
    return el;
};

const getFerToFerovExpressionBuilder = assignment => {
    return deepQuerySelector(assignment, [INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER]);
};

describe('Assignment Editor', () => {
    let assignment, expressionBuilder;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    beforeEach(async () => {
        const assignmentElement = getElementByDevName('assignment1');
        const assignmentForPropertyEditor = getElementForPropertyEditor(assignmentElement);
        assignment = createComponentForTest(assignmentForPropertyEditor);
        await ticks();
        expressionBuilder = getFerToFerovExpressionBuilder(assignment);
    });
    describe('Validation', () => {
        const testExpression = {
            each: (strings, ...keys) => {
                it.each(strings, ...keys)(
                    'error for "$lhs $operator $rhs" should be : $rhsErrorMessage',
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
                // just to workaround no-unused-expressions for template tag
                return () => undefined;
            }
        };
        describe('When LHS is a picklist', () => {
            testExpression.each`
            lhs                                            | operator    | rhs                                                     | rhsErrorMessage
            ${'{!accountSObjectVariable.AccountSource}'}   | ${'Assign'} | ${'Advertisement'}                                      | ${undefined}
            ${'{!accountSObjectVariable.AccountSource}'}   | ${'Assign'} | ${'NotAPicklistValue'}                                  | ${undefined}
            `();
        });
        describe('When LHS is a number', () => {
            testExpression.each`
            lhs                                            | operator    | rhs                                                     | rhsErrorMessage
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'500.0'}                                              | ${undefined}
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Assign'} | ${'not a number'}                                       | ${'FlowBuilderCombobox.numberErrorMessage'}
            ${'{!accountSObjectVariable.BillingLatitude}'} | ${'Add'}    | ${'{!accountSObjectVariable.Name}'}                     | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            `();
        });
        describe('cross-object field references', () => {
            it('does not allow a merge field with more than 10 levels', async () => {
                const lhs = '{!stringVariable}';
                const operator = 'Assign';
                const rhs =
                    '{!accountSObjectVariable.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.CreatedBy.LastModifiedBy.Name}';
                expect(
                    await validateExpression(expressionBuilder, {
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
                    await validateExpression(expressionBuilder, {
                        lhs,
                        operator,
                        rhs
                    })
                ).toEqual({});
            });
            describe('When rhs is a cross-Object Field Reference using Polymorphic Relationships', () => {
                testExpression.each`
                lhs                                            | operator    | rhs                                                     | rhsErrorMessage
                ${'{!numberVariable}'}                         | ${'Assign'} | ${'{!feedItemVariable.Parent:Account.BillingLatitude}'} | ${undefined}
                ${'{!numberVariable}'}                         | ${'Assign'} | ${'{!feedItemVariable.Parent:Account.Name}'}            | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
                `();
            });
        });
        describe('When using Apex types on LHS or RHS', () => {
            testExpression.each`
            lhs                                             | operator    | rhs                                                     | rhsErrorMessage
            ${'{!apexCall_Car_automatic_output.car}'}       | ${'Assign'} | ${'{!apexCarVariable}'}                                 | ${undefined}
            ${'{!stringVariable}'}                          | ${'Assign'} | ${'{!apexCarVariable.wheel.type}'}                      | ${undefined}
            ${'{!apexComplexTypeVariable}'}                 | ${'Assign'} | ${'{!apexComplexTypeVariable}'}                         | ${undefined}
            ${'{!apexComplexTypeVariable.acct}'}            | ${'Assign'} | ${'{!apexComplexTypeVariable}'}                         | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!apexComplexTypeVariable.acct}'}            | ${'Assign'} | ${'{!accountSObjectVariable}'}                          | ${undefined}
            ${'{!accountSObjectVariable}'}                  | ${'Assign'} | ${'{!apexComplexTypeVariable.acct}'}                    | ${undefined}
            ${'{!accountSObjectVariable}'}                  | ${'Assign'} | ${'{!apexComplexTypeVariable.doesNotExist}'}            | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
            `();
            it('can traverse more than 2 levels in the LHS', async () => {
                const lhsCombobox = getLhsCombobox(expressionBuilder);
                expect(await selectComboboxItemBy(lhsCombobox, 'text', ['apexCarVariable', 'wheel'])).toMatchObject({
                    displayText: '{!apexCarVariable.wheel}'
                });
                expect(
                    await selectComboboxItemBy(lhsCombobox, 'text', ['apexCarVariable', 'wheel', 'type'])
                ).toMatchObject({
                    displayText: '{!apexCarVariable.wheel.type}'
                });
            });
            it('can traverse SObject in the Apex types', async () => {
                const lhsCombobox = getLhsCombobox(expressionBuilder);
                expect(
                    await selectComboboxItemBy(lhsCombobox, 'text', [
                        'apexComplexTypeVariable',
                        'acct',
                        'AccountSource'
                    ])
                ).toMatchObject({
                    displayText: '{!apexComplexTypeVariable.acct.AccountSource}'
                });
            });
            it('cannot traverse more than one level of an SObject in the Apex types', async () => {
                const lhsCombobox = getLhsCombobox(expressionBuilder);
                expect(
                    await selectComboboxItemBy(lhsCombobox, 'text', ['apexComplexTypeVariable', 'acct', 'CreatedBy'])
                ).toBeUndefined();
            });
        });
        describe('Automatic handling mode', () => {
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
            `();
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
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            await selectComboboxItemBy(lhsCombobox, 'text', ['New Resource']);
            await ticks(50);
            expect(lhsCombobox.value).toMatchObject({
                dataType: 'String',
                displayText: '{!myInlineTextVar}'
            });
        });
    });
    describe('Traversal', () => {
        it('is limited to 10 levels', async () => {
            // Given
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            const rhsCombobox = getRhsCombobox(expressionBuilder);
            await typeMergeFieldInCombobox(lhsCombobox, '{!stringVariable}');
            selectOperator(expressionBuilder, 'Assign');

            // When
            const comboboxItem = await selectComboboxItemBy(
                rhsCombobox,
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
            for (const item of getComboboxItems(rhsCombobox)) {
                expect(item.hasNext).toBeUndefined();
            }
        });
        it.each`
            lhs                                           | expectedErrorMessage
            ${'{!apexComplexTypeVariable.acct}'}          | ${null}
            ${'{!apexComplexTypeVariable.doesNotExist}'}  | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
            ${'{!apexComplexTypeVariable.doesNotExist.}'} | ${'FlowBuilderCombobox.genericErrorMessage'}
        `('error for "$lhs should be : $expectedErrorMessage', async ({ lhs, expectedErrorMessage }) => {
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            await typeReferenceOrValueInCombobox(lhsCombobox, lhs);
            expect(lhsCombobox.errorMessage).toEqual(expectedErrorMessage);
        });
    });
    describe('Selection using comboboxes', () => {
        const expectCanSelectInCombobox = async (combobox, propertyValues, expectedItem = {}) => {
            const selectedItem = await selectComboboxItemBy(combobox, 'text', propertyValues, { blur: true });
            expect(selectedItem).toBeDefined();
            expect(combobox.errorMessage).toBeNull();
            expect(selectedItem).toMatchObject(expectedItem);
        };
        const itCanSelectInLhs = (lhs, expectedItem = {}) =>
            it(`can select [${lhs}] on lhs`, async () => {
                const lhsCombobox = getLhsCombobox(expressionBuilder);
                await expectCanSelectInCombobox(lhsCombobox, lhs, expectedItem);
            });
        const itCanSelectInRhs = (rhs, expectedItem = {}) =>
            it(`can select [${rhs}] on rhs`, async () => {
                const rhsCombobox = getRhsCombobox(expressionBuilder);
                await expectCanSelectInCombobox(rhsCombobox, rhs, expectedItem);
            });
        describe('groups', () => {
            it.each`
                item                                                 | group
                ${'apexComplexTypeVariable'}                         | ${'APEX-DEFINED VARIABLES'}
                ${'Outputs from subflowAutomaticOutput'}             | ${'SUBFLOWS'}
                ${'Outputs from apexCall_Car_automatic_output'}      | ${'ACTIONS'}
                ${'AccountId from createAccountWithAutomaticOutput'} | ${'VARIABLES'}
                ${'Account from lookupRecordAutomaticOutput'}        | ${'RECORD (SINGLE) VARIABLES'}
            `('$item should be in group $group', ({ item, group }) => {
                const lhsCombobox = getLhsCombobox(expressionBuilder);
                const groupLabel = getComboboxGroupLabel(lhsCombobox, 'text', item);
                expect(groupLabel).toEqual(group);
            });
        });
        describe('apex variables', () => {
            itCanSelectInLhs(['apexComplexTypeVariable', 'acct'], {
                iconName: 'utility:sobject'
            });
            itCanSelectInLhs(['apexComplexTypeVariable', 'acct', 'Name']);
        });
        describe('lookup records automatic output', () => {
            itCanSelectInLhs(['Account from lookupRecordAutomaticOutput'], {
                iconName: 'utility:sobject'
            });
            itCanSelectInLhs(['Account from lookupRecordAutomaticOutput', 'Name']);
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
            itCanSelectInLhs(['Outputs from apexCall_Car_automatic_output', 'car'], { iconName: 'utility:apex' });
        });
        describe('subflow automatic output', () => {
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'output2 (Active Version Only)']);
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'accountOutput']);
            itCanSelectInLhs(['Outputs from subflowAutomaticOutput', 'accountOutput', 'Name']);
            itCanSelectInLhs(
                ['Outputs from subflowAutomaticOutput', 'carOutput (Latest Version Only)', 'wheel', 'type'],
                {
                    displayText: '{!subflowAutomaticOutput.carOutput.wheel.type}'
                }
            );
        });
    });
});
