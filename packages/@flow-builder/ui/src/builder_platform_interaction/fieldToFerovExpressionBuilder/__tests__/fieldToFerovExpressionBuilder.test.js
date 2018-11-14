import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
// Importing using relative path here to ensure that we get the actual component and not the mocked version
import FieldToFerovExpressionBuilder from "../fieldToFerovExpressionBuilder.js";
import { numberVariableGuid, accountSObjectVariableGuid, accountSObjectVariableDevName, elements } from "mock/storeData";
import { elementToParam, RULE_OPERATOR } from "builder_platform_interaction/ruleLib";
import {
    mutateFlowResourceToComboboxShape,
    mutateFieldToComboboxShape,
    EXPRESSION_PROPERTY_TYPE,
    LHS_DISPLAY_OPTION,
} from "builder_platform_interaction/expressionUtils";
import { mockAccountFields, mockAccountFieldWithPicklist } from "mock/serverEntityData";
import { FEROV_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { GLOBAL_CONSTANTS, GLOBAL_CONSTANT_OBJECTS, setSystemVariables, getSystemVariables } from "builder_platform_interaction/systemLib";
import { addCurlyBraces } from "builder_platform_interaction/commonUtils";
import { systemVariables } from "mock/systemGlobalVars";
import { untilNoFailure } from 'builder_platform_interaction/builderTestUtils';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-field-to-ferov-expression-builder', { is: FieldToFerovExpressionBuilder });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
}

const sobject = 'Account';
const numberVariable = elements[numberVariableGuid];
const picklistField = 'AccountSource';
const accountField = mockAccountFieldWithPicklist.AccountSource;
const accountVariableComboboxShape = mutateFlowResourceToComboboxShape(elements[accountSObjectVariableGuid]);
const systemVariableReference = '$Flow.CurrentRecord';

function createMockPopulatedFieldExpression() {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
            value: sobject + '.' + picklistField,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
            value: RULE_OPERATOR.EQUAL_TO,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
            value: accountSObjectVariableGuid + '.' + picklistField,
            error: null,
        },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: FEROV_DATA_TYPE.REFERENCE,
            error: null,
        }
    };
}

function getBaseExpressionBuilder(fieldToFerovWrapper) {
    return getShadowRoot(fieldToFerovWrapper).querySelector("builder_platform_interaction-base-expression-builder");
}

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        getDataType: require.requireActual('builder_platform_interaction/ruleLib').getDataType,
        elementToParam: require.requireActual('builder_platform_interaction/ruleLib').elementToParam,
        getRHSTypes: jest.fn(),
        isCollectionRequired: jest.fn().mockReturnValue(false).mockName('isCollectionRequired'),
        RULE_OPERATOR: require.requireActual('builder_platform_interaction/ruleLib').RULE_OPERATOR,
        PARAM_PROPERTY: require.requireActual('builder_platform_interaction/ruleLib').PARAM_PROPERTY,
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        EXPRESSION_PROPERTY_TYPE: require.requireActual('builder_platform_interaction/expressionUtils').EXPRESSION_PROPERTY_TYPE,
        validateExpressionShape: require.requireActual('builder_platform_interaction/expressionUtils').validateExpressionShape,
        LHS_DISPLAY_OPTION: require.requireActual('builder_platform_interaction/expressionUtils').LHS_DISPLAY_OPTION,
        populateLhsStateForField: require.requireActual('builder_platform_interaction/expressionUtils').populateLhsStateForField,
        populateRhsState: require.requireActual('builder_platform_interaction/expressionUtils').populateRhsState,
        mutateFlowResourceToComboboxShape: require.requireActual('builder_platform_interaction/expressionUtils').mutateFlowResourceToComboboxShape,
        mutateFieldToComboboxShape: require.requireActual('builder_platform_interaction/expressionUtils').mutateFieldToComboboxShape,
        getSecondLevelItems: require.requireActual('builder_platform_interaction/expressionUtils').getSecondLevelItems,
    };
});

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetchOnce: jest.fn().mockImplementation(() => {
            return Promise.resolve(JSON.stringify(mockAccountFields));
        }),
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE,
    };
});

const INVALID_VALUE = 'invalidValue';

const labels = ['lhsLabel', 'operatorLabel', 'rhsLabel'];
const placeholders = ['lhsPlaceholder', 'operatorPlaceholder', 'rhsPlaceholder'];

