import { createElement, unwrap } from 'lwc';
import DecisionEditor from 'builder_platform_interaction-decision-editor';
import { getShadowRoot } from 'lwc-test-utils';
import { getRulesForContext } from 'builder_platform_interaction-rule-lib';
import { mockRules } from 'mock-rule-service';
import { ReorderListEvent } from 'builder_platform_interaction-events';
import { CONDITION_LOGIC } from 'builder_platform_interaction-flow-metadata';

jest.mock('builder_platform_interaction-store-lib', () => {
    const mockStoreLib = require.requireActual('../../../../jest-modules/builder_platform_interaction/store-lib/store-lib-mock.js');
    const originalCreateSelector = require.requireActual('../../store-lib/store-lib.js').createSelector;
    const partialStoreLibMock = Object.assign({}, mockStoreLib);
    partialStoreLibMock.createSelector = originalCreateSelector;

    return partialStoreLibMock;
});

jest.mock('builder_platform_interaction-rule-lib', () => {
    const ruleLib = require.requireActual('builder_platform_interaction-rule-lib');
    const mockRuleLib = Object.assign({}, ruleLib);
    mockRuleLib.getRulesForContext = jest.fn();
    return mockRuleLib;
});

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome',
    VERTICAL_TAB_NAV_ITEM: '.slds-vertical-tabs__nav-item',
    REORDERABLE_NAV: 'builder_platform_interaction-reorderable-vertical-navigation',
    DEFAULT_OUTCOME: 'builder_platform_interaction-label-description.defaultOutcome',
    ADD_BUTTON: 'lightning-button-icon',
    COMBOBOX: 'builder_platform_interaction-combobox',
    LIGHTNING_COMBOBOX: 'lightning-grouped-combobox',
    CONDITION_COMBOBOX: 'lightning-combobox.conditionLogic',
    LABEL_DESCRIPTION_COMPONENT: 'builder_platform_interaction-label-description',
    CONDITION_LIST: 'builder_platform_interaction-condition-list',
    LIST: 'builder_platform_interaction-list',
    ROW: 'builder_platform_interaction-row',
    EXPRESSION_BUILDER: 'builder_platform_interaction-expression-builder',
    LIGHTNING_BUTTON: 'lightning-button',
    LIGHTNING_BUTTON_ICON: 'lightning-button-icon',
    LABEL: '.label',
    DEV_NAME: '.devName',
    LEGEND_TEXT: 'strong',
};


const NEW_DECISION_LABEL = 'New Decision';
const NEW_DECISION_DEV_NAME = 'New_Decision';
const NEW_OUTCOME_LABEL = 'New Outcome';
const NEW_OUTCOME_DEV_NAME = 'New_Outcome';

const outcome1Guid = 'outcome1guid';
const outcome2Guid = 'outcome2guid';

const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

const changeEvent = (value) => {
    return new CustomEvent('change', {
        detail: {
            value
        }
    });
};

const reorderListEvent = new ReorderListEvent(outcome1Guid, outcome2Guid);

const emptyDecision = {
    label: { value: '' },
    name: { value: '' },
    guid: {value: 'decision1'},
    outcomes: [
        {
            guid:'outcome1',
            label: { value: '' },
            name: { value: '' },
            conditionLogic: { value: '' },
            conditions: []
        }
    ]
};

const decisionWithOneOutcome = {
    label: { value: NEW_DECISION_LABEL },
    name: { value: NEW_DECISION_DEV_NAME },
    guid: { value: 'decision2' },
    outcomes: [
        {
            guid: outcome1Guid,
            label: { value: outcome1Guid },
            name: { value: outcome1Guid },
            conditionLogic: { value: 'and' },
            conditions: [
                {
                    leftHandSide: { value: "", error: null },
                    operator: { value: "", error: null },
                    rightHandSide: { value: "", error: null },
                    rightHandSideDataType: { value: "", error: null },
                    rowIndex: "CONDITION_1"
                },
            ]
        }
    ]
};

