// @ts-nocheck
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as autoLaunchedFlow from 'mock/flows/autolaunchedFlow.json';
import * as autoLaunchedFlowScheduledJourney from 'mock/flows/autoLaunchedFlowScheduledJourney.json';
import * as fieldServiceMobileFlow from 'mock/flows/fieldServiceMobileFlow.json';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { setupState, resetState, loadFlow } from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { getLhsCombobox, getRhsCombobox } from '../expressionBuilderTestUtils';
import { createComponentForTest, getFerToFerovExpressionBuilder } from './decisionEditorTestUtils';
import {
    typeReferenceOrValueInCombobox,
    expectCanSelectInCombobox,
    expectCanBeTraversed,
    expectCannotBeSelected,
    expectCannotBeTraversed
} from '../comboboxTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

const getLHSGroupedCombobox = decision => {
    return getLhsCombobox(getFerToFerovExpressionBuilder(decision)).shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
};

const getRHSGroupedCombobox = decision => {
    return getRhsCombobox(getFerToFerovExpressionBuilder(decision)).shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
};

describe('Decision Editor', () => {
    let decisionForPropertyEditor, decisionEditor, store;
    beforeAll(() => {
        store = setupState();
    });
    afterAll(() => {
        resetState();
    });
    describe('Process type that supports lookup traversal', () => {
        beforeEach(async () => {
            await loadFlow(flowWithAllElements, store);

            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
        });
        it('shows up chevron on fields in LHS', async () => {
            const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
            await expectCanBeTraversed(lhsCombobox, 'text', ['accountSObjectVariable', 'CreatedBy']);
        });
        it('shows up chevron on fields in RHS', async () => {
            const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
            await expectCanBeTraversed(rhsCombobox, 'text', ['accountSObjectVariable', 'CreatedBy']);
        });
    });
    describe('AutoLaunched flow : All Trigger Types except ScheduledJourney are supported', () => {
        describe('Trigger type is not ScheduledJourney and is set', () => {
            beforeEach(async () => {
                await loadFlow(autoLaunchedFlow, store);

                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
            });
            it('should be traverse-able in the LHS', async () => {
                const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
                await expectCanBeTraversed(lhsCombobox, 'text', ['accountVariable', 'CreatedBy']);
                await expectCannotBeTraversed(lhsCombobox, 'text', ['accountVariable', 'CreatedById']);
            });
            it('should be traverse-able in the RHS', async () => {
                const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
                await expectCanBeTraversed(rhsCombobox, 'text', ['accountVariable', 'CreatedBy']);
                await expectCannotBeTraversed(rhsCombobox, 'text', ['accountVariable', 'CreatedById']);
            });
            describe('Validation', () => {
                let expressionBuilder;
                beforeEach(() => {
                    expressionBuilder = getFerToFerovExpressionBuilder(decisionEditor);
                });
                describe('Selection using comboboxes', () => {
                    const itCanSelectInLhs = (lhs, expectedItem = {}) =>
                        it(`can select [${lhs}] on lhs`, async () => {
                            const lhsCombobox = getLhsCombobox(expressionBuilder);
                            lhsCombobox.value = null;
                            await expectCanSelectInCombobox(lhsCombobox, 'text', lhs, expectedItem);
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
                        ${'{!apexComplexTypeVariable.doesNotExist.}'} | ${'FlowBuilderCombobox.genericErrorMessage'}
                    `('error for "$lhs should be : $expectedErrorMessage', async ({ lhs, expectedErrorMessage }) => {
                        const lhsCombobox = getLhsCombobox(expressionBuilder);
                        await typeReferenceOrValueInCombobox(lhsCombobox, lhs);
                        await expect(lhsCombobox.errorMessage).toEqual(expectedErrorMessage);
                    });
                });
            });
        });
    });
    describe('AutoLaunched Scheduled Journey flow : All Trigger Types except ScheduledJourney are supported', () => {
        describe('Trigger type is ScheduledJourney', () => {
            beforeEach(async () => {
                await loadFlow(autoLaunchedFlowScheduledJourney, store);

                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
            });
            it('does not show up chevron on fields in LHS', async () => {
                const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
                await expectCannotBeSelected(lhsCombobox, 'text', ['accountVariable', 'CreatedBy']);
            });
            it('does not show up chevron on fields in RHS', async () => {
                const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
                await expectCannotBeSelected(rhsCombobox, 'text', ['accountVariable', 'CreatedBy']);
            });
        });
    });
    describe('Process type that does not support lookup traversal', () => {
        beforeEach(async () => {
            await loadFlow(fieldServiceMobileFlow, store);

            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
        });
        it('does not show up chevron on fields in LHS', async () => {
            const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
            await expectCannotBeSelected(lhsCombobox, 'text', ['vMyTestAccount', 'CreatedBy']);
            await expectCannotBeTraversed(lhsCombobox, 'text', ['vMyTestAccount', 'CreatedById']);
        });
        it('does not show up chevron on fields in RHS', async () => {
            const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
            await expectCannotBeSelected(rhsCombobox, 'text', ['vMyTestAccount', 'CreatedBy']);
            await expectCannotBeTraversed(rhsCombobox, 'text', ['vMyTestAccount', 'CreatedById']);
        });
    });
});
