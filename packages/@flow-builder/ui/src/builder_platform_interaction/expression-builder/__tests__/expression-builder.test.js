import { createElement } from 'engine';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import ExpressionBuilder from '../expression-builder.js';
import { RowContentsChangedEvent, ValueChangedEvent } from 'builder_platform_interaction-events';
import { numberVariableGuid, numberVariableDevName } from 'mock-store-data';
import { getLHSTypes, getOperators, getRHSTypes  } from 'builder_platform_interaction-rule-lib';
import { EXPRESSION_PROPERTY_TYPE, getElementsForMenuData } from 'builder_platform_interaction-expression-utils';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-expression-builder', { is: ExpressionBuilder });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
}

function createMockPopulatedExpression() {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: numberVariableGuid,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: 'Assign',
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: numberVariableGuid,
        }
    };
}

// returns the dev name to a combobox value with curly brace bang
function devNameToComboboxValue(val) {
    return '{!' + val + '}';
}

function createDefaultComponentForTest() {
    const expressionBuilder = createComponentForTest({
        expression: createMockPopulatedExpression(),
        showoperator: true
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

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        getLHSTypes: jest.fn(),
        getOperators: jest.fn().mockImplementation(() => {
            return ['Assign', 'Add'];
        }),
        getRHSTypes: jest.fn(),
        transformOperatorsForCombobox: jest.fn().mockReturnValue([]),
        getRulesForElementType: jest.fn().mockReturnValue([]),
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue([]),
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction-expression-utils').EXPRESSION_PROPERTY_TYPE,
    };
});

describe('expression-builder', () => {
    const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
    describe('showing or hiding the operator', () => {
        it('should show the operator when showOperator is true', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const ourComboboxes = getComboboxElements(expressionBuilder);
            const operator = getLightningCombobox(expressionBuilder);

            expect(ourComboboxes).toHaveLength(2);
            expect(operator).toBeDefined();
        });
        it('should not show the operator when showOperator is false', () => {
            const expressionBuilder = createComponentForTest({
                item: createMockPopulatedExpression(),
                showOperator: false
            });

            const ourComboboxes = getComboboxElements(expressionBuilder);
            const operator = getLightningCombobox(expressionBuilder);

            expect(ourComboboxes).toHaveLength(2);
            expect(operator).toBeNull();
        });
    });

    describe('label sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${labels[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    item: createMockPopulatedExpression(),
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
    describe('building expression from existing item', () => {
        it('should populate the lhs menu data', () => {
            const expressionBuilder = createDefaultComponentForTest();
            expressionBuilder.elementType = 'ASSIGNMENT';
            return Promise.resolve().then(() => {
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                expect(getLHSTypes).toHaveBeenCalled();
                expect(getElementsForMenuData).toHaveBeenCalled();
                expect(lhsCombobox.menuData).toBeDefined();
            });
        });

        it('should populate operator menu if LHS is set', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const operatorCombobox = getLightningCombobox(expressionBuilder);
            expect(getOperators).toHaveBeenCalled();
            expect(operatorCombobox.options).toBeDefined();
        });

        it('should populate rhs menu data', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(getRHSTypes).toHaveBeenCalled();
            expect(rhsCombobox.menuData).toBeDefined();
        });

        it('should populate the expression builder with values from the store', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const comboboxes = getComboboxElements(expressionBuilder);
            const lhsCombobox = comboboxes[0];
            const operatorCombobox = getLightningCombobox(expressionBuilder);
            const rhsCombobox = comboboxes[1];
            expect(lhsCombobox.value).toEqual(devNameToComboboxValue(numberVariableDevName));
            expect(operatorCombobox.value).toEqual('Assign');
            expect(rhsCombobox.value).toEqual(devNameToComboboxValue(numberVariableDevName));
        });
    });
});
