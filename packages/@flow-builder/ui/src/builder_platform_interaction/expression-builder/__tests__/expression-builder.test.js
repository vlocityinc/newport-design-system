import { createElement } from 'engine';
import ExpressionBuilder from 'builder_platform_interaction-expression-builder';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-constant';
import { RowContentsChangedEvent } from 'builder_platform_interaction-events-rowContentsChangedEvent';
import { ValueChangedEvent } from 'builder_platform_interaction-events-ValueChangedEvent';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-expression-builder', { is: ExpressionBuilder });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
}

const lhsId = "lhs";
const operatorId = "op";
const rhsId = "rhs";
const comboBoxError = "This is required";
const menuDataObject = "menuData";
const comboBoxValue = "FEROV";

function createMockPopulatedItem() {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            comboBoxValue: lhsId + comboBoxValue,
            menuData: lhsId + menuDataObject,
            error: lhsId + comboBoxError
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            comboBoxValue: operatorId + comboBoxValue,
            menuData: operatorId + menuDataObject,
            error: operatorId + comboBoxError
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            comboBoxValue: rhsId + comboBoxValue,
            menuData: rhsId + menuDataObject,
            error: rhsId + comboBoxError
        }
    };
}

function createDefaultComponentForTest() {
    const expressionBuilder = createComponentForTest({
        item: createMockPopulatedItem(),
        showOperator: true
    });
    return expressionBuilder;
}

function getComboboxElements(expressionBuilder) {
    return expressionBuilder.querySelectorAll("builder_platform_interaction-combobox");
}

function getLightningCombobox(expressionBuilder) {
    return expressionBuilder.querySelector("lightning-combobox");
}

const ourCBChangeEvent = new ValueChangedEvent('hi');

const lightningCBChangeEvent = new CustomEvent('change', {
    detail: {
        value: 'hi'
    }
});

describe('expression-builder', () => {
    const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
    describe('showing or hiding the operator', () => {
        it('should show the operator when showOperator is true', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const ourComboboxes = getComboboxElements(expressionBuilder);
            const operator = getLightningCombobox(expressionBuilder);

            expect(ourComboboxes.length).toEqual(2);
            expect(operator).toBeDefined();
        });
        it('should not show the operator when showOperator is false', () => {
            const expressionBuilder = createComponentForTest({
                item: createMockPopulatedItem(),
                showOperator: false
            });

            const ourComboboxes = getComboboxElements(expressionBuilder);
            const operator = getLightningCombobox(expressionBuilder);

            expect(ourComboboxes.length).toEqual(2);
            expect(operator).toBeNull();
        });
    });

    describe('label sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${labels[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    item: createMockPopulatedItem(),
                    lhsLabel: "LHS",
                    operatorLabel: "operator",
                    rhsLabel: "RHS"
                });
                expect(expressionBuilder[labels[i]]).toBeDefined();
            });
        }
    });

    describe('handling value change events from combobox', () => {
        it('should throw RowContentsChangedEvent when LHS value changes', () => {
            const expressionBuilder = createDefaultComponentForTest();

            return Promise.resolve().then(() => {
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyChanged: EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE, newValue: 'hi'}});
            });
        });
        it('should throw RowContentsChangedEvent when operator changes', () => {
            const expressionBuilder = createDefaultComponentForTest();
            return Promise.resolve().then(() => {
                const operatorCombobox = getLightningCombobox(expressionBuilder);

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                operatorCombobox.dispatchEvent(lightningCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyChanged: EXPRESSION_PROPERTY_TYPE.OPERATOR, newValue: 'hi'}});
            });
        });
        it('should throw RowContentsChangedEvent when RHS changes', () => {
            const expressionBuilder = createDefaultComponentForTest();

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                rhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyChanged: EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE, newValue: 'hi'}});
            });
        });
    });
});
