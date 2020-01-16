import { createElement } from 'lwc';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { flowWithGetRecordUsingSObjectSingleAutomatedOutput } from 'mock/flows/flowWithGetRecord';
import { flowWithCreateRecordAutomatedOutput } from 'mock/flows/flowWithCreateRecord';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { updateFlow } from 'builder_platform_interaction/actions';
import AssignmentEditor from 'builder_platform_interaction/assignmentEditor';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { setupStateForProcessType, resetState } from '../integrationTestUtils';
import {
    expectGroupedComboboxItem,
    getGroupedComboboxItem,
    getGroupedComboboxItemInGroupByDisplayText,
    expectGroupedComboboxItemInGroup
} from '../integrationTestUtils';
import {
    ticks,
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    selectEvent
} from 'builder_platform_interaction/builderTestUtils';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import {
    EXPRESSION_BUILDER_SELECTORS,
    validateExpression,
    getLhsCombobox,
    getRhsCombobox,
    selectOperator
} from '../expressionBuilderTestUtils';
import {
    selectComboboxItemBy,
    typeMergeFieldInCombobox,
    getComboboxItems
} from '../comboboxTestUtils';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { loadFieldsForComplexTypesInFlow } from 'builder_platform_interaction/preloadLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createVariable } from 'builder_platform_interaction/elementFactory';
import {
    addNewResourceEventListener,
    removeNewResourceEventListener,
    setNextInlineResource
} from '../inlineResourceTestUtils';

jest.mock(
    '@salesforce/label/FlowBuilderElementLabels.actionAsResourceText',
    () => {
        return { default: 'Outputs from {0}' };
    },
    { virtual: true }
);

jest.mock(
    '@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel',
    () => {
        return { default: 'New Resource' };
    },
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
    return deepQuerySelector(assignment, [
        INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER
    ]);
};

