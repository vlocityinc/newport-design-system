import { isMatch, getLHSTypes, getOperators, getRHSTypes } from 'builder_platform_interaction-rule-lib';
import { RULE_TYPES } from 'builder_platform_interaction-constant';
import { FLOW_DATA_TYPE, FLOW_ELEMENT_TYPE, FLOW_OPERATOR_TYPE, RULE_PROPERTY } from '../../constant/constant';

const { ASSIGNMENT, COMPARISON } = RULE_TYPES;
const { DATE } = FLOW_DATA_TYPE;
const { STAGE } = FLOW_ELEMENT_TYPE;
const { ASSIGNMENT: ASSIGNMENT_OPERATOR, ADD: ADD_OPERATOR} = FLOW_OPERATOR_TYPE;
const { LEFT, RHS_PARAMS } = RULE_PROPERTY;
const mockRules =
[
    {
        ruleType:'assignment',
        left:{
            paramType:'Data',
            paramIndex:1,
            dataType:{
                _value_:'Date'
            },
            isCollection:false,
            canBeField:'CanBe',
            canBeSysVar:'CanBe'
        },
        operator:'ASSIGNMENT',
        rhsParams:[
            {
                paramType:'Data',
                paramIndex:1,
                dataType:{
                    _value_:'Date'
                },
                isCollection:false,
                canBeField:'CanBe',
                canBeSysVar:'CanBe'
            },
            {
                paramType:'Data',
                paramIndex:1,
                dataType:{
                    _value_:'DateTime'
                },
                isCollection:false,
                canBeField:'CanBe',
                canBeSysVar:'CanBe'
            }
        ]
    },
    {
        ruleType:'assignment',
        left:{
            paramType:'Data',
            paramIndex:1,
            dataType:{
                _value_:'DateTime'
            },
            isCollection:false,
            canBeField:'CanBe',
            canBeSysVar:'CanBe'
        },
        operator:'ASSIGNMENT',
        rhsParams:[
            {
                paramType:'Data',
                paramIndex:1,
                dataType:{
                    _value_:'Date'
                },
                isCollection:false,
                canBeField:'CanBe',
                canBeSysVar:'CanBe'
            },
            {
                paramType:'Data',
                paramIndex:1,
                dataType:{
                    _value_:'DateTime'
                },
                isCollection:false,
                canBeField:'CanBe',
                canBeSysVar:'CanBe'
            }
        ]
    },
    {
        ruleType:'assignment',
        left:{
            paramType:'Element',
            paramIndex:1,
            elemType:'STAGE',
            isCollection:true,
            canBeField:'CannotBe',
            canBeSysVar:'MustBe'
        },
        operator:'ADD',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                elemType:'STAGE',
                isCollection:false,
                canBeField:'CannotBe',
                canBeSysVar:'CanBe'
            }
        ]
    },
    {
        ruleType:'comparison',
        left:{
            paramType:'Element',
            paramIndex:1,
            elemType:'STAGE',
            isCollection:true,
            canBeField:'CannotBe',
            canBeSysVar:'MustBe'
        },
        operator:'ADD',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                elemType:'STAGE',
                isCollection:false,
                canBeField:'CannotBe',
                canBeSysVar:'CanBe'
            }
        ]
    },
    // duplicate rule needed for testing removal of duplicates.
    // there will never be a direct copy of a rule, just duplicates on LHS or Operator
    {
        ruleType:'comparison',
        left:{
            paramType:'Element',
            paramIndex:1,
            elemType:'STAGE',
            isCollection:true,
            canBeField:'CannotBe',
            canBeSysVar:'MustBe'
        },
        operator:'ADD',
        rhsParams:[
            {
                paramType:'Element',
                paramIndex:1,
                elemType:'STAGE',
                isCollection:false,
                canBeField:'CannotBe',
                canBeSysVar:'CanBe'
            }
        ]
    },
];

// mock elements from the rule service used for testing isMatch util
const lhsParamDate = {
    paramType:'Data',
    paramIndex:1,
    dataType:{
        _value_:'Date'
    },
    isCollection:false,
    canBeField:'CanBe',
    canBeSysVar:'CanBe'
};

const lhsParamStage = {
    paramType:'Element',
    paramIndex:1,
    elemType:'STAGE',
    isCollection:true,
    canBeField:'CannotBe',
    canBeSysVar:'MustBe'
};
// mock elements from the store that only have the properties we care about for testing
const lhsElementDate = {
    dataType: DATE,
    isCollection: false
};

const lhsElementStage = {
    elementType: STAGE,
    isCollection: true,
};