describe('field-to-ferov-expression-builder', () => {
    describe('label sanity checks', () => {
        for (let i = 0; i < 3; i++) {
            it(`has the ${labels[i]} defined`, () => {
                const expressionBuilder = createComponentForTest({
                    lhsLabel: "LHS",
                    operatorLabel: "operator",
                    rhsLabel: "RHS",
                    expression: createMockPopulatedFieldExpression(),
                    objectType: sobject,
                    lhsFields: mockAccountFields,
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
                    rhsPlaceholder: "RHS",
                    expression: createMockPopulatedFieldExpression(),
                    objectType: sobject,
                    lhsFields: mockAccountFields,
                });
                expect(expressionBuilder[placeholders[i]]).toBeDefined();
            });
        }
    });
    describe('parsing LHS', () => {
        it('should handle field on LHS', () => {
            const expressionBuilder = createComponentForTest({
                expression: createMockPopulatedFieldExpression(),
                objectType: sobject,
                lhsFields: mockAccountFields,
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.lhsValue).toMatchObject(mutateFieldToComboboxShape(accountField, {value: sobject}, false, false));
            expect(baseExpressionBuilder.lhsParam).toMatchObject(elementToParam(accountField));
            expect(baseExpressionBuilder.lhsActivePicklistValues).toEqual(accountField.activePicklistValues);
            expect(baseExpressionBuilder.lhsDisplayOption).toBe(LHS_DISPLAY_OPTION.SOBJECT_FIELD);
            expect(baseExpressionBuilder.lhsFields).toEqual(mockAccountFields);
        });
        it('should pass plain lhs value if there is an error', () => {
            const expressionBuilder = createComponentForTest({
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: INVALID_VALUE,
                        error: INVALID_VALUE,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.EQUAL_TO,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: addCurlyBraces(accountSObjectVariableDevName + '.' + picklistField),
                        error: null,
                    },
                },
                objectType: sobject,
                lhsFields: mockAccountFields,
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.lhsValue).toEqual(INVALID_VALUE);
            expect(baseExpressionBuilder.lhsParam).toBeDefined();
            expect(baseExpressionBuilder.lhsParam).toBeFalsy();
            expect(baseExpressionBuilder.lhsActivePicklistValues).toBeDefined();
            expect(baseExpressionBuilder.lhsActivePicklistValues).toBeFalsy();
            expect(baseExpressionBuilder.lhsDisplayOption).toBe(LHS_DISPLAY_OPTION.SOBJECT_FIELD);
            expect(baseExpressionBuilder.lhsFields).toEqual(mockAccountFields);
        });
        it('should pass plain lhs value if invalid but there is no error', () => {
            const expressionBuilder = createComponentForTest({
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: INVALID_VALUE,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.EQUAL_TO,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: addCurlyBraces(accountSObjectVariableDevName + '.' + picklistField),
                        error: null,
                    },
                },
                objectType: sobject,
                lhsFields: mockAccountFields,
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.lhsValue).toEqual(INVALID_VALUE);
            expect(baseExpressionBuilder.lhsParam).toBeDefined();
            expect(baseExpressionBuilder.lhsParam).toBeFalsy();
            expect(baseExpressionBuilder.lhsActivePicklistValues).toBeDefined();
            expect(baseExpressionBuilder.lhsActivePicklistValues).toBeFalsy();
            expect(baseExpressionBuilder.lhsDisplayOption).toBe(LHS_DISPLAY_OPTION.SOBJECT_FIELD);
            expect(baseExpressionBuilder.lhsFields).toEqual(mockAccountFields);
        });
    });
    describe('parsing RHS', () => {
        it('should handle FER on RHS', () => {
            const expressionBuilder = createComponentForTest({
                objectType: sobject,
                lhsFields: mockAccountFields,
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: numberVariableGuid,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.ASSIGN,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: numberVariableGuid,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: FEROV_DATA_TYPE.REFERENCE,
                        error: null,
                    }
                },
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.rhsValue).toMatchObject(mutateFlowResourceToComboboxShape(numberVariable));
            expect(baseExpressionBuilder.rhsIsField).toBeDefined();
            expect(baseExpressionBuilder.rhsIsField).toBeFalsy();
            expect(baseExpressionBuilder.rhsFields).toBeDefined();
            expect(baseExpressionBuilder.rhsFields).toBeFalsy();
        });
        it('should handle FER with no datatype', () => {
            const expressionBuilder = createComponentForTest({
                objectType: sobject,
                lhsFields: mockAccountFields,
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: numberVariableGuid,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.ASSIGN,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: numberVariableGuid,
                        error: null,
                    }
                },
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.rhsIsFer).toBeTruthy();
        });
        it('should handle field on sobject var on RHS', async () => {
            const expressionBuilder = createComponentForTest({
                expression: createMockPopulatedFieldExpression(),
                objectType: sobject,
                lhsFields: mockAccountFields,
            });

            await untilNoFailure(() => {
                const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
                expect(baseExpressionBuilder.rhsValue).toMatchObject(mutateFieldToComboboxShape(accountField, accountVariableComboboxShape, true, true));
                expect(baseExpressionBuilder.rhsIsField).toBeTruthy();
                expect(baseExpressionBuilder.rhsFields).toBeTruthy();
            });
        });
        it('should handle system variable on RHS', () => {
            setSystemVariables(systemVariables);
            const expressionBuilder = createComponentForTest({
                objectType: sobject,
                lhsFields: mockAccountFields,
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: accountSObjectVariableGuid + '.' + picklistField,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.EQUAL_TO,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: systemVariableReference,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: 'reference',
                        error: null,
                    },
                },
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.rhsValue)
                .toMatchObject(mutateFlowResourceToComboboxShape(getSystemVariables()[systemVariableReference]));
            expect(baseExpressionBuilder.rhsIsField).toBeDefined();
            expect(baseExpressionBuilder.rhsIsField).toBeFalsy();
            expect(baseExpressionBuilder.rhsFields).toBeDefined();
            expect(baseExpressionBuilder.rhsFields).toBeFalsy();
        });
        it('should handle Global Constant on RHS', () => {
            const expressionBuilder = createComponentForTest({
                objectType: sobject,
                lhsFields: mockAccountFields,
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: accountSObjectVariableGuid + '.' + picklistField,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.EQUAL_TO,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE),
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: FEROV_DATA_TYPE.BOOLEAN,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: {
                        value: '',
                        error: '',
                    }
                },
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.rhsValue)
                .toMatchObject(mutateFlowResourceToComboboxShape(GLOBAL_CONSTANT_OBJECTS[GLOBAL_CONSTANTS.BOOLEAN_FALSE]));
            expect(baseExpressionBuilder.rhsIsField).toBeDefined();
            expect(baseExpressionBuilder.rhsIsField).toBeFalsy();
            expect(baseExpressionBuilder.rhsFields).toBeDefined();
            expect(baseExpressionBuilder.rhsFields).toBeFalsy();
        });
        it('should handle literal on RHS', () => {
            const literal = 'abc';
            const expressionBuilder = createComponentForTest({
                objectType: sobject,
                lhsFields: mockAccountFields,
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: sobject + '.' + picklistField,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                        value: RULE_OPERATOR.EQUAL_TO,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: literal,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: FEROV_DATA_TYPE.STRING,
                        error: null,
                    },
                },
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.rhsValue).toBe(literal);
            expect(baseExpressionBuilder.rhsIsField).toBeDefined();
            expect(baseExpressionBuilder.rhsIsField).toBeFalsy();
            expect(baseExpressionBuilder.rhsFields).toBeDefined();
            expect(baseExpressionBuilder.rhsFields).toBeFalsy();
        });
    });
    describe('operator display', () => {
        it('should hide operator if no operator is passed', () => {
            const expressionBuilder = createComponentForTest({
                objectType: sobject,
                lhsFields: mockAccountFields,
                expression: {
                    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                        value: accountSObjectVariableGuid + '.' + picklistField,
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                        value: addCurlyBraces(GLOBAL_CONSTANTS.BOOLEAN_FALSE),
                        error: null,
                    },
                    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
                        value: FEROV_DATA_TYPE.BOOLEAN,
                        error: null,
                    },
                },
            });
            const baseExpressionBuilder = getBaseExpressionBuilder(expressionBuilder);
            expect(baseExpressionBuilder.hideOperator).toBe(true);
        });
    });
});
