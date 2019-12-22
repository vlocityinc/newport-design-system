import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as autoLaunchedFlow from 'mock/flows/autolaunchedFlow.json';
import * as contactRequestFlow from 'mock/flows/contactRequestFlow.json';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState } from '../integrationTestUtils';
import {  initializeAuraFetch } from '../serverDataTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getLhsCombobox, getRhsCombobox } from '../expressionBuilderTestUtils';
import { selectGroupedComboboxItemBy } from '../comboboxTestUtils';
import {
    createComponentForTest,
    getFerToFerovExpressionBuilder
} from './decisionEditorTestUtils';
import { initializeLoader, loadOnProcessTypeChange } from 'builder_platform_interaction/preloadLib';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

const getLHSGroupedCombobox = decision => {
    return getLhsCombobox(
        getFerToFerovExpressionBuilder(decision)
    ).shadowRoot.querySelector(SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
};

const getRHSGroupedCombobox = decision => {
    return getRhsCombobox(
        getFerToFerovExpressionBuilder(decision)
    ).shadowRoot.querySelector(SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
};

describe('Decision Editor', () => {
    let decisionForPropertyEditor, decisionEditor, store, uiFlow;
    beforeAll(() => {
        store = Store.getStore(reducer);
        initializeAuraFetch();
        initializeLoader(store);
    });
    afterAll(() => {
        resetState();
    });
    describe('Process type that supports lookup traversal', () => {
        beforeEach(async () => {
            uiFlow = translateFlowToUIModel(flowWithAllElements);
            store.dispatch(updateFlow(uiFlow));
            await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.FLOW);

            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
        });
        it('shows up chevron on fields in LHS', async () => {
            const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
            const accountCreatedByItem = await selectGroupedComboboxItemBy(
                lhsCombobox,
                'text',
                ['accountSObjectVariable', 'CreatedBy'],
                { blur: false }
            );

            expect(accountCreatedByItem.rightIconName).toBe(
                'utility:chevronright'
            );
        });
        it('shows up chevron on fields in RHS', async () => {
            const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
            const accountCreatedByItem = await selectGroupedComboboxItemBy(
                rhsCombobox,
                'text',
                ['accountSObjectVariable', 'CreatedBy'],
                { blur: false }
            );

            expect(accountCreatedByItem.rightIconName).toBe(
                'utility:chevronright'
            );
        });
    });
    describe('AutoLaunched flow : does not support traversal if trigger type set', () => {
        describe('Trigger type is set', () => {
            beforeEach(async () => {
                uiFlow = translateFlowToUIModel(autoLaunchedFlow);
                store.dispatch(updateFlow(uiFlow));
                await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);

                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(
                    element
                );
                decisionEditor = createComponentForTest(
                    decisionForPropertyEditor
                );
            });
            it('does not show up chevron on fields in LHS', async () => {
                const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
                const accountCreatedByItem = await selectGroupedComboboxItemBy(
                    lhsCombobox,
                    'text',
                    ['accountVariable', 'CreatedBy'],
                    { blur: false }
                );

                expect(accountCreatedByItem).toBeUndefined();

                const accountCreatedByIdItem = await selectGroupedComboboxItemBy(
                    lhsCombobox,
                    'text',
                    ['accountVariable', 'CreatedById'],
                    { blur: false }
                );

                expect(accountCreatedByIdItem).toBeDefined();
                expect(accountCreatedByIdItem.rightIconName).toBeUndefined();
            });
            it('does not show up chevron on fields in RHS', async () => {
                const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
                const accountCreatedByItem = await selectGroupedComboboxItemBy(
                    rhsCombobox,
                    'text',
                    ['accountVariable', 'CreatedBy'],
                    { blur: false }
                );

                expect(accountCreatedByItem).toBeUndefined();

                const accountCreatedByIdItem = await selectGroupedComboboxItemBy(
                    rhsCombobox,
                    'text',
                    ['accountVariable', 'CreatedById'],
                    { blur: false }
                );

                expect(accountCreatedByIdItem).toBeDefined();
                expect(accountCreatedByIdItem.rightIconName).toBeUndefined();
            });
        });
    });
    describe('Process type that does not support lookup traversal', () => {
        beforeEach(async () => {
            uiFlow = translateFlowToUIModel(contactRequestFlow);
            store.dispatch(updateFlow(uiFlow));
            await loadOnProcessTypeChange(FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW);

            const element = getElementByDevName('decision');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
        });
        it('does not show up chevron on fields in LHS', async () => {
            const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
            const accountCreatedByItem = await selectGroupedComboboxItemBy(
                lhsCombobox,
                'text',
                ['vMyTestAccount', 'CreatedBy'],
                { blur: false }
            );

            expect(accountCreatedByItem).toBeUndefined();

            const accountCreatedByIdItem = await selectGroupedComboboxItemBy(
                lhsCombobox,
                'text',
                ['vMyTestAccount', 'CreatedById'],
                { blur: false }
            );

            expect(accountCreatedByIdItem).toBeDefined();
            expect(accountCreatedByIdItem.rightIconName).toBeUndefined();
        });
        it('does not show up chevron on fields in RHS', async () => {
            const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
            const accountCreatedByItem = await selectGroupedComboboxItemBy(
                rhsCombobox,
                'text',
                ['vMyTestAccount', 'CreatedBy'],
                { blur: false }
            );

            expect(accountCreatedByItem).toBeUndefined();

            const accountCreatedByIdItem = await selectGroupedComboboxItemBy(
                rhsCombobox,
                'text',
                ['vMyTestAccount', 'CreatedById'],
                { blur: false }
            );

            expect(accountCreatedByIdItem).toBeDefined();
            expect(accountCreatedByIdItem.rightIconName).toBeUndefined();
        });
    });
});
