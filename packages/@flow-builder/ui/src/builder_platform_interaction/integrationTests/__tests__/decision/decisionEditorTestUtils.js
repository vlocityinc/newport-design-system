import { createElement } from 'lwc';
import DecisionEditor from 'builder_platform_interaction/decisionEditor';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

const SELECTORS = {
    ...LIGHTNING_COMPONENTS_SELECTORS,
    ...INTERACTION_COMPONENTS_SELECTORS
};

export const createComponentForTest = node => {
    const el = createElement('builder_platform_interaction-decision-editor', {
        is: DecisionEditor
    });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

export const getList = decision => {
    return deepQuerySelector(decision, [SELECTORS.OUTCOME, SELECTORS.CONDITION_LIST, SELECTORS.LIST]);
};

export const getRow = decision => {
    return getList(decision)
        .querySelector(' div > slot')
        .assignedNodes()[0]
        .querySelector(SELECTORS.ROW);
};

export const getFerToFerovExpressionBuilder = decision => {
    return getRow(decision)
        .shadowRoot.querySelector(' div > slot')
        .assignedNodes()[0]
        .querySelector(SELECTORS.FER_TO_FEROV_EXPRESSION_BUILDER);
};
