// @ts-nocheck
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as scheduleTriggeredFlow from 'mock/flows/scheduleTriggeredFlow.json';
import * as autoLaunchedFlowScheduledJourney from 'mock/flows/autoLaunchedFlowScheduledJourney.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import { LIGHTNING_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { setupState, resetState, loadFlow } from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getLhsCombobox, getRhsCombobox } from '../expressionBuilderTestUtils';
import { createComponentForTest, getFerToFerovExpressionBuilder } from './decisionEditorTestUtils';
import { typeReferenceOrValueInCombobox } from '../comboboxTestUtils';
import { expectCanBeTraversed, expectCannotBeSelected, expectCannotBeTraversed } from '../groupedComboboxTestUtils';

const getLHSGroupedCombobox = (combobox) =>
    combobox.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
const getRHSGroupedCombobox = (combobox) =>
    combobox.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX);

describe('Decision Editor', () => {
    let decisionForPropertyEditor, decisionEditor, store;
    beforeAll(() => {
        store = setupState();
    });
    afterAll(() => {
        resetState();
    });
    describe('Process type that supports lookup traversal', () => {
        let expressionBuilder;
        beforeEach(async () => {
            await loadFlow(flowWithAllElements, store);
            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
            expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
        });
        it('should be traverse-able in the LHS', async () => {
            const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
            const lhsGroupedCombobox = getLHSGroupedCombobox(lhsCombobox);
            await expectCanBeTraversed(lhsGroupedCombobox, 'text', ['accountSObjectVariable', 'CreatedBy']);
        });
        it('should be traverse-able in the RHS', async () => {
            const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
            const rhsGroupedCombobox = getRHSGroupedCombobox(rhsCombobox);
            await expectCanBeTraversed(rhsGroupedCombobox, 'text', ['accountSObjectVariable', 'CreatedBy']);
        });
    });
    describe('AutoLaunched flow: All Trigger Types except ScheduledJourney are supported', () => {
        describe('Trigger type is not ScheduledJourney and is set', () => {
            let expressionBuilder;
            beforeEach(async () => {
                await loadFlow(scheduleTriggeredFlow, store);
                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
                expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
            });
            it('should be traverse-able in the LHS', async () => {
                const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                const lhsGroupedCombobox = getLHSGroupedCombobox(lhsCombobox);
                await expectCanBeTraversed(lhsGroupedCombobox, 'text', ['accountVariable', 'CreatedBy']);
                await expectCannotBeTraversed(lhsGroupedCombobox, 'text', ['accountVariable', 'CreatedById']);
            });
            it('should be traverse-able in the RHS', async () => {
                const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                const rhsGroupedCombobox = getRHSGroupedCombobox(rhsCombobox);
                await expectCanBeTraversed(rhsGroupedCombobox, 'text', ['accountVariable', 'CreatedBy']);
                await expectCannotBeTraversed(rhsGroupedCombobox, 'text', ['accountVariable', 'CreatedById']);
            });
            describe('Validation', () => {
                beforeEach(() => {
                    expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
                });
                describe('Selection using comboboxes', () => {
                    const itCanSelectInLhs = (lhs, expectedItem = {}) =>
                        it(`can select [${lhs}] on lhs`, async () => {
                            const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                            lhsCombobox.value = null;
                            await expect(lhsCombobox).canSelectInCombobox('text', lhs);
                            expect(lhsCombobox.value).toMatchObject(expectedItem);
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
                        const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                        await typeReferenceOrValueInCombobox(lhsCombobox, lhs);
                        await expect(lhsCombobox.errorMessage).toEqual(expectedErrorMessage);
                    });
                });
            });
        });
    });
    describe('AutoLaunched Scheduled Journey flow: All Trigger Types except ScheduledJourney are supported', () => {
        describe('Trigger type is ScheduledJourney', () => {
            let expressionBuilder;
            beforeAll(async () => {
                await loadFlow(autoLaunchedFlowScheduledJourney, store);
            });
            beforeEach(() => {
                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
                expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
            });
            it('should NOT be traverse-able in the LHS', async () => {
                const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
                const lhsGroupedCombobox = getLHSGroupedCombobox(lhsCombobox);
                await expectCannotBeSelected(lhsGroupedCombobox, 'text', ['accountVariable', 'CreatedBy']);
            });
            it('should NOT be traverse-able in the RHS', async () => {
                const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
                const rhsGroupedCombobox = getRHSGroupedCombobox(rhsCombobox);
                await expectCannotBeSelected(rhsGroupedCombobox, 'text', ['accountVariable', 'CreatedBy']);
            });
        });
    });
    describe('Process type that does not support lookup traversal', () => {
        let expressionBuilder;
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
            const lhsCombobox = await getLhsCombobox(expressionBuilder, true);
            const lhsGroupedCombobox = getLHSGroupedCombobox(lhsCombobox);
            await expectCannotBeSelected(lhsGroupedCombobox, 'text', ['vMyTestAccount', 'CreatedBy']);
            await expectCannotBeTraversed(lhsGroupedCombobox, 'text', ['vMyTestAccount', 'CreatedById']);
        });
        it('does not show up chevron on fields in RHS', async () => {
            const rhsCombobox = await getRhsCombobox(expressionBuilder, true);
            const rhsGroupedCombobox = getRHSGroupedCombobox(rhsCombobox);
            await expectCannotBeSelected(rhsGroupedCombobox, 'text', ['vMyTestAccount', 'CreatedBy']);
            await expectCannotBeTraversed(rhsGroupedCombobox, 'text', ['vMyTestAccount', 'CreatedById']);
        });
    });
});
