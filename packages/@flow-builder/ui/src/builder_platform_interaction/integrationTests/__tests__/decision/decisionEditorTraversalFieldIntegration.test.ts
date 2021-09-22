import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import * as autoLaunchedFlowScheduled from 'mock/flows/autoLaunchedFlowScheduled.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { setupState, resetState, loadFlow } from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { ExpressionBuilderComponentTest } from '../expressionBuilderTestUtils';
import { createComponentForTest, getFerToFerovExpressionBuilder } from './decisionEditorTestUtils';
import { expectCanBeTraversed, expectCannotBeSelected, expectCannotBeTraversed } from '../groupedComboboxTestUtils';

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, sharedUtils, {
        invokeModal: require('builder_platform_interaction/sharedUtils/auraUtils').invokeModal,
        commonUtils: require('builder_platform_interaction/sharedUtils/commonUtils')
    });
});

describe('Decision Editor', () => {
    let decisionForPropertyEditor, decisionEditor, store;
    beforeAll(() => {
        store = setupState();
    });
    afterAll(() => {
        resetState();
    });
    describe('Process type that supports lookup traversal', () => {
        let expressionBuilder: ExpressionBuilderComponentTest;
        beforeEach(async () => {
            await loadFlow(flowWithAllElements, store);
            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
            expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
        });
        it('should be traverse-able in the LHS', async () => {
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
            await expectCanBeTraversed(lhsCombobox.getGroupedCombobox(), 'text', [
                'accountSObjectVariable',
                'CreatedBy'
            ]);
        });
        it('should be traverse-able in the RHS', async () => {
            const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
            await expectCanBeTraversed(rhsCombobox.getGroupedCombobox(), 'text', [
                'accountSObjectVariable',
                'CreatedBy'
            ]);
        });
    });
    describe('AutoLaunched flow: All Trigger Types except ScheduledJourney are supported', () => {
        describe('Trigger type is not ScheduledJourney and is set', () => {
            let expressionBuilder: ExpressionBuilderComponentTest;
            beforeEach(async () => {
                await loadFlow(scheduleTriggeredFlow, store);
                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
                expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
            });
            it('should be traverse-able in the LHS', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                await expectCanBeTraversed(lhsCombobox.getGroupedCombobox(), 'text', ['accountVariable', 'CreatedBy']);
                await expectCannotBeTraversed(lhsCombobox.getGroupedCombobox(), 'text', [
                    'accountVariable',
                    'CreatedById'
                ]);
            });
            it('should be traverse-able in the RHS', async () => {
                const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                await expectCanBeTraversed(rhsCombobox.getGroupedCombobox(), 'text', ['accountVariable', 'CreatedBy']);
                await expectCannotBeTraversed(rhsCombobox.getGroupedCombobox(), 'text', [
                    'accountVariable',
                    'CreatedById'
                ]);
            });
            describe('Validation', () => {
                beforeEach(() => {
                    expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
                });
                describe('Selection using comboboxes', () => {
                    const itCanSelectInLhs = (lhs, expectedItem = {}) =>
                        it(`can select [${lhs}] on lhs`, async () => {
                            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                            lhsCombobox.element.value = null;
                            await expect(lhsCombobox).canSelectInCombobox('text', lhs);
                            expect(lhsCombobox.element.value).toMatchObject(expectedItem);
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
                });
                describe('Typing values', () => {
                    it.each`
                        lhs                                           | expectedErrorMessage
                        ${'{!apexComplexTypeVariable.acct}'}          | ${null}
                        ${'{!apexComplexTypeVariable.acct.Name}'}     | ${null}
                        ${'{!apex.acct.CreatedBy.AboutMe} '}          | ${'FlowBuilderCombobox.genericErrorMessage'}
                        ${'{!apexComplexTypeVariable.doesNotExist}'}  | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                        ${'{!apexComplexTypeVariable.doesNotExist.}'} | ${'FlowBuilderMergeFieldValidation.unknownRecordField'}
                    `('error for "$lhs should be : $expectedErrorMessage', async ({ lhs, expectedErrorMessage }) => {
                        const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                        await lhsCombobox.typeReferenceOrValue(lhs);
                        await expect(lhsCombobox.element.errorMessage).toEqual(expectedErrorMessage);
                    });
                });
            });
        });
    });
    const describeSkip = describe.skip;
    // see W-9035769
    describeSkip('AutoLaunched Scheduled Journey flow: All Trigger Types except ScheduledJourney are supported', () => {
        describe('Trigger type is ScheduledJourney', () => {
            let expressionBuilder: ExpressionBuilderComponentTest;
            beforeAll(async () => {
                await loadFlow(autoLaunchedFlowScheduled, store);
            });
            beforeEach(() => {
                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
                expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
            });
            it('should NOT be traverse-able in the LHS', async () => {
                const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
                await expectCannotBeSelected(lhsCombobox.getGroupedCombobox(), 'text', [
                    'accountVariable',
                    'CreatedBy'
                ]);
            });
            it('should NOT be traverse-able in the RHS', async () => {
                const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
                await expectCannotBeSelected(rhsCombobox.getGroupedCombobox(), 'text', [
                    'accountVariable',
                    'CreatedBy'
                ]);
            });
        });
    });
    describe('Process type that does not support lookup traversal', () => {
        let expressionBuilder: ExpressionBuilderComponentTest;
        beforeAll(async () => {
            await loadFlow(fieldServiceMobileFlow, store);
        });
        beforeEach(async () => {
            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
            expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
        });
        it('does not show up chevron on fields in LHS', async () => {
            const lhsCombobox = await expressionBuilder.getLhsCombobox(true);
            await expectCannotBeSelected(lhsCombobox.getGroupedCombobox(), 'text', ['vMyTestAccount', 'CreatedBy']);
            await expectCannotBeTraversed(lhsCombobox.getGroupedCombobox(), 'text', ['vMyTestAccount', 'CreatedById']);
        });
        it('does not show up chevron on fields in RHS', async () => {
            const rhsCombobox = await expressionBuilder.getRhsCombobox(true);
            await expectCannotBeSelected(rhsCombobox.getGroupedCombobox(), 'text', ['vMyTestAccount', 'CreatedBy']);
            await expectCannotBeTraversed(rhsCombobox.getGroupedCombobox(), 'text', ['vMyTestAccount', 'CreatedById']);
        });
    });
});
