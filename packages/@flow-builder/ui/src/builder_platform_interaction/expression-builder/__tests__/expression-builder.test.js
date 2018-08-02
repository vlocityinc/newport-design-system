import { createElement } from 'engine';
import { getShadowRoot } from 'lwc-test-utils';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import ExpressionBuilder from '../expression-builder.js';
import { RowContentsChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction-events';
import { numberVariableGuid, numberVariableDevName, stringVariableGuid, stringVariableDevName,
    dateVariableGuid, currencyVariableGuid, assignmentElementGuid, elements } from 'mock-store-data';
import { getLHSTypes, getOperators, getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { normalizeLHS, EXPRESSION_PROPERTY_TYPE, getElementsForMenuData, OPERATOR_DISPLAY_OPTION } from 'builder_platform_interaction-expression-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { mockAccountFields } from 'mock-server-entity-data';
import { FLOW_DATA_TYPE, FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction-system-lib';
import genericErrorMessage from "@salesforce/label/FlowBuilderCombobox.genericErrorMessage";
import numberErrorMessage from "@salesforce/label/FlowBuilderCombobox.numberErrorMessage";

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
            value: wasVisited ? 'wasVisited' : RULE_OPERATOR.ASSIGN,
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
            value: RULE_OPERATOR.ASSIGN,
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

const CBreturnItem = {
    value: elements[numberVariableGuid].guid,
    displayText: '{!' + elements[numberVariableGuid].name + '}'
};

let ourCBChangeEvent;

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
        RULE_OPERATOR: require.requireActual('builder_platform_interaction-rule-lib').RULE_OPERATOR,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue([]),
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction-expression-utils').EXPRESSION_PROPERTY_TYPE,
        normalizeLHS: jest.fn().mockImplementation(require.requireActual('builder_platform_interaction-expression-utils').normalizeLHS),
        normalizeRHS: require.requireActual('builder_platform_interaction-expression-utils').normalizeRHS,
        retrieveRHSVal: require.requireActual('builder_platform_interaction-expression-utils').retrieveRHSVal,
        getResourceByUniqueIdentifier: require.requireActual('builder_platform_interaction-expression-utils').getResourceByUniqueIdentifier,
        isElementAllowed: require.requireActual('builder_platform_interaction-expression-utils').isElementAllowed,
        sanitizeGuid: require.requireActual('builder_platform_interaction-data-mutation-lib').sanitizeGuid,
        filterFieldsForChosenElement: require.requireActual('builder_platform_interaction-expression-utils').filterFieldsForChosenElement,
        OPERATOR_DISPLAY_OPTION: require.requireActual('builder_platform_interaction-expression-utils').OPERATOR_DISPLAY_OPTION,
        getResourceFerovDataType: require.requireActual('builder_platform_interaction-expression-utils').getResourceFerovDataType,
    };
});

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction-server-data-lib', () => {
    return {
        fetch: jest.fn().mockImplementation((actionType, callback) => {
            callback({
                data: JSON.stringify(mockAccountFields),
            });
        }),
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction-server-data-lib').SERVER_ACTION_TYPE,
    };
});

