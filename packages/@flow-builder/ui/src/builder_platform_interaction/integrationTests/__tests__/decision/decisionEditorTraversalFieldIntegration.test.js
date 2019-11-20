import { createElement } from 'lwc';
import DecisionEditor from 'builder_platform_interaction/decisionEditor';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import * as autoLaunchedFlow from 'mock/flows/autolaunchedFlow.json';
import * as contactRequestFlow from 'mock/flows/contactRequestFlow.json';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState } from '../integrationTestUtils';
import { auraFetch, allAuraActions } from '../serverDataTestUtils';
import { setAuraFetch } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    selectComboboxItemBy,
    getLhsCombobox,
    getRhsCombobox
} from '../expressionBuilderTestUtils';
import { loadDataForProcessType } from 'builder_platform_interaction/preloadLib';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

const getList = decision => {
    return deepQuerySelector(decision, [
        SELECTORS.OUTCOME,
        SELECTORS.CONDITION_LIST,
        SELECTORS.LIST
    ]);
};

const getRow = decision => {
    return getList(decision)
        .querySelector(' div > slot')
        .assignedNodes()[0]
        .querySelector(SELECTORS.ROW);
};

const getFerToFerovExpressionBuilder = decision => {
    return getRow(decision)
        .shadowRoot.querySelector(' div > slot')
        .assignedNodes()[0]
        .querySelector(SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER);
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

const createComponentForTest = node => {
    const el = createElement('builder_platform_interaction-decision-editor', {
        is: DecisionEditor
    });

    el.node = node;

    document.body.appendChild(el);

    return el;
};

describe('Decision Editor', () => {
    let decisionForPropertyEditor, decisionEditor, store, uiFlow;
    describe('existing flow with a decision and an account variable', () => {
        beforeAll(() => {
            store = Store.getStore(reducer);
            setAuraFetch(auraFetch(allAuraActions));
        });
        afterAll(() => {
            resetState();
            setAuraFetch();
            store.dispatch({ type: 'INIT' });
        });
        describe('Process type that supports lookup traversal', () => {
            beforeEach(async () => {
                uiFlow = translateFlowToUIModel(flowWithAllElements);
                store.dispatch(updateFlow(uiFlow));
                await loadDataForProcessType(FLOW_PROCESS_TYPE.FLOW);

                const element = getElementByDevName('decision');
                decisionForPropertyEditor = getElementForPropertyEditor(
                    element
                );
                decisionEditor = createComponentForTest(
                    decisionForPropertyEditor
                );
            });
            it('shows up chevron on fields in LHS', async () => {
                const lhsCombobox = getLHSGroupedCombobox(decisionEditor);
                const accountCreatedByItem = await selectComboboxItemBy(
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
                const accountCreatedByItem = await selectComboboxItemBy(
                    rhsCombobox,
                    'text',
                    ['accountSObjectVariable', 'CreatedBy'],
                    { blur: false }
                );

                expect(accountCreatedByItem.rightIconName).toBe(
                    'utility:chevronright'
                );
            });
            describe('Trigger type is set', () => {
                beforeEach(async () => {
                    uiFlow = translateFlowToUIModel(autoLaunchedFlow);
                    store.dispatch(updateFlow(uiFlow));
                    await loadDataForProcessType(
                        FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW
                    );

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
                    const accountCreatedByItem = await selectComboboxItemBy(
                        lhsCombobox,
                        'text',
                        ['accountVariable', 'CreatedBy'],
                        { blur: false }
                    );

                    expect(accountCreatedByItem).toBeUndefined();

                    const accountCreatedByIdItem = await selectComboboxItemBy(
                        lhsCombobox,
                        'text',
                        ['accountVariable', 'CreatedById'],
                        { blur: false }
                    );

                    expect(accountCreatedByIdItem).toBeDefined();
                    expect(
                        accountCreatedByIdItem.rightIconName
                    ).toBeUndefined();
                });
                it('does not show up chevron on fields in RHS', async () => {
                    const rhsCombobox = getRHSGroupedCombobox(decisionEditor);
                    const accountCreatedByItem = await selectComboboxItemBy(
                        rhsCombobox,
                        'text',
                        ['accountVariable', 'CreatedBy'],
                        { blur: false }
                    );

                    expect(accountCreatedByItem).toBeUndefined();

                    const accountCreatedByIdItem = await selectComboboxItemBy(
                        rhsCombobox,
                        'text',
                        ['accountVariable', 'CreatedById'],
                        { blur: false }
                    );

                    expect(accountCreatedByIdItem).toBeDefined();
                    expect(
                        accountCreatedByIdItem.rightIconName
                    ).toBeUndefined();
                });
            });
        });
        describe('Process type that does not support lookup traversal', () => {
            beforeEach(async () => {
                uiFlow = translateFlowToUIModel(contactRequestFlow);
                store.dispatch(updateFlow(uiFlow));
                await loadDataForProcessType(
                    FLOW_PROCESS_TYPE.CONTACT_REQUEST_FLOW
                );

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
                const accountCreatedByItem = await selectComboboxItemBy(
                    lhsCombobox,
                    'text',
                    ['vMyTestAccount', 'CreatedBy'],
                    { blur: false }
                );

                expect(accountCreatedByItem).toBeUndefined();

                const accountCreatedByIdItem = await selectComboboxItemBy(
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
                const accountCreatedByItem = await selectComboboxItemBy(
                    rhsCombobox,
                    'text',
                    ['vMyTestAccount', 'CreatedBy'],
                    { blur: false }
                );

                expect(accountCreatedByItem).toBeUndefined();

                const accountCreatedByIdItem = await selectComboboxItemBy(
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
});
