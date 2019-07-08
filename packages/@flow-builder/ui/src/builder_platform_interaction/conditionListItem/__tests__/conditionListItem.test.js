import { createElement } from 'lwc';
import { DeleteListItemEvent } from 'builder_platform_interaction/events';
import ConditionListItem from 'builder_platform_interaction/conditionListItem';
import {
    formatLhs,
    formatOperator,
    formatRhs
} from 'builder_platform_interaction/conditionListItemUtil';

const createComponentUnderTest = (lhs, op, rhs) => {
    const el = createElement('builder_platform_interaction-conditionListItem', {
        is: ConditionListItem
    });
    el.condition = {
        leftHandSide: { value: lhs, error: '' },
        operator: { value: op, error: '' },
        rightHandSide: { value: rhs, error: '' }
    };
    document.body.appendChild(el);
    return el;
};

const selectors = {
    trash: 'lightning-button-icon',
    lhs: 'div.slds-col.slds-size_5-of-6 > span:nth-child(1)',
    op: 'div.slds-col.slds-size_5-of-6 > span:nth-child(2)',
    rhs: 'div.slds-col.slds-size_5-of-6 > span:nth-child(3)'
};

jest.mock('builder_platform_interaction/conditionListItemUtil', () => ({
    formatLhs: jest.fn(),
    formatOperator: jest.fn(),
    formatRhs: jest.fn()
}));

describe('conditionListItem delete', () => {
    it('Checks if conditionListItem delete event is dispatched when trash is clicked', () => {
        const itemComponent = createComponentUnderTest(null, null, null);

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            itemComponent.addEventListener(
                DeleteListItemEvent.EVENT_NAME,
                callback
            );
            itemComponent.shadowRoot.querySelector(selectors.trash).click();
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('condition', () => {
    it('condition values is set when passed in as attribute', () => {
        const expectedLhsValue = '{!displaytext.testText}';
        const expectedRhsValue = '{!GlobalConstant.False}';
        const lhs = 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e4.testText';
        const op = 'equals';
        const rhs = '{!$GlobalConstant.False}';
        const lhsformatMock = {
            displayText: '{!displaytext.testText}',
            dataType: 'object'
        };

        formatLhs.mockReturnValue(lhsformatMock);
        formatOperator.mockReturnValue(op);
        formatRhs.mockReturnValue(rhs.replace('$', ''));
        const itemComponent = createComponentUnderTest(lhs, op, rhs);

        return Promise.resolve().then(() => {
            const lhsSelector = itemComponent.shadowRoot.querySelector(
                selectors.lhs
            );
            const opSelector = itemComponent.shadowRoot.querySelector(
                selectors.op
            );
            const rhsSelector = itemComponent.shadowRoot.querySelector(
                selectors.rhs
            );

            expect(lhsSelector.textContent.trim()).toEqual(expectedLhsValue);
            expect(opSelector.textContent.trim()).toEqual(op);
            expect(rhsSelector.textContent.trim()).toEqual(expectedRhsValue);
        });
    });
});