describe('expression-builder', () => {
    beforeEach(() => {
        ourCBChangeEvent = new ComboboxStateChangedEvent(CBreturnItem);
        normalizeLHS.mockClear();
    });

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
                newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE] = {value: FEROV_DATA_TYPE.REFERENCE, error: null};
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
            const testExpressionCreationWithInvalidLHS = (lhs) => {
                const error = genericErrorMessage;
                const expression = createBlankExpression();
                expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value = lhs;
                expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].error = error;
                createComponentForTest({
                    expression,
                });
                return Promise.resolve().then(() => {
                    expect(normalizeLHS).not.toHaveBeenCalled();
                });
            };
            it('Invalid LHS literal should not be processed on component creation', () => {
                testExpressionCreationWithInvalidLHS("test");
            });
            it('Invalid LHS that looks like field on sobject should not be processed on component creation', () => {
                testExpressionCreationWithInvalidLHS("test.value");
            });
            it('Invalid LHS that looks merge field should not be processed on component creation', () => {
                testExpressionCreationWithInvalidLHS("{!test}");
            });
            it('Invalid LHS that looks like field on sobject variable should not be processed on component creation', () => {
                testExpressionCreationWithInvalidLHS("{!test.value}");
            });
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
                        value: RULE_OPERATOR.ASSIGN,
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
                        value: RULE_OPERATOR.ASSIGN,
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
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                expect(getRHSTypes).toHaveBeenCalled();
                expect(rhsCombobox.menuData).toBeDefined();
            });
        });

        it('should populate the expression builder with values from the store', () => {
            const expressionBuilder = createDefaultComponentForTest();
            return Promise.resolve().then(() => {
                const comboboxes = getComboboxElements(expressionBuilder);
                const lhsCombobox = comboboxes[0];
                const operatorCombobox = getLightningCombobox(expressionBuilder);
                expect(lhsCombobox.value.displayText).toEqual(devNameToComboboxValue(numberVariableDevName));
                expect(operatorCombobox.value).toEqual(RULE_OPERATOR.ASSIGN);
            })
                .then(() => {
                    const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                    expect(rhsCombobox.value.displayText).toEqual(devNameToComboboxValue(numberVariableDevName));
                });
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
                configuration: mockConfigurationForEntityFields,
                expression: mockExpressionForEntityFields,
            });
        });

        it('should populate the lhs menu data as a list of entity fields', () => {
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];
            const lhsMenuData = lhsCombobox.menuData;
            const lhsFields = Object.keys(expressionBuilder.configuration.lhsFields);
            expect(lhsMenuData).toHaveLength(lhsFields.length);
            lhsFields.forEach((field, index) => {
                expect(lhsMenuData[index].displayText).toEqual(field);
                expect(lhsMenuData[index].value).toEqual(OBJECT_TYPE + "." + field);
            });
        });

        it('should populate operator menu and set to EqualTo', () => {
            const operatorCombobox = getLightningCombobox(expressionBuilder);
            expect(operatorCombobox.options).toBeDefined();
            expect(operatorCombobox.value).toEqual(OPERATOR);
        });

        it('should populate rhs menu data and have a value', () => {
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.menuData).toBeDefined();
            expect(rhsCombobox.value).toEqual(RHS_VALUE);
        });
    });

    describe('building expression for picklist values', () => {
        const OPERATOR = 'EqualTo', LHS_VALUE = 'Account.AccountSource', RHS_VALUE = null, OBJECT_TYPE = 'Account';
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
        const picklistLabel = 'Picklist Values';
        const picklistApiValue = 'AccountSource';
        // for testing picklist menu data we will mock picklist menu items
        getElementsForMenuData.mockReturnValue([{label: picklistLabel, items: [{value: picklistApiValue}]}]);

        afterAll(() => {
            getElementsForMenuData.mockClear();
        });

        it('should throw RowContentsChangedEvent with matching picklist item when selecting picklist menu item', () => {
            const expressionBuilder = createComponentForTest({
                expression: mockExpressionForEntityFields,
                configuration: mockConfigurationForEntityFields,
            });
            const item = {
                value: 'Advertisement',
                displayText: 'Advertisement',
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression = eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value).toEqual(item.value);
                expect(newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE].value).toEqual(FLOW_DATA_TYPE.STRING.value);
                expect(newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID].value).toBe('');
            });
        });
    });

    describe('building expression for global constants', () => {
        it('should throw RowContentsChangedEvent with correct dataType', () => {
            const expressionBuilder = createComponentForTest({
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: stringVariableGuid, error: null},
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: RULE_OPERATOR.ASSIGN, error: null},
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: '', error: null},
                },
            });
            const item = {
                displayText: '{!' + GLOBAL_CONSTANTS.BOOLEAN_TRUE + '}',
                value: GLOBAL_CONSTANTS.BOOLEAN_TRUE,
            };
            const eventCallback = jest.fn();
            expressionBuilder.addEventListener(RowContentsChangedEvent.EVENT_NAME, eventCallback);
            ourCBChangeEvent = new ComboboxStateChangedEvent(item);
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            rhsCombobox.dispatchEvent(ourCBChangeEvent);
            return Promise.resolve().then(() => {
                const newExpression = eventCallback.mock.calls[0][0].detail.newValue;
                expect(eventCallback).toHaveBeenCalled();
                expect(newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value).toEqual(item.displayText);
                expect(newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE].value).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
                expect(newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID].value).toBe(GLOBAL_CONSTANTS.BOOLEAN_TRUE);
            });
        });
    });

    describe('RHS literals-allowed can be determined by parent', () => {
        it('rhs literals should be allowed by default', () => {
            const expressionBuilder = createDefaultComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeTruthy();
        });
        it('when rhs literals-allowed has been set to false, literals should not be allowed', () => {
            const expressionBuilder = createComponentForTest({
                expression: createBlankExpression(),
                rhsLiteralsAllowed: false,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
        });
    });

    describe('RHS literal datatype depending on LHS/Operator', () => {
        const multipleRHSTypes = {
            String: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'String',
            }],
            Number: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Number',
            }],
            Currency: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Currency',
            }],
            Date: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Date',
            }],
        };

        const booleanRHSType = {
            Boolean: [{
                paramType: 'Data',
                canBeElements: [ELEMENT_TYPE.VARIABLE],
                dataType: 'Boolean',
            }],
        };

        beforeAll(() => {
            getRHSTypes.mockReturnValue(multipleRHSTypes);
        });

        afterAll(() => {
            getRHSTypes.mockReturnValue();
        });

        it('String', () => {
            const expression = createMockEmptyRHSExpression(stringVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            // first promise needed to create the component
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'foobar'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.STRING.value);
                });
            });
        });

        it('Number', () => {
            const expression = createMockEmptyRHSExpression(numberVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
                });
            });
        });

        it('Currency', () => {
            const expression = createMockEmptyRHSExpression(currencyVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.CURRENCY.value);
                });
            });
        });

        it('Date', () => {
            const expression = createMockEmptyRHSExpression(dateVariableGuid);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '1/1/2018'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.DATE.value);
                });
            });
        });

        it('Element', () => {
            getRHSTypes.mockReturnValueOnce(booleanRHSType);
            const expression = createMockEmptyRHSExpression(assignmentElementGuid, true);
            const expressionBuilder = createComponentForTest({
                expression,
            });
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'true'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
                });
            });
        });
    });
    describe('Expression should act like operator is Assign', () => {
        it(`When rhs menudata is initialized if operator is replaced with ${OPERATOR_DISPLAY_OPTION.LEFT_ARROW}`, () => {
            createDefaultComponentForTest(OPERATOR_DISPLAY_OPTION.LEFT_ARROW);
            return Promise.resolve().then(() => {
                expect(getRHSTypes.mock.calls[0][2]).toEqual(RULE_OPERATOR.ASSIGN);
            });
        });

        it(`To validate existing RHS when LHS changes if operator is replaced with ${OPERATOR_DISPLAY_OPTION.LEFT_ARROW}`, () => {
            const expressionBuilder = createDefaultComponentForTest(OPERATOR_DISPLAY_OPTION.LEFT_ARROW);

            return Promise.resolve().then(() => {
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(getRHSTypes.mock.calls[0][2]).toEqual(RULE_OPERATOR.ASSIGN);
            });
        });

        it(`When rhs menudata is initialized if operator is replaced with ${OPERATOR_DISPLAY_OPTION.RIGHT_ARROW}`, () => {
            createDefaultComponentForTest(OPERATOR_DISPLAY_OPTION.RIGHT_ARROW);
            return Promise.resolve().then(() => {
                expect(getRHSTypes.mock.calls[0][2]).toEqual(RULE_OPERATOR.ASSIGN);
            });
        });

        it(`To validate existing RHS when LHS changes if operator is replaced with ${OPERATOR_DISPLAY_OPTION.RIGHT_ARROW}`, () => {
            const expressionBuilder = createDefaultComponentForTest(OPERATOR_DISPLAY_OPTION.RIGHT_ARROW);

            return Promise.resolve().then(() => {
                const lhsCombobox = getComboboxElements(expressionBuilder)[0];
                lhsCombobox.dispatchEvent(ourCBChangeEvent);

                expect(getRHSTypes.mock.calls[0][2]).toEqual(RULE_OPERATOR.ASSIGN);
            });
        });
    });
});
