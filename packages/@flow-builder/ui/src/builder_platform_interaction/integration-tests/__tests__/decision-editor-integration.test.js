import {createElement} from 'engine';
import DecisionEditor from 'builder_platform_interaction-decision-editor';
import { getShadowRoot } from 'lwc-test-utils';

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome',
    VERTICAL_TAB_NAV_ITEM: '.slds-vertical-tabs__nav-item',
    REORDERABLE_NAV: 'builder_platform_interaction-reorderable-vertical-navigation',
    DEFAULT_OUTCOME: 'builder_platform_interaction-label-description.defaultOutcome',
    ADD_BUTTON: 'lightning-button-icon'
};

let decisionWithOneOutcome;

beforeEach(() => {
    decisionWithOneOutcome = {
        label: {value: 'Test Name of the Decision'},
        name: {value: 'Test Dev Name'},
        guid: {value: 'decision2'},
        outcomes: [
            {
                guid: 'outcome1',
                label: { value: ''},
                conditionLogic: { value: ''},
                conditions: []
            }
        ]
    };
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
    it('click on Add Outcome will create a new outcome', () => {
        const decisionEditor = createComponentForTest(decisionWithOneOutcome);
        // Initially we have 2 outcomes in left nav (one default) and 1 outcome detail page
        let outcomeDetailPages = getShadowRoot(decisionEditor).querySelectorAll(SELECTORS.OUTCOME);
        expect(outcomeDetailPages).toHaveLength(1);
        let outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
        expect(outcomes).toHaveLength(2);

        const addOutcomeElement = getShadowRoot(decisionEditor).querySelector(SELECTORS.ADD_BUTTON);
        addOutcomeElement.click();

        return Promise.resolve().then(() => {
            // After click we have 3 outcomes in left nav (one default)
            // but still just 1 outcome detail page
            outcomeDetailPages = getShadowRoot(decisionEditor).querySelectorAll(SELECTORS.OUTCOME);
            expect(outcomeDetailPages).toHaveLength(1);
            outcomes = decisionEditor.querySelectorAll(SELECTORS.VERTICAL_TAB_NAV_ITEM);
            expect(outcomes).toHaveLength(3);
        });
    });
});