import { createElement } from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import ExpressionBuilder from '../expression-builder.js';
import { RowContentsChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction-events';
import { numberVariableGuid, numberVariableDevName, stringVariableGuid, stringVariableDevName, dateVariableGuid, currencyVariableGuid, assignmentElementGuid, elements } from 'mock-store-data';
import { getLHSTypes, getOperators, getRHSTypes } from 'builder_platform_interaction-rule-lib';
import { EXPRESSION_PROPERTY_TYPE, getElementsForMenuData, OPERATOR_DISPLAY_OPTION } from 'builder_platform_interaction-expression-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { mockAccountFields } from 'mock-server-entity-data';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import genericErrorMessage from '@label/FlowBuilderCombobox.genericErrorMessage';
import numberErrorMessage from '@label/FlowBuilderCombobox.numberErrorMessage';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-expression-builder', { is: ExpressionBuilder });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
}

function createBlankExpression() {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: '',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: '',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: '',
            error: null,
        },
    };
}

function createMockEmptyRHSExpression(lhsValue, wasVisited = false) {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: lhsValue,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: wasVisited ? 'wasVisited' : 'Assign',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: '',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: '',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: {
            value: '',
            error: null,
        }
    };
}

function createMockPopulatedExpression() {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: numberVariableGuid,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: 'Assign',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: '{!' + numberVariableDevName + '}',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: 'reference',
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: {
            value: numberVariableGuid,
            error: null,
        }
    };
}

// returns the dev name to a combobox value with curly brace bang
function devNameToComboboxValue(val) {
    return '{!' + val + '}';
}

function createDefaultComponentForTest(operator = OPERATOR_DISPLAY_OPTION.COMBOBOX) {
    const expressionBuilder = createComponentForTest({
        expression: createMockPopulatedExpression(),
        operatorDisplayOption: operator,
    });
    return expressionBuilder;
}

function getComboboxElements(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelectorAll("builder_platform_interaction-combobox");
}

function getLightningCombobox(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelector("lightning-combobox");
}

function getOperatorIcon(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelector("lightning-icon");
}

function checkOperatorAndRHSDisabled(expressionBuilder, expected) {
    const operatorCombobox = getLightningCombobox(expressionBuilder);
    expect(operatorCombobox.disabled).toBe(expected);
    const rhsCombobox = getComboboxElements(expressionBuilder)[1];
    expect(rhsCombobox.disabled).toBe(expected);
}

const CBreturnItem = {
    value: elements[numberVariableGuid].guid,
    displayText: '{!' + elements[numberVariableGuid].name + '}'
};

const ourCBChangeEvent = new ComboboxStateChangedEvent(CBreturnItem);

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
        filterFieldsForChosenElement: require.requireActual('builder_platform_interaction-expression-utils').filterFieldsForChosenElement,
        OPERATOR_DISPLAY_OPTION: require.requireActual('builder_platform_interaction-expression-utils').OPERATOR_DISPLAY_OPTION,
    };
});

