import { createElement } from 'engine';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import ExpressionBuilder from '../expression-builder.js';
import { RowContentsChangedEvent, ComboboxValueChangedEvent } from 'builder_platform_interaction-events';
import { numberVariableGuid, numberVariableDevName, elements } from 'mock-store-data';
import { getLHSTypes, getOperators, getRHSTypes } from 'builder_platform_interaction-rule-lib';
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
            value: '{!' + numberVariableDevName + '}',
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: 'reference'
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: {
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
        showOperator: true,
        expression: createMockPopulatedExpression(),
    });
    return expressionBuilder;
}

function getComboboxElements(expressionBuilder) {
    return expressionBuilder.querySelectorAll("builder_platform_interaction-combobox");
}

function getLightningCombobox(expressionBuilder) {
    return expressionBuilder.querySelector("lightning-combobox");
}

const CBreturnItem = {
    value: elements[numberVariableGuid].guid,
    displayText: '{!' + elements[numberVariableGuid].name + '}'
};

const ourCBChangeEvent = new ComboboxValueChangedEvent(CBreturnItem);

const newCBValue = numberVariableGuid;

const lightningCBChangeEvent = new CustomEvent('change', {
    detail: {
        value: newCBValue
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
        getRulesForContext: jest.fn().mockReturnValue([]),
        elementToParam: require.requireActual('builder_platform_interaction-rule-lib').elementToParam,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue([]),
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction-expression-utils').EXPRESSION_PROPERTY_TYPE,
        normalizeLHS: require.requireActual('builder_platform_interaction-expression-utils').normalizeLHS,
        normalizeRHS: require.requireActual('builder_platform_interaction-expression-utils').normalizeRHS,
        retrieveRHSVal: require.requireActual('builder_platform_interaction-expression-utils').retrieveRHSVal,
        getElementByGuid: require.requireActual('builder_platform_interaction-store-utils').getElementByGuid,
        isElementAllowed: require.requireActual('builder_platform_interaction-expression-utils').isElementAllowed,
        sanitizeGuid: require.requireActual('builder_platform_interaction-expression-utils').sanitizeGuid,
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
                expression: createMockPopulatedExpression(),
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
                    expression: createMockPopulatedExpression(),
                    lhsLabel: "LHS",
                    operatorLabel: "operator",
                    rhsLabel: "RHS"
                });
                expect(expressionBuilder[labels[i]]).toBeDefined();
            });
        }
    });

    describe('handling value change events from combobox', () => {
        it('should throw RowContentsChangedEvent with all 4 properties when LHS value changes', () => {
            const expressionBuilder = createDefaultComponentForTest();

            return Promise.resolve().then(() => {
                const newExpression = createMockPopulatedExpression();
                newExpression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE] = {value: numberVariableGuid, error: null};
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: newExpression}});
            });
        });
        it('should throw RowContentsChangedEvent with all 4 properties when operator changes', () => {
            const expressionBuilder = createDefaultComponentForTest();
            return Promise.resolve().then(() => {
                const newExpression = createMockPopulatedExpression();
                newExpression[EXPRESSION_PROPERTY_TYPE.OPERATOR] = {value: newCBValue};
                const operatorCombobox = getLightningCombobox(expressionBuilder);

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                operatorCombobox.dispatchEvent(lightningCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: newExpression}});
            });
        });
        it('should throw RowContentsChangedEvent with all 4 properties when RHS changes', () => {
            const expressionBuilder = createDefaultComponentForTest();

            return Promise.resolve().then(() => {
                const newExpression = createMockPopulatedExpression();
                newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = {value: devNameToComboboxValue(numberVariableDevName), error: null};
                newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID] = {value: numberVariableGuid, error: null};
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];

                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);

                rhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {newValue: newExpression}});
            });
        });
    });
    describe('building expression from existing item', () => {
        it('should populate the lhs menu data', () => {
            const expressionBuilder = createDefaultComponentForTest();
            expressionBuilder.configuration = {elementType: 'ASSIGNMENT'};
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
            expect(lhsCombobox.displayText).toEqual(devNameToComboboxValue(numberVariableDevName));
            expect(operatorCombobox.value).toEqual('Assign');
            expect(rhsCombobox.displayText).toEqual(devNameToComboboxValue(numberVariableDevName));
        });
    });
});
