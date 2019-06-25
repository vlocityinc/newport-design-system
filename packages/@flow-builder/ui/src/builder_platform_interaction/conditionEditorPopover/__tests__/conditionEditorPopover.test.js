import { createElement } from 'lwc';
import ConditionEditorPopover from 'builder_platform_interaction/conditionEditorPopover';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { RULE_OPERATOR } from 'builder_platform_interaction/ruleLib';

import { numberVariableGuid } from 'mock/storeData';

jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder')
);

function createMockPopulatedExpression() {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: numberVariableGuid,
            error: null
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: RULE_OPERATOR.ASSIGN,
            error: null
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: numberVariableGuid,
            error: null
        }
    };
}

const NEW_CONDITION = {
    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
        value: '',
        error: ''
    },
    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
        value: RULE_OPERATOR.ASSIGN,
        error: null
    },
    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
        value: '',
        error: null
    }
};

const CONDITION = createMockPopulatedExpression();

const selectors = {
    doneButton: 'lightning-button'
};

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-condition-editor-popover',
        {
            is: ConditionEditorPopover
        }
    );

    Object.assign(
        el,
        props || {
            condition: CONDITION
        }
    );

    document.body.appendChild(el);
    return el;
};

describe('Condition Editor Popover', () => {
    it('when click with valid condition, handle done callback is invoked', () => {
        const handleDone = jest.fn();

        const element = createComponentUnderTest({
            condition: CONDITION,
            handleDone
        });

        const doneButton = element.shadowRoot.querySelector(
            selectors.doneButton
        );

        doneButton.click();

        expect(handleDone).toHaveBeenCalled();
    });

    it('when click with invalid condition, handle done callback is not invoked', () => {
        const handleDone = jest.fn();

        const element = createComponentUnderTest({
            condition: NEW_CONDITION,
            handleDone
        });

        const doneButton = element.shadowRoot.querySelector(
            selectors.doneButton
        );

        doneButton.click();

        expect(handleDone).not.toHaveBeenCalled();
    });
});
