// @ts-nocheck
import { createElement } from 'lwc';
import DecisionEditor from 'builder_platform_interaction/decisionEditor';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { setupState, resetState, loadFlow } from '../integrationTestUtils';
import { ReorderListEvent } from 'builder_platform_interaction/events';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { resolveRenderCycles } from '../resolveRenderCycles';
import { deepQuerySelector, setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/ruleLib', () => {
    const ruleLib = jest.requireActual('builder_platform_interaction/ruleLib');
    return Object.assign({}, ruleLib);
});

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, sharedUtils, {
        invokeModal: require('builder_platform_interaction/sharedUtils/auraUtils').invokeModal
    });
});

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS,
    LABEL: '.label',
    DEV_NAME: '.devName',
    LEGEND_TEXT: 'strong'
};

const CONDITION_PREFIXES = {
    AND: 'FLOWBUILDERCONDITIONLIST.ANDPREFIXLABEL',
    OR: 'FLOWBUILDERCONDITIONLIST.ORPREFIXLABEL'
};

const NEW_DECISION_LABEL = 'New Decision';
const NEW_DECISION_DEV_NAME = 'New_Decision';
const NEW_OUTCOME_LABEL = 'New Outcome';
const NEW_OUTCOME_DEV_NAME = 'New_Outcome';

const focusoutEvent = new FocusEvent('focusout', {
    bubbles: true,
    cancelable: true
});

const changeEvent = (value) => {
    return new CustomEvent('change', {
        detail: {
            value
        }
    });
};

const emptyDecision = {
    label: { value: '' },
    name: { value: '' },
    guid: { value: 'decision1' },
    outcomes: [
        {
            guid: 'outcome1',
            label: { value: '' },
            name: { value: '' },
            conditionLogic: { value: '' },
            conditions: []
        }
    ]
};

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-decision-editor', {
        is: DecisionEditor
    });

    el.node = node;

    setDocumentBodyChildren(el);

    return el;
};