const getLHSGroupedCombobox = assignment => {
    return deepQuerySelector(assignment, [
        INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.LHS_COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

const getRHSGroupedCombobox = assignment => {
    return deepQuerySelector(assignment, [
        INTERACTION_COMPONENTS_SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER,
        EXPRESSION_BUILDER_SELECTORS.RHS_COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

describe('Assignment Editor', () => {
    let store;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.FLOW);
        setApexClasses(apexTypesForFlow);
    });
    afterAll(() => {
        resetState();
    });
    describe('"Get Records" Automated ouput in combobox', () => {
        let assignment, assignmentForPropertyEditor;
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(
                flowWithGetRecordUsingSObjectSingleAutomatedOutput
            );
            store.dispatch(updateFlow(uiFlow));
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment');
            assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
        });
        it('shows up automated output from Get Record in LHS', () => {
            const lhsCombo = getLHSGroupedCombobox(assignment);
            expect(
                getGroupedComboboxItemInGroupByDisplayText(
                    lhsCombo,
                    'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                    '{!Get_single_record_automatic_output}'
                )
            ).toBeDefined();
        });
        it('shows up automated output from Get Record in RHS', () => {
            const rhsCombo = getRHSGroupedCombobox(assignment);
            expect(
                getGroupedComboboxItemInGroupByDisplayText(
                    rhsCombo,
                    'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                    '{!Get_single_record_automatic_output}'
                )
            ).toBeDefined();
        });
        it('shows up record field when automated output from Get Record selected', async () => {
            const lhsCombo = getLHSGroupedCombobox(assignment);
            const automatedOutputFromGetRecord = getGroupedComboboxItemInGroupByDisplayText(
                lhsCombo,
                'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                '{!Get_single_record_automatic_output}'
            );
            lhsCombo.dispatchEvent(
                selectEvent(automatedOutputFromGetRecord.value)
            );
            await ticks();
            expectGroupedComboboxItem(lhsCombo, 'Name');
        });
        it('can select automated output from Get Record field', async () => {
            const lhsCombo = getLHSGroupedCombobox(assignment);
            const automatedOutputFromGetRecord = getGroupedComboboxItemInGroupByDisplayText(
                lhsCombo,
                'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                '{!Get_single_record_automatic_output}'
            );
            lhsCombo.dispatchEvent(
                selectEvent(automatedOutputFromGetRecord.value)
            );
            await ticks();
            const automatedOutputFromGetRecordNameField = getGroupedComboboxItem(
                lhsCombo,
                'Name'
            );

            lhsCombo.dispatchEvent(
                selectEvent(automatedOutputFromGetRecordNameField.value)
            );
            await ticks();

            expect(lhsCombo.value).toEqual(
                '{!Get_single_record_automatic_output.Name}'
            );
        });
    });
    describe('"Create Records" Automated ouput in combobox', () => {
        let assignment, assignmentForPropertyEditor;
        const recordCreateInAutomaticModeMergeFieldName = addCurlyBraces(
            flowWithCreateRecordAutomatedOutput.metadata.recordCreates[0].name
        );
        beforeAll(() => {
            const uiFlow = translateFlowToUIModel(
                flowWithCreateRecordAutomatedOutput
            );
            store.dispatch(updateFlow(uiFlow));
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment');
            assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
        });
        it('shows up automated output from Create Record in LHS under "variables" section with correct "displayText" and "subtext"', () => {
            const lhsCombo = getLHSGroupedCombobox(assignment);
            expect(
                getGroupedComboboxItemInGroupByDisplayText(
                    lhsCombo,
                    'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                    recordCreateInAutomaticModeMergeFieldName
                )
            ).toBeDefined();
            expectGroupedComboboxItemInGroup(
                lhsCombo,
                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                'FlowBuilderDataTypes.textDataTypeLabel',
                'subText'
            );
        });
        it('shows up automated output from Create Record in RHS under "variables" section correct "displayText" and "subtext"', () => {
            const rhsCombo = getRHSGroupedCombobox(assignment);
            expect(
                getGroupedComboboxItemInGroupByDisplayText(
                    rhsCombo,
                    'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                    recordCreateInAutomaticModeMergeFieldName
                )
            ).toBeDefined();
            expectGroupedComboboxItemInGroup(
                rhsCombo,
                'FLOWBUILDERELEMENTCONFIG.VARIABLEPLURALLABEL',
                'FlowBuilderDataTypes.textDataTypeLabel',
                'subText'
            );
        });
    });
    describe('Invocable action Automated ouput in combobox', () => {
        let assignment, assignmentForPropertyEditor, expressionBuilder;
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment1');
            assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            expressionBuilder = getFerToFerovExpressionBuilder(assignment);
            await ticks();
        });
        it('shows up Apex type fields with expected icon', async () => {
            const lhsCombobox = getLhsCombobox(expressionBuilder);
            const apexTypeField = await selectComboboxItemBy(
                lhsCombobox,
                'text',
                ['Outputs from apexCall_Car_automatic_output', 'car']
            );

            expect(apexTypeField).toBeDefined();
            expect(apexTypeField.iconName).toBe('utility:apex');
        });
    });
    describe('Validation', () => {
        let assignment, expressionBuilder;
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
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment1');
            const assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
            expressionBuilder = getFerToFerovExpressionBuilder(assignment);
        });
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
                    rhsErrorMessage:
                        'FlowBuilderMergeFieldValidation.maximumNumberOfLevelsReached'
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
            `();
            it('can traverse more than 2 levels in the LHS', async () => {
                const lhsCombobox = getLhsCombobox(expressionBuilder);
                expect(
                    await selectComboboxItemBy(lhsCombobox, 'text', [
                        'apexCarVariable',
                        'wheel'
                    ])
                ).toMatchObject({
                    displayText: '{!apexCarVariable.wheel}'
                });
                expect(
                    await selectComboboxItemBy(lhsCombobox, 'text', [
                        'apexCarVariable',
                        'wheel',
                        'type'
                    ])
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
                    await selectComboboxItemBy(lhsCombobox, 'text', [
                        'apexComplexTypeVariable',
                        'acct',
                        'CreatedBy'
                    ])
                ).toBeUndefined();
            });
        });
        describe('Automatic handling mode', () => {
            testExpression.each`
            lhs                                              | operator    | rhs                                                                                    | rhsErrorMessage
            ${'{!stringVariable}'}                           | ${'Assign'} | ${'{!apexCall_account_automatic_output.generatedAccount.LastModifiedBy.Account.Name}'} | ${undefined}
            ${'{!numberVariable}'}                           | ${'Assign'} | ${'{!apexCall_account_automatic_output.generatedAccount.LastModifiedBy.Account.Name}'} | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!stringVariable}'}                           | ${'Assign'} | ${'{!lookupRecordAutomaticOutput.LastModifiedBy.Account.Name}'}                        | ${undefined}
            ${'{!numberVariable}'}                           | ${'Assign'} | ${'{!lookupRecordAutomaticOutput.LastModifiedBy.Account.Name}'}                        | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            ${'{!emailScreenFieldAutomaticOutput.disabled}'} | ${'Assign'} | ${'{!$GlobalConstant.True}'}                                                           | ${undefined}
            ${'{!emailScreenFieldAutomaticOutput.disabled}'} | ${'Assign'} | ${'myString'}                                                                          | ${'FlowBuilderCombobox.genericErrorMessage'}
            ${'{!stringVariable}'}                           | ${'Assign'} | ${'{!createAccountWithAutomaticOutput}'}                                               | ${undefined}
            ${'{!numberVariable}'}                           | ${'Assign'} | ${'{!createAccountWithAutomaticOutput}'}                                               | ${'FlowBuilderMergeFieldValidation.invalidDataType'}
            `();
        });
    });
    describe('Inline Resource creation', () => {
        let assignment, expressionBuilder;
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment1');
            const assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
            expressionBuilder = getFerToFerovExpressionBuilder(assignment);
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
        let assignment, expressionBuilder;
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        beforeEach(async () => {
            const assignmentElement = getElementByDevName('assignment1');
            const assignmentForPropertyEditor = getElementForPropertyEditor(
                assignmentElement
            );
            assignment = createComponentForTest(assignmentForPropertyEditor);
            await ticks();
            expressionBuilder = getFerToFerovExpressionBuilder(assignment);
        });
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
    });
});