const  decisionWithOneOutcomeWithTwoConditions = {
    label: { value: NEW_DECISION_LABEL },
    name: { value: NEW_DECISION_DEV_NAME },
    guid: { value: 'decision2' },
    outcomes: [
        {
            guid: outcome1Guid,
            label: { value: outcome1Guid },
            name: { value: outcome1Guid },
            conditionLogic: { value: 'and' },
            conditions: [
                {
                    leftHandSide: { value: "", error: null },
                    operator: { value: "", error: null },
                    rightHandSide: { value: "", error: null },
                    rightHandSideDataType: { value: "", error: null },
                    rowIndex: "CONDITION_1"
                },
                {
                    leftHandSide: { value: "", error: null },
                    operator: { value: "", error: null },
                    rightHandSide: { value: "", error: null },
                    rightHandSideDataType: { value: "", error: null },
                    rowIndex: "CONDITION_2"
                }
            ]
        }
    ]
};

const decisionWithTwoOutcomes = {
    label: { value: NEW_DECISION_LABEL },
    name: { value: NEW_DECISION_DEV_NAME },
    guid: { value: 'decision3' },
    outcomes: [
        {
            guid: outcome1Guid,
            label: { value: outcome1Guid },
            name: { value: outcome1Guid },
            conditionLogic: { value: ''},
            conditions: []
        },
        {
            guid: outcome2Guid,
            label: { value: outcome2Guid },
            name: { value: outcome2Guid },
            conditionLogic: { value: '' },
            conditions: []
        }
    ]
};

beforeAll(() => {
    getRulesForContext.mockReturnValue(mockRules);
});

const createComponentForTest = (node) => {
    const el = createElement('builder_platform_interaction-decision-editor', {
        is: DecisionEditor
    });

    el.node = node;

    document.body.appendChild(el);

    return el;
};