describe('Decision Editor', () => {
    beforeEach(async () => {
        await loadFlow(flowWithAllElements, store);
        const element = getElementByDevName('decision');
        decisionForPropertyEditor = getElementForPropertyEditor(element);
        decisionEditor = createComponentForTest(decisionForPropertyEditor);
    });
    let decisionForPropertyEditor, decisionEditor, store;
    beforeAll(() => {
        store = setupState();
    });
    afterAll(() => {
        resetState();
    });
    describe('label and description', () => {
        it('Adding name autofills dev name', () => {
            const newDecisionEditor = createComponentForTest(emptyDecision);
            return resolveRenderCycles(() => {
                const labelInput = newDecisionEditor.shadowRoot
                    .querySelector(SELECTORS.LABEL_DESCRIPTION)
                    .shadowRoot.querySelector(SELECTORS.LABEL);
                labelInput.value = NEW_DECISION_LABEL;
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(newDecisionEditor.node.label.value).toBe(NEW_DECISION_LABEL);
                    expect(newDecisionEditor.node.name.value).toBe(NEW_DECISION_DEV_NAME);
                });
            });
        });

        it('Dev name is unchanged if it already exists and name is modified', () => {
            return resolveRenderCycles(() => {
                const newLabel = 'new label';
                const labelInput = decisionEditor.shadowRoot
                    .querySelector(SELECTORS.LABEL_DESCRIPTION)
                    .shadowRoot.querySelector(SELECTORS.LABEL);
                labelInput.value = newLabel;
                labelInput.dispatchEvent(focusoutEvent);
                return resolveRenderCycles(() => {
                    expect(decisionEditor.node.label.value).toBe(newLabel);
                    expect(decisionEditor.node.name.value).toBe('decision');
                });
            });
        });
    });

    describe('outcome list', () => {
        it('default outcome and detail page are always present', () => {
            return resolveRenderCycles(() => {
                // Initially we have 2 outcomes in left nav (one default) and 1 outcome detail page
                const outcomeDetailPages = decisionEditor.shadowRoot.querySelectorAll(SELECTORS.OUTCOME);
                expect(outcomeDetailPages).toHaveLength(1);
                const navigation = decisionEditor.shadowRoot.querySelector(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION);
                const outcomes = navigation.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
                expect(outcomes).toHaveLength(2);
            });
        });

        it('click on Add Outcome will create a new outcome', async () => {
            return resolveRenderCycles(async () => {
                const addOutcomeElement = decisionEditor.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                addOutcomeElement.click();
                await ticks(1);
                // After click we have 3 outcomes in left nav (one default)
                // but still just 1 outcome detail page
                const outcomeDetailPages = decisionEditor.shadowRoot.querySelectorAll(SELECTORS.OUTCOME);
                expect(outcomeDetailPages).toHaveLength(1);
                const navigation = decisionEditor.shadowRoot.querySelector(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION);
                const outcomes = navigation.shadowRoot.querySelectorAll(SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM);
                expect(outcomes).toHaveLength(3);
            });
        });

        it('reorder list sets the correct order of outcomes', () => {
            const element = getElementByDevName('decisionWithTwoOutComes');
            decisionForPropertyEditor = getElementForPropertyEditor(element);
            decisionEditor = createComponentForTest(decisionForPropertyEditor);
            return resolveRenderCycles(() => {
                const outcome1Id = decisionEditor.getNode().outcomes[0].guid;
                const outcome2Id = decisionEditor.getNode().outcomes[1].guid;

                const reorderableNav = decisionEditor.shadowRoot.querySelector(
                    SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                );
                // fire event to switch order
                const reorderListEvent = new ReorderListEvent(outcome1Id, outcome2Id);
                reorderableNav.dispatchEvent(reorderListEvent);
                return resolveRenderCycles(() => {
                    expect(decisionEditor.getNode().outcomes[1].guid).toBe(outcome1Id);
                });
            });
        });
    });

    describe('outcome detail', () => {
        describe('label and description', () => {
            it('Adding name autofills dev name', () => {
                const decisionEditor = createComponentForTest(emptyDecision);
                return resolveRenderCycles(() => {
                    const detailLabelInput = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.LABEL_DESCRIPTION,
                        SELECTORS.LABEL
                    ]);
                    detailLabelInput.value = NEW_OUTCOME_LABEL;
                    detailLabelInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(decisionEditor.node.outcomes[0].label.value).toBe(NEW_OUTCOME_LABEL);
                        expect(decisionEditor.node.outcomes[0].name.value).toBe(NEW_OUTCOME_DEV_NAME);
                    });
                });
            });

            it('Dev name is unchanged if it already exists and name is modified', () => {
                return resolveRenderCycles(() => {
                    const newLabel = 'new outcome label';
                    const originalApiName = 'outcome';
                    const detailLabelInput = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.LABEL_DESCRIPTION,
                        SELECTORS.LABEL
                    ]);

                    detailLabelInput.value = newLabel;
                    detailLabelInput.dispatchEvent(focusoutEvent);
                    return resolveRenderCycles(() => {
                        expect(decisionEditor.node.outcomes[0].label.value).toBe(newLabel);
                        expect(decisionEditor.node.outcomes[0].name.value).toBe(originalApiName);
                    });
                });
            });
        });

        describe('add/delete conditions', () => {
            it('add condition', () => {
                return resolveRenderCycles(() => {
                    const list = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST,
                        SELECTORS.LIST
                    ]);
                    // Should only have 1 condition in the list
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(1);

                    const button = list.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON);
                    button.click();
                    // Should have 2 conditions
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(2);
                });
            });

            it('delete is disabled for one condition', () => {
                return resolveRenderCycles(() => {
                    const conditionList = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST
                    ]);
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(1);
                    const row = conditionList.querySelector(SELECTORS.ROW);
                    const button = row.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                    expect(button.disabled).toBeTruthy();
                });
            });

            it('delete is clickable and works for 2 or more conditions', () => {
                return resolveRenderCycles(() => {
                    const conditionList = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST
                    ]);
                    const list = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST,
                        SELECTORS.LIST
                    ]);
                    const addConditionButton = list.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON);
                    addConditionButton.click();
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(2);
                    const row = conditionList.querySelector(SELECTORS.ROW);
                    const deleteButton = row.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                    return resolveRenderCycles(() => {
                        expect(deleteButton.disabled).toBeFalsy();

                        // make sure clicking the button deletes the condition
                        deleteButton.click();
                        expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(1);
                    });
                });
            });
        });

        describe('logic', () => {
            beforeEach(async () => {
                await loadFlow(flowWithAllElements, store);
                const element = getElementByDevName('decisionWithOneOutcomeWithTwoConditions');
                decisionForPropertyEditor = getElementForPropertyEditor(element);
                decisionEditor = createComponentForTest(decisionForPropertyEditor);
            });
            it('all conditions are met has AND for more than one row', () => {
                return resolveRenderCycles(() => {
                    expect(decisionEditor.node.outcomes[0].conditionLogic.value).toBe(CONDITION_LOGIC.AND);

                    const conditionList = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST
                    ]);

                    const row = conditionList.querySelectorAll(SELECTORS.ROW);
                    const legendText = row[1].shadowRoot.querySelector(SELECTORS.LEGEND_TEXT).textContent;
                    expect(legendText).toBe(CONDITION_PREFIXES.AND);
                });
            });

            it('any condition is met has OR for more than one row', () => {
                return resolveRenderCycles(() => {
                    const conditionList = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST
                    ]);
                    const conditionCombobox = conditionList.shadowRoot.querySelector(
                        SELECTORS.LIGHTNING_CONDITION_COMBOBOX
                    );

                    const cbChangeEvent = changeEvent(CONDITION_LOGIC.OR);
                    conditionCombobox.dispatchEvent(cbChangeEvent);
                    return resolveRenderCycles(() => {
                        expect(decisionEditor.node.outcomes[0].conditionLogic.value).toBe(CONDITION_LOGIC.OR);
                        const row = conditionList.querySelectorAll(SELECTORS.ROW);
                        const legendText = row[1].shadowRoot.querySelector(SELECTORS.LEGEND_TEXT).textContent;
                        expect(legendText).toBe(CONDITION_PREFIXES.OR);
                    });
                });
            });

            it('custom condition logic input and shows number for rows', () => {
                return resolveRenderCycles(() => {
                    const conditionList = deepQuerySelector(decisionEditor, [
                        SELECTORS.OUTCOME,
                        SELECTORS.CONDITION_LIST
                    ]);
                    const conditionCombobox = conditionList.shadowRoot.querySelector(
                        SELECTORS.LIGHTNING_CONDITION_COMBOBOX
                    );

                    const cbChangeEvent = changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC);
                    conditionCombobox.dispatchEvent(cbChangeEvent);
                    return resolveRenderCycles(() => {
                        expect(decisionEditor.node.outcomes[0].conditionLogic.value).toBe('1 AND 2');
                        const row = conditionList.querySelectorAll(SELECTORS.ROW);
                        let legendText = row[0].shadowRoot.querySelector(SELECTORS.LEGEND_TEXT).textContent;
                        expect(legendText).toBe('1');
                        legendText = row[1].shadowRoot.querySelector(SELECTORS.LEGEND_TEXT).textContent;
                        expect(legendText).toBe('2');
                    });
                });
            });
        });

        describe('default outcome', () => {
            it('no delete outcome button', () => {
                return resolveRenderCycles(() => {
                    const navigation = decisionEditor.shadowRoot.querySelector(
                        SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                    );
                    const outcomes = navigation.shadowRoot.querySelectorAll(
                        SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM
                    );
                    outcomes[1].shadowRoot.querySelector('.slds-vertical-tabs__link').click();
                    return resolveRenderCycles(() => {
                        const deleteOutcomeButton = decisionEditor.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON);
                        expect(deleteOutcomeButton).toBeNull();
                    });
                });
            });

            it('can update label', () => {
                return resolveRenderCycles(() => {
                    const navigation = decisionEditor.shadowRoot.querySelector(
                        SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                    );
                    const outcomes = navigation.shadowRoot.querySelectorAll(
                        SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM
                    );
                    outcomes[1].shadowRoot.querySelector('.slds-vertical-tabs__link').click();
                    return resolveRenderCycles(() => {
                        const labelDescription = decisionEditor.shadowRoot.querySelector(SELECTORS.DEFAULT_OUTCOME);
                        const defaultOutcomeLabelInput = labelDescription.shadowRoot.querySelector(SELECTORS.LABEL);
                        const newDefaultOutcomeLabel = 'newDefaultOutcomeLabel';
                        defaultOutcomeLabelInput.value = newDefaultOutcomeLabel;

                        defaultOutcomeLabelInput.dispatchEvent(focusoutEvent);
                        return resolveRenderCycles(() => {
                            expect(defaultOutcomeLabelInput.value).toBe(newDefaultOutcomeLabel);
                        });
                    });
                });
            });
        });

        describe('delete outcome', () => {
            it('delete outcome button is not present when only one outcome', () => {
                return resolveRenderCycles(() => {
                    const outcomeDetailPage = decisionEditor.shadowRoot.querySelector(SELECTORS.OUTCOME);
                    const deleteOutcomeButton = outcomeDetailPage.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON);
                    expect(deleteOutcomeButton).toBeNull();
                });
            });

            it('delete outcome available with 2 or more outcomes and works', () => {
                const addOutcomeElement = decisionEditor.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                addOutcomeElement.click();
                return resolveRenderCycles(() => {
                    const navigation = decisionEditor.shadowRoot.querySelector(
                        SELECTORS.REORDERABLE_VERTICAL_NAVIGATION
                    );
                    const outcomes = navigation.shadowRoot.querySelectorAll(
                        SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM
                    );
                    expect(outcomes).toHaveLength(3);
                    const outcomeDetailPage = decisionEditor.shadowRoot.querySelector(SELECTORS.OUTCOME);
                    const deleteOutcomeButton = outcomeDetailPage.shadowRoot.querySelector(SELECTORS.LIGHTNING_BUTTON);
                    expect(deleteOutcomeButton).toBeDefined();
                    deleteOutcomeButton.click();
                    return resolveRenderCycles(() => {
                        const outcomesAfterDelete = navigation.shadowRoot.querySelectorAll(
                            SELECTORS.REORDERABLE_VERTICAL_NAVIGATION_ITEM
                        );
                        expect(outcomesAfterDelete).toHaveLength(2);
                    });
                });
            });
        });
    });
});