describe('Operator Rule Util', () => {
    describe('isMatch util', () => {
        it('should return true if rule param and store element match', () => {
            const isEqual = isMatch(lhsParamStage, lhsElementStage);
            expect(isEqual).toBeTruthy();
        });

        it('should return false if rule param and store element do not match', () => {
            const isEqual = isMatch(lhsParamDate, lhsElementStage);
            expect(isEqual).toBeFalsy();
        });

        it('should return true if rule param and store element with no collection property match', () => {
            const lhsElementDateNoCollection = { dataType: DATE };
            const isEqual = isMatch(lhsParamDate, lhsElementDateNoCollection);
            expect(isEqual).toBeTruthy();
        });

        it('should throw an error when given an empty rule param object', () => {
            expect(() => {
                isMatch({}, lhsElementDate);
            }).toThrow();
        });

        it('should throw an error when given an empty element object', () => {
            expect(() => {
                isMatch(lhsParamStage, {});
            }).toThrow();
        });
    });

    describe('get left hand side types util', () => {
        it('should return an object', () => {
            const rules = getLHSTypes(mockRules, ASSIGNMENT);
            expect(rules).toEqual(expect.any(Object));
        });

        it('should return an object with data type to param type mapping', () => {
            const rules = getLHSTypes(mockRules, ASSIGNMENT);
            const keys = Object.keys(rules);
            expect(rules).toMatchObject({
                [keys[0]] : expect.any(Array),
            });
        });

        it('should return all the left hand side types for assignment rules', () => {
            const rules = getLHSTypes(mockRules, ASSIGNMENT);
            const expectedDate = mockRules[0][LEFT];
            const expectedDateTime = mockRules[1][LEFT];
            const expectedStage = mockRules[2][LEFT];
            expect(rules).toMatchObject({
                'Date': [expectedDate],
                'DateTime': [expectedDateTime],
                'STAGE': [expectedStage],
            });
        });

        it('should return all the left hand side types for comparison rules', () => {
            const rules = getLHSTypes(mockRules, COMPARISON);
            const expectedStage = mockRules[3][LEFT];
            expect(rules).toMatchObject({
                'STAGE': [expectedStage],
            });
        });

        it('should remove duplicates from list of left hand side types', () => {
            const rules = getLHSTypes(mockRules, COMPARISON);
            expect(Object.keys(rules)).toHaveLength(1);
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getLHSTypes(mockRules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getLHSTypes(42, ASSIGNMENT);
            }).toThrow();
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getLHSTypes(mockRules, 'invalidRuleType');
            }).toThrow();
        });
    });

    describe('get operator types util', () => {
        it('should only return results from the given rule type', () => {
            let operators = getOperators(lhsElementDate, mockRules, ASSIGNMENT);
            expect(operators).toHaveLength(1);
            operators = getOperators(lhsElementStage, mockRules, COMPARISON);
            expect(operators).toHaveLength(1);
        });

        it('should return an empty array if given no lhs information', () => {
            const operators = getOperators(undefined, mockRules, ASSIGNMENT);
            expect(operators).toHaveLength(0);
        });

        it('should return all the operators per rule type', () => {
            let operators = getOperators(lhsElementDate, mockRules, ASSIGNMENT);
            expect(operators[0]).toEqual(ASSIGNMENT_OPERATOR);
            operators = getOperators(lhsElementStage, mockRules, COMPARISON);
            expect(operators[0]).toEqual(ADD_OPERATOR);
        });

        it('should remove duplicates from the list of operators', () => {
            const operators = getOperators(lhsElementStage, mockRules, COMPARISON);
            expect(operators).toHaveLength(1);
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getOperators(lhsElementDate, mockRules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getOperators(lhsElementDate, 42, ASSIGNMENT);
            }).toThrow();
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getOperators(lhsElementDate, mockRules, 'invalidRuleType');
            }).toThrow();
        });
    });

    describe('get right hand side types util', () => {
        it('should return an empty object if given no lhs information', () => {
            const rhsTypes = getRHSTypes(undefined, 'someOperator', mockRules, ASSIGNMENT);
            expect(Object.keys(rhsTypes)).toHaveLength(0);
        });

        it('should return an object with data type to param type mapping', () => {
            let rhsTypes = getRHSTypes(lhsElementDate, ASSIGNMENT_OPERATOR, mockRules, ASSIGNMENT);
            expect(Object.keys(rhsTypes)).toHaveLength(2);
            expect(rhsTypes).toMatchObject({
                'Date': expect.any(Array),
                'DateTime': expect.any(Array),
            });
            rhsTypes = getRHSTypes(lhsElementStage, ADD_OPERATOR, mockRules, COMPARISON);
            expect(Object.keys(rhsTypes)).toHaveLength(1);
            expect(rhsTypes).toMatchObject({
                'STAGE': expect.any(Array),
            });
        });

        it('should return all the rhsTypes for assignment rules', () => {
            const rhsTypes = getRHSTypes(lhsElementDate, ASSIGNMENT_OPERATOR, mockRules, ASSIGNMENT);
            const expectedDate = mockRules[0][RHS_PARAMS][0];
            const expectedDateTime = mockRules[0][RHS_PARAMS][1];
            expect(rhsTypes).toMatchObject({
                'Date': [expectedDate],
                'DateTime': [expectedDateTime],
            });
        });

        it('shoudl return all the rhsTypes for the comaprison rules', () => {
            const rhsTypes = getRHSTypes(lhsElementStage, ADD_OPERATOR, mockRules, COMPARISON);
            const expectedStage = mockRules[2][RHS_PARAMS][0];
            expect(rhsTypes).toMatchObject({
                'STAGE': [expectedStage],
            });
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getRHSTypes(lhsElementDate, ASSIGNMENT_OPERATOR, mockRules, 'invalidRuleType');
            }).toThrow();
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getRHSTypes(lhsElementDate, ASSIGNMENT_OPERATOR, mockRules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getRHSTypes(lhsElementDate, ASSIGNMENT_OPERATOR, 42, ASSIGNMENT);
            }).toThrow();
        });

        it('throws an error when given an invalid operator type', () => {
            expect(() => {
                getRHSTypes(lhsElementDate, 'someInvalidOperator', mockRules, ASSIGNMENT);
            }).toThrow();
        });
    });
});