describe('Decision Editor', () => {
    describe('label and description', () => {
        it('Adding name autofills dev name', () => {
            const decisionEditor = createComponentForTest(emptyDecision);
            return Promise.resolve().then(() => {
                const labelInput = getShadowRoot(getShadowRoot(decisionEditor).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT)).querySelector(SELECTORS.LABEL);
                labelInput.mockUserInput(NEW_DECISION_LABEL);
                labelInput.dispatchEvent(focusoutEvent);
                return Promise.resolve().then(() => {
                    expect(decisionEditor.node.label.value).toBe(NEW_DECISION_LABEL);
                    expect(decisionEditor.node.name.value).toBe(NEW_DECISION_DEV_NAME);
                });
            });
        });

        it('Dev name is unchanged if it already exists and name is modified', () => {
            const decisionEditor = createComponentForTest(decisionWithOneOutcome);
            return Promise.resolve().then(() => {
                const newLabel = 'new label';
                const labelInput = getShadowRoot(getShadowRoot(decisionEditor).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT)).querySelector(SELECTORS.LABEL);
                labelInput.mockUserInput(newLabel);
                labelInput.dispatchEvent(focusoutEvent);
                return Promise.resolve().then(() => {
                    expect(decisionEditor.node.label.value).toBe(newLabel);
                    expect(decisionEditor.node.name.value).toBe(NEW_DECISION_DEV_NAME);
                });
            });
        });
    });

    describe('outcome list', () => {
        it('default outcome and detail page are always present', () => {
            const decisionEditor = createComponentForTest(decisionWithOneOutcome);
            return Promise.resolve().then(() => {
                // Initially we have 2 outcomes in left nav (one default) and 1 outcome detail page
                const outcomeDetailPages = getShadowRoot(decisionEditor).querySelectorAll(SELECTORS.OUTCOME);
                expect(outcomeDetailPages).toHaveLength(1);
                const outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
                expect(outcomes).toHaveLength(2);
            });
        });

        it('click on Add Outcome will create a new outcome', () => {
            const decisionEditor = createComponentForTest(decisionWithOneOutcome);
            return Promise.resolve().then(() => {
                const addOutcomeElement = getShadowRoot(decisionEditor).querySelector(SELECTORS.ADD_BUTTON);
                addOutcomeElement.click();
                return Promise.resolve().then(() => {
                    // After click we have 3 outcomes in left nav (one default)
                    // but still just 1 outcome detail page
                    const outcomeDetailPages = getShadowRoot(decisionEditor).querySelectorAll(SELECTORS.OUTCOME);
                    expect(outcomeDetailPages).toHaveLength(1);
                    const outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
                    expect(outcomes).toHaveLength(3);
                });
            });
        });

        it('reorder list sets the correct order of outcomes', () => {
            const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);
            return Promise.resolve().then(() => {
                expect(decisionEditor.getNode().outcomes[0].guid).toBe(outcome1Guid);
                const reorderableNav = getShadowRoot(decisionEditor).querySelector(SELECTORS.REORDERABLE_NAV);
                // fire event to switch order
                reorderableNav.dispatchEvent(reorderListEvent);
                return Promise.resolve().then(() => {
                    expect(decisionEditor.getNode().outcomes[0].guid).toBe(outcome2Guid);
                });
            });
        });
    });

    describe('outcome detail', () => {
        describe('label and description', () => {
            it('Adding name autofills dev name', () => {
                const decisionEditor = createComponentForTest(emptyDecision);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const detailLabelInput = unwrap(getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT)).querySelector(SELECTORS.LABEL);
                    detailLabelInput.mockUserInput(NEW_OUTCOME_LABEL);
                    detailLabelInput.dispatchEvent(focusoutEvent);
                    return Promise.resolve().then(() => {
                        expect(decisionEditor.node.outcomes[0].label.value).toBe(NEW_OUTCOME_LABEL);
                        expect(decisionEditor.node.outcomes[0].name.value).toBe(NEW_OUTCOME_DEV_NAME);
                    });
                });
            });

            it('Dev name is unchanged if it already exists and name is modified', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcome);
                return Promise.resolve().then(() => {
                    const newLabel = 'new outcome label';
                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const detailLabelInput = unwrap(getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.LABEL_DESCRIPTION_COMPONENT)).querySelector(SELECTORS.LABEL);
                    detailLabelInput.mockUserInput(newLabel);
                    detailLabelInput.dispatchEvent(focusoutEvent);
                    return Promise.resolve().then(() => {
                        expect(decisionEditor.node.outcomes[0].label.value).toBe(newLabel);
                        expect(decisionEditor.node.outcomes[0].name.value).toBe(outcome1Guid);
                    });
                });
            });
        });

        describe('add/delete conditions', () => {
            it('add condition', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcome);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const conditionList = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.CONDITION_LIST);
                    const list = getShadowRoot(conditionList).querySelector(SELECTORS.LIST);
                    // Should only have 1 condition in the list
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(1);

                    const button = getShadowRoot(list).querySelector(SELECTORS.LIGHTNING_BUTTON);
                    button.click();
                    // Should have 2 conditions
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(2);
                });
            });

            it('delete is disabled for one condition', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcome);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const conditionList = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.CONDITION_LIST);
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(1);

                    const row = conditionList.querySelector(SELECTORS.ROW);
                    const button = getShadowRoot(row).querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                    expect(button.disabled).toBeTruthy();
                });
            });

            it('delete is clickable and works for 2 or more conditions', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcome);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = decisionEditor.querySelector(SELECTORS.OUTCOME);
                    const list = outcomeDetailPage.querySelector(SELECTORS.LIST);
                    const conditionList = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.CONDITION_LIST);
                    const addConditionButton = getShadowRoot(list).querySelector(SELECTORS.LIGHTNING_BUTTON);
                    addConditionButton.click();
                    expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(2);
                    const row = conditionList.querySelector(SELECTORS.ROW);
                    const deleteButton = getShadowRoot(row).querySelector(SELECTORS.LIGHTNING_BUTTON_ICON);
                    return Promise.resolve().then(() => {
                        expect(deleteButton.disabled).toBeFalsy();

                        // make sure clicking the button deletes the condition
                        deleteButton.click();
                        expect(decisionEditor.getNode().outcomes[0].conditions).toHaveLength(1);
                    });
                });
            });
        });

        describe('logic', () => {
            it('all conditions are met has AND for more than one row', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcomeWithTwoConditions);
                return Promise.resolve().then(() => {
                    expect(decisionEditor.node.outcomes[0].conditionLogic.value).toBe(CONDITION_LOGIC.AND);

                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const conditionList = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.CONDITION_LIST);
                    const row = conditionList.querySelectorAll(SELECTORS.ROW);
                    const legendText = getShadowRoot(row[1]).querySelector(SELECTORS.LEGEND_TEXT).textContent;
                    expect(legendText).toBe('AND');
                });
            });

            it('any condition is met has OR for more than one row', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcomeWithTwoConditions);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = decisionEditor.querySelector(SELECTORS.OUTCOME);
                    const conditionCombobox = outcomeDetailPage.querySelector(SELECTORS.CONDITION_COMBOBOX);

                    const cbChangeEvent = changeEvent(CONDITION_LOGIC.OR);
                    conditionCombobox.dispatchEvent(cbChangeEvent);
                    return Promise.resolve().then(() => {
                        expect(decisionEditor.node.outcomes[0].conditionLogic.value).toBe(CONDITION_LOGIC.OR);
                        const conditionList = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.CONDITION_LIST);
                        const row = conditionList.querySelectorAll(SELECTORS.ROW);
                        const legendText = getShadowRoot(row[1]).querySelector(SELECTORS.LEGEND_TEXT).textContent;
                        expect(legendText).toBe('OR');
                    });
                });
            });

            it('custom condition logic input and shows number for rows', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcomeWithTwoConditions);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = decisionEditor.querySelector(SELECTORS.OUTCOME);
                    const conditionCombobox = outcomeDetailPage.querySelector(SELECTORS.CONDITION_COMBOBOX);

                    const cbChangeEvent = changeEvent(CONDITION_LOGIC.CUSTOM_LOGIC);
                    conditionCombobox.dispatchEvent(cbChangeEvent);
                    return Promise.resolve().then(() => {
                        expect(decisionEditor.node.outcomes[0].conditionLogic.value).toBe('1 AND 2');
                        const conditionList = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.CONDITION_LIST);
                        const row = conditionList.querySelectorAll(SELECTORS.ROW);
                        let legendText = getShadowRoot(row[0]).querySelector(SELECTORS.LEGEND_TEXT).textContent;
                        expect(legendText).toBe('1');
                        legendText = getShadowRoot(row[1]).querySelector(SELECTORS.LEGEND_TEXT).textContent;
                        expect(legendText).toBe('2');
                    });
                });
            });
        });

        describe('default outcome', () => {
            it('no delete outcome button', () => {
                const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);
                return Promise.resolve().then(() => {
                    const outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
                    outcomes[2].querySelector('a').click();
                    return Promise.resolve().then(() => {
                        const deleteOutcomeButton = getShadowRoot(decisionEditor).querySelector(SELECTORS.LIGHTNING_BUTTON);
                        expect(deleteOutcomeButton).toBeNull();
                    });
                });
            });

            it('can update label', () => {
                const decisionEditor = createComponentForTest(emptyDecision);
                return Promise.resolve().then(() => {
                    const outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
                    outcomes[1].querySelector('a').click();
                    return Promise.resolve().then(() => {
                        const labelDescription = getShadowRoot(decisionEditor).querySelector(SELECTORS.DEFAULT_OUTCOME);
                        const defaultOutcomeLabelInput = getShadowRoot(labelDescription).querySelector(SELECTORS.LABEL);
                        const newDefaultOutcomeLabel = 'blah blah blah';
                        defaultOutcomeLabelInput.mockUserInput(newDefaultOutcomeLabel);
                        defaultOutcomeLabelInput.dispatchEvent(focusoutEvent);
                        return Promise.resolve().then(() => {
                            expect(defaultOutcomeLabelInput.value).toBe(newDefaultOutcomeLabel);
                        });
                    });
                });
            });
        });

        describe('delete outcome', () => {
            it('delete outcome button is not present when only one outcome', () => {
                const decisionEditor = createComponentForTest(decisionWithOneOutcome);
                return Promise.resolve().then(() => {
                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const deleteOutcomeButton = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.LIGHTNING_BUTTON);
                    expect(deleteOutcomeButton).toBeNull();
                });
            });

            it('delete outcome available with 2 or more outcomes and works', () => {
                const decisionEditor = createComponentForTest(decisionWithTwoOutcomes);
                return Promise.resolve().then(() => {
                    let outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
                    expect(outcomes).toHaveLength(3);
                    const outcomeDetailPage = getShadowRoot(decisionEditor).querySelector(SELECTORS.OUTCOME);
                    const deleteOutcomeButton = getShadowRoot(outcomeDetailPage).querySelector(SELECTORS.LIGHTNING_BUTTON);
                    expect(deleteOutcomeButton).toBeDefined();
                    deleteOutcomeButton.click();
                    return Promise.resolve().then(() => {
                        outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
                        expect(outcomes).toHaveLength(2);
                    });
                });
            });
        });
    });
});