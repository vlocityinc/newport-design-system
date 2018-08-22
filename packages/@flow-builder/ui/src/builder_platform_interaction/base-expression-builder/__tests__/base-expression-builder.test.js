import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import BaseExpressionBuilder from '../base-expression-builder.js';
import { RowContentsChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction-events';
import { numberVariableGuid, numberVariableDevName, stringVariableGuid,
    dateVariableGuid, currencyVariableGuid, assignmentElementGuid, accountSObjectVariableGuid, elements } from 'mock-store-data';
import { elementToParam, getRulesForContext, getLHSTypes, getOperators, getRHSTypes, RULE_OPERATOR } from 'builder_platform_interaction-rule-lib';
import { mutateFlowResourceToComboboxShape, mutateFieldToComboboxShape, EXPRESSION_PROPERTY_TYPE, getElementsForMenuData } from 'builder_platform_interaction-expression-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { mockAccountFields, mockAccountFieldWithPicklist } from 'mock-server-entity-data';
import { dateCollectionParam, dateParam } from 'mock-rule-service';
import { FLOW_DATA_TYPE, FEROV_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction-system-lib';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-base-expression-builder', { is: BaseExpressionBuilder });
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
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: RULE_OPERATOR.ASSIGN,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: addCurlyBraces(numberVariableDevName),
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

const numberVariable = elements[numberVariableGuid];

function createDefaultFerToFerovComponentForTest() {
    const expressionBuilder = createComponentForTest({
        containerElement: ELEMENT_TYPE.ASSIGNMENT,
        lhsValue: mutateFlowResourceToComboboxShape(numberVariable),
        lhsParam: elementToParam(numberVariable),
        lhsIsField: false,
        lhsFields: null,
        lhsActivePicklistValues: null,
        showLhsAsFieldReference: true,
        operatorValue: RULE_OPERATOR.ASSIGN,
        rhsValue: mutateFlowResourceToComboboxShape(numberVariable),
        rhsGuid: numberVariableGuid,
        rhsIsField: false,
        rhsFields: null,
        rhsLiteralsAllowed: true,
    });
    return expressionBuilder;
}

function createMockEmptyRHSExpression(lhsGuid) {
    const variable = elements[lhsGuid];
    const expressionBuilder = createComponentForTest({
        lhsValue: mutateFlowResourceToComboboxShape(variable),
        lhsParam: elementToParam(variable),
        lhsIsField: false,
        lhsFields: null,
        lhsActivePicklistValues: null,
        showLhsAsFieldReference: true,
        operatorValue: RULE_OPERATOR.ASSIGN,
        rhsValue: mutateFlowResourceToComboboxShape(numberVariable),
        rhsGuid: numberVariableGuid,
        rhsIsField: false,
        rhsFields: null,
        rhsLiteralsAllowed: true,
    });
    return expressionBuilder;
}

let ourCBChangeEvent;

const newCBValue = numberVariableGuid;

const lightningCBChangeEvent = new CustomEvent('change', {
    detail: {
        value: newCBValue
    }
});

const CBreturnItem = {
    value: elements[numberVariableGuid].guid,
    displayText: addCurlyBraces(elements[numberVariableGuid].name),
};

function getComboboxElements(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelectorAll("builder_platform_interaction-combobox");
}

function getLightningCombobox(expressionBuilder) {
    return getShadowRoot(expressionBuilder).querySelector("lightning-combobox");
}

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
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction-rule-lib').PARAM_PROPERTY,
    };
});

jest.mock('builder_platform_interaction-expression-utils', () => {
    return {
        getElementsForMenuData: jest.fn().mockReturnValue([]),
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction-expression-utils').EXPRESSION_PROPERTY_TYPE,
        getResourceByUniqueIdentifier: require.requireActual('builder_platform_interaction-expression-utils').getResourceByUniqueIdentifier,
        isElementAllowed: require.requireActual('builder_platform_interaction-expression-utils').isElementAllowed,
        sanitizeGuid: require.requireActual('builder_platform_interaction-data-mutation-lib').sanitizeGuid,
        filterFieldsForChosenElement: require.requireActual('builder_platform_interaction-expression-utils').filterFieldsForChosenElement,
        OPERATOR_DISPLAY_OPTION: require.requireActual('builder_platform_interaction-expression-utils').OPERATOR_DISPLAY_OPTION,
        getResourceFerovDataType: require.requireActual('builder_platform_interaction-expression-utils').getResourceFerovDataType,
        mutateFlowResourceToComboboxShape: require.requireActual('builder_platform_interaction-expression-utils').mutateFlowResourceToComboboxShape,
        mutateFieldToComboboxShape: require.requireActual('builder_platform_interaction-expression-utils').mutateFieldToComboboxShape,
    };
});

const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
const placeholders = ['lhsPlaceholder', 'operatorPlaceholder', 'rhsPlaceholder'];