describe('expression-builder', () => {
    const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
    const placeholders = ['lhsPlaceholder', 'operatorPlaceholder', 'rhsPlaceholder'];

    const icons = [OPERATOR_DISPLAY_OPTION.LEFT_ARROW, OPERATOR_DISPLAY_OPTION.RIGHT_ARROW];

    describe('showing or hiding the operator and arrows', () => {
        it('should show the operator by default', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const ourComboboxes = getComboboxElements(expressionBuilder);
            const operator = getLightningCombobox(expressionBuilder);

            expect(ourComboboxes).toHaveLength(2);
            expect(operator).toBeDefined();
        });
        for (let i = 0; i < 2; i++) {
            it(`when passed ${icons[i]}, should show the icon and not the operator`, () => {
                const expressionBuilder = createDefaultComponentForTest(icons[i]);
                const operator = getLightningCombobox(expressionBuilder);
                const icon = getOperatorIcon(expressionBuilder);

                expect(operator).toBeFalsy();
                expect(icon).toBeDefined();
                expect(icon.iconName).toBe(icons[i]);
            });
        }
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

    describe('placeholder sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${placeholders[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    expression: createMockPopulatedExpression(),
                    lhsPlaceholder: "LHS",
                    operatorPlaceholder: "operator",
                    rhsPlaceholder: "RHS"
                });
                expect(expressionBuilder[placeholders[i]]).toBeDefined();
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

        describe('Validation', () => {
            it('Invalid LHS has value populated but with error message', () => {
                const invalidValue = 'blah';
                const expression = createBlankExpression();
                expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value = invalidValue;
                const expressionBuilder = createComponentForTest({
                    expression,
                });
                Promise.resolve().then(() => {
                    const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                    expect(lhsCombobox.value).toEqual(invalidValue);
                    expect(lhsCombobox.errorMessage).toEqual(genericErrorMessage);
                });
            });

            it('Invalid literals on RHS has value populated but with error message', () => {
                const expression = {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: stringVariableGuid,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: 'Assign',
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: 'foobar',
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: 'String',
                        error: null,
                    },
                };
                const expressionBuilder = createComponentForTest({
                    expression,
                });
                Promise.resolve().then(() => {
                    const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                    lhsCombobox.dispatchEvent(ourCBChangeEvent);
                    const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                    expect(rhsCombobox.errorMessage).toEqual(numberErrorMessage);
                });
            });

            it('Invalid resources on RHS has value populated but with error message', () => {
                const expression = {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: stringVariableGuid,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: 'Assign',
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: '{!' + stringVariableDevName + '}',
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: 'reference',
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: {
                        value: stringVariableGuid,
                        error: null,
                    }
                };
                const expressionBuilder = createComponentForTest({
                    expression,
                });
                Promise.resolve().then(() => {
                    const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                    lhsCombobox.dispatchEvent(ourCBChangeEvent);
                    const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                    expect(rhsCombobox.errorMessage).toEqual(genericErrorMessage);
                });
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
            expect(lhsCombobox.value.displayText).toEqual(devNameToComboboxValue(numberVariableDevName));
            expect(operatorCombobox.value).toEqual('Assign');
            expect(rhsCombobox.value.displayText).toEqual(devNameToComboboxValue(numberVariableDevName));
        });
    });
    describe('building expression for entity fields', () => {
        const OPERATOR = 'EqualTo', LHS_VALUE = 'Account.Description', RHS_VALUE = 'Account Description', OBJECT_TYPE = 'Account';
        const mockExpressionForEntityFields = {
            [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: OPERATOR, error: null},
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: LHS_VALUE, error: null},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: RHS_VALUE, error: null},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {value: 'string', error: null},
        };

        const mockConfigurationForEntityFields = {
            elementType: ELEMENT_TYPE.RECORD_LOOKUP,
            lhsFields: mockAccountFields,
            objectType: OBJECT_TYPE
        };
        let expressionBuilder;
        beforeEach(() => {
            expressionBuilder = createComponentForTest({
                expression: mockExpressionForEntityFields,
                configuration: mockConfigurationForEntityFields,
            });
        });

        it('should populate the lhs menu data as a list of entity fields', () => {
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            const lhsMenuData = lhsCombobox.menuData;
            expect(lhsMenuData).toHaveLength(expressionBuilder.configuration.lhsFields.length);
            expressionBuilder.configuration.lhsFields.forEach((field, index) => {
                expect(lhsMenuData[index].displayText).toEqual(field.apiName);
                expect(lhsMenuData[index].value).toEqual(OBJECT_TYPE + "." + field.apiName);
            });
        });

        /*
        it('should populate operator menu and set to EqualTo', () => {
            const operatorCombobox = getLightningCombobox(expressionBuilder);
            expect(operatorCombobox.options).toBeDefined();
            expect(operatorCombobox.value).toEqual(OPERATOR);
        });
        */

        it('should populate rhs menu data and have a value', () => {
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.menuData).toBeDefined();
            expect(rhsCombobox.value).toEqual(RHS_VALUE);
        });
    });
    describe('disabling the operator and RHS field', () => {
        // TODO: tests for operator/RHS being enabled onItemSelected and onFilterMatches
        it('should be disabled when the expression is initialized', () => {
            const expressionBuilder = createComponentForTest({
                expression: createBlankExpression(),
            });
            checkOperatorAndRHSDisabled(expressionBuilder, true);
        });
        it('should be enabled when the expression is populated', () => {
            const expressionBuilder = createDefaultComponentForTest();
            checkOperatorAndRHSDisabled(expressionBuilder, false);
        });
        it('should be disabled if LHS is cleared', () => {
            const expressionBuilder = createDefaultComponentForTest();
            Promise.resolve().then(() => {
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                const eventCallback = jest.fn();
                expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);
                const CBreturn = {
                    value: '',
                    displayText: '',
                };
                lhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(CBreturn));
                return Promise.resolve().then(() => {
                    checkOperatorAndRHSDisabled(expressionBuilder, true);
                    const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                    expect(rhsCombobox.value.displayText).toEqual('{!' + numberVariableDevName + '}');
                });
            });
        });
    });

    describe('RHS literal datatype depending on LHS/Operator', () => {
        it('String', () => {
            const expression = createMockEmptyRHSExpression(stringVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'foobar'));
            Promise.resolve().then(() => {
                expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.STRING.value);
            });
        });

        it('Number', () => {
            const expression = createMockEmptyRHSExpression(numberVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
            Promise.resolve().then(() => {
                expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
            });
        });

        it('Currency', () => {
            const expression = createMockEmptyRHSExpression(currencyVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
            Promise.resolve().then(() => {
                expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
            });
        });

        it('Date', () => {
            const expression = createMockEmptyRHSExpression(dateVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '1/1/2018'));
            Promise.resolve().then(() => {
                expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.DATE.value);
            });
        });

        it('Element', () => {
            const expression = createMockEmptyRHSExpression(assignmentElementGuid, true);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'true'));
            Promise.resolve().then(() => {
                expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });
    });
});