describe('base expression builder', () => {
    beforeEach(() => {
        ourCBChangeEvent = new ComboboxStateChangedEvent(CBreturnItem);
    });
    describe('label sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${labels[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
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
                    lhsPlaceholder: "LHS",
                    operatorPlaceholder: "operator",
                    rhsPlaceholder: "RHS"
                });
                expect(expressionBuilder[placeholders[i]]).toBeDefined();
            });
        }
    });

    describe('basic set up', () => {
        it('should set rules based on container element', () => {
            createComponentForTest({
                containerElement: ELEMENT_TYPE.ASSIGNMENT,
            });
            expect(getRulesForContext).toHaveBeenCalled();
        });
        it('should set lhs menu data based on container element', () => {
            const expressionBuilder = createComponentForTest({
                containerElement: ELEMENT_TYPE.ASSIGNMENT,
                lhsFields: null,
                lhsIsField: false,
                showLhsAsFieldReference: true,
            });
            const lhsCombobox = getComboboxElements(expressionBuilder)[0];

            expect(getLHSTypes).toHaveBeenCalled();
            expect(getElementsForMenuData).toHaveBeenCalled();
            expect(lhsCombobox.menuData).toBeDefined();
        });
    });

    describe('handling value change events from combobox', () => {
        it('should throw RowContentsChangedEvent with all 4 properties when LHS value changes', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

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
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
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
            const expressionBuilder = createDefaultFerToFerovComponentForTest();

            return Promise.resolve().then(() => {
                const newExpression = createMockPopulatedExpression();
                newExpression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = {value: addCurlyBraces(numberVariableDevName), error: null};
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
    });
    describe('building expression from existing item', () => {
        it('should populate operator menu if LHS is set', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const operatorCombobox = getLightningCombobox(expressionBuilder);
            expect(getOperators).toHaveBeenCalled();
            expect(operatorCombobox.options).toBeDefined();
        });

        it('should populate rhs menu data', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                expect(getRHSTypes).toHaveBeenCalled();
                expect(rhsCombobox.menuData).toBeDefined();
            });
        });

        it('should populate the expression builder with values from the store', () => {
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            return Promise.resolve().then(() => {
                const comboboxes = getComboboxElements(expressionBuilder);
                const lhsCombobox = comboboxes[0];
                const operatorCombobox = getLightningCombobox(expressionBuilder);
                expect(lhsCombobox.value.displayText).toEqual(addCurlyBraces(numberVariableDevName));
                expect(operatorCombobox.value).toEqual(RULE_OPERATOR.ASSIGN);
            }).then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                expect(rhsCombobox.value.displayText).toEqual(addCurlyBraces(numberVariableDevName));
            });
        });
    });
    describe('building expression for picklist values', () => {
        const accountVariable = mutateFlowResourceToComboboxShape(elements[accountSObjectVariableGuid]);
        const accountField = mockAccountFieldWithPicklist.AccountSource;

        const picklistLabel = 'Picklist Values';
        const picklistApiValue = 'AccountSource';
        // for testing picklist menu data we will mock picklist menu items
        getElementsForMenuData.mockReturnValue([{label: picklistLabel, items: [{value: picklistApiValue}]}]);

        afterAll(() => {
            getElementsForMenuData.mockClear();
        });

        it('should throw RowContentsChangedEvent with matching picklist item when selecting picklist menu item', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: mutateFieldToComboboxShape(accountField, accountVariable, true, true),
                lhsParam: elementToParam(accountField),
                lhsIsField: true,
                lhsFields: mockAccountFields,
                lhsActivePicklistValues: accountField.picklistValues,
                showLhsAsFieldReference: true,
                operatorValue: RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsGuid: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true,
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
                lhsValue: mutateFlowResourceToComboboxShape(numberVariable),
                lhsParam: elementToParam(numberVariable),
                lhsIsField: false,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: RULE_OPERATOR.ASSIGN,
                rhsValue: null,
                rhsGuid: null,
                rhsIsField: false,
                rhsFields: null,
                rhsLiteralsAllowed: true,
            });
            const item = {
                displayText: addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_TRUE),
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
        it('rhs literals should not be allowed by default', () => {
            const expressionBuilder = createComponentForTest({
                lhsValue: null,
                lhsParam: null,
                lhsIsField: false,
                lhsFields: null,
                lhsActivePicklistValues: null,
                showLhsAsFieldReference: true,
                operatorValue: null,
                rhsValue: null,
                rhsGuid: null,
                rhsIsField: false,
                rhsFields: null,
            });
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
        });
        it('when rhs literals-allowed has been set to true, & rhs can be a scalar, literals should be allowed', () => {
            getRHSTypes.mockReturnValue({ 'Date' : [dateParam]});
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeTruthy();
            getRHSTypes.mockReturnValue();
        });
        it('when rhs literal is allowed by context but RHS must be collection, literals should not be allowed', () => {
            getRHSTypes.mockReturnValue({ 'Date' : [dateCollectionParam]});
            const expressionBuilder = createDefaultFerToFerovComponentForTest();
            const rhsCombobox = getComboboxElements(expressionBuilder)[1];
            expect(rhsCombobox.literalsAllowed).toBeFalsy();
            getRHSTypes.mockReturnValue();
        });
    });
    describe('Based on LHS/Operator combination...', () => {
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

        it('RHS datatype should be set to String', () => {
            const expressionBuilder = createMockEmptyRHSExpression(stringVariableGuid);
            // first promise needed to create the component
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'foobar'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.STRING.value);
                });
            });
        });

        it('RHS datatype should be set to Number', () => {
            const expressionBuilder = createMockEmptyRHSExpression(numberVariableGuid);
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.NUMBER.value);
                });
            });
        });

        it('RHS datatype should be set to Currency', () => {
            const expressionBuilder = createMockEmptyRHSExpression(currencyVariableGuid);
            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '123'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.CURRENCY.value);
                });
            });
        });

        it('RHS datatype should be set to Date', () => {
            const expressionBuilder = createMockEmptyRHSExpression(dateVariableGuid);

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, '1/1/2018'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.DATE.value);
                });
            });
        });

        it('RHS datatype should be set to Element', () => {
            getRHSTypes.mockReturnValueOnce(booleanRHSType);
            const expressionBuilder = createMockEmptyRHSExpression(assignmentElementGuid, true);

            return Promise.resolve().then(() => {
                const rhsCombobox = getComboboxElements(expressionBuilder)[1];
                rhsCombobox.dispatchEvent(new ComboboxStateChangedEvent(null, 'true'));
                return Promise.resolve().then(() => {
                    expect(rhsCombobox.type).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
                });
            });
        });
    });
});
