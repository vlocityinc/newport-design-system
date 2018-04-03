import { isMatch, getLHSTypes, getOperators, getRHSTypes } from 'builder_platform_interaction-rule-lib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-constant';
import { mockRules, dateParam, stageParam } from 'mock-rule-service';
import { elements, dateVariableGuid, stageGuid, accountSObjectVariableGuid } from 'mock-store-data';
import { RULE_TYPES, RULE_PROPERTY } from '../rules';

const { ASSIGNMENT, COMPARISON } = RULE_TYPES;
const { DATE } = FLOW_DATA_TYPE;
const ASSIGNMENT_OPERATOR = 'Assign';
const EQUALS_OPERATOR = 'Equals';
const { LEFT, RHS_PARAMS } = RULE_PROPERTY;

describe('Operator Rule Util', () => {
    describe('isMatch util', () => {
        it('should return true if rule param and store element match', () => {
            const isEqual = isMatch(stageParam, elements[stageGuid]);
            expect(isEqual).toBeTruthy();
        });

        it('should return false if rule param and store element do not match', () => {
            const isEqual = isMatch(dateParam, elements[stageGuid]);
            expect(isEqual).toBeFalsy();
        });

        it('should return true if rule param and store element with no collection property match', () => {
            const lhsElementDateNoCollection = { dataType: DATE };
            const isEqual = isMatch(dateParam, lhsElementDateNoCollection);
            expect(isEqual).toBeTruthy();
        });

        it('should throw an error when given an empty rule param object', () => {
            expect(() => {
                isMatch({}, elements[dateVariableGuid]);
            }).toThrow();
        });

        it('should throw an error when given an empty element object', () => {
            expect(() => {
                isMatch(stageParam, {});
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
            const expectedSObject = mockRules[5][LEFT];
            expect(rules).toMatchObject({
                'Date': [expectedDate],
                'DateTime': [expectedDateTime],
                'STAGE': [expectedStage],
                'SObject': [expectedSObject],
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
            let operators = getOperators(elements[dateVariableGuid], mockRules, ASSIGNMENT);
            expect(operators).toHaveLength(1);
            operators = getOperators(elements[stageGuid], mockRules, COMPARISON);
            expect(operators).toHaveLength(1);
        });

        it('should return an empty array if given no lhs information', () => {
            const operators = getOperators(undefined, mockRules, ASSIGNMENT);
            expect(operators).toHaveLength(0);
        });

        it('should return all the operators per rule type', () => {
            let operators = getOperators(elements[dateVariableGuid], mockRules, ASSIGNMENT);
            expect(operators[0]).toEqual(ASSIGNMENT_OPERATOR);
            operators = getOperators(elements[stageGuid], mockRules, COMPARISON);
            expect(operators[0]).toEqual(EQUALS_OPERATOR);
        });

        it('should remove duplicates from the list of operators', () => {
            const operators = getOperators(elements[stageGuid], mockRules, COMPARISON);
            expect(operators).toHaveLength(1);
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getOperators(elements[dateVariableGuid], mockRules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getOperators(elements[dateVariableGuid], 42, ASSIGNMENT);
            }).toThrow();
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getOperators(elements[dateVariableGuid], mockRules, 'invalidRuleType');
            }).toThrow();
        });
    });

    describe('get right hand side types util', () => {
        it('should return an empty object if given no lhs information', () => {
            const rhsTypes = getRHSTypes(undefined, 'someOperator', mockRules, ASSIGNMENT);
            expect(Object.keys(rhsTypes)).toHaveLength(0);
        });

        it('should return an object with data type to param type mapping', () => {
            let rhsTypes = getRHSTypes(elements[dateVariableGuid], ASSIGNMENT_OPERATOR, mockRules, ASSIGNMENT);
            expect(Object.keys(rhsTypes)).toHaveLength(2);
            expect(rhsTypes).toMatchObject({
                'Date': expect.any(Array),
                'DateTime': expect.any(Array),
            });
            rhsTypes = getRHSTypes(elements[stageGuid], EQUALS_OPERATOR, mockRules, COMPARISON);
            expect(Object.keys(rhsTypes)).toHaveLength(1);
            expect(rhsTypes).toMatchObject({
                'STAGE': expect.any(Array),
            });
        });

        it('should return all the rhsTypes for assignment rules', () => {
            const rhsTypes = getRHSTypes(elements[dateVariableGuid], ASSIGNMENT_OPERATOR, mockRules, ASSIGNMENT);
            const expectedDate = mockRules[0][RHS_PARAMS][0];
            const expectedDateTime = mockRules[0][RHS_PARAMS][1];
            expect(rhsTypes).toMatchObject({
                'Date': [expectedDate],
                'DateTime': [expectedDateTime],
            });
        });

        it('should return all the rhsTypes for the comparison rules', () => {
            const rhsTypes = getRHSTypes(elements[stageGuid], EQUALS_OPERATOR, mockRules, COMPARISON);
            const expectedStage = mockRules[2][RHS_PARAMS][0];
            expect(rhsTypes).toMatchObject({
                'STAGE': [expectedStage],
            });
        });

        it('should sort sObjects by object type', () => {
            const rhsTypes = getRHSTypes(elements[accountSObjectVariableGuid], ASSIGNMENT_OPERATOR, mockRules, ASSIGNMENT);
            expect(rhsTypes).toHaveProperty('Account');
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getRHSTypes(elements[dateVariableGuid], ASSIGNMENT_OPERATOR, mockRules, 'invalidRuleType');
            }).toThrow();
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getRHSTypes(elements[dateVariableGuid], ASSIGNMENT_OPERATOR, mockRules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getRHSTypes(elements[dateVariableGuid], ASSIGNMENT_OPERATOR, 42, ASSIGNMENT);
            }).toThrow();
        });
    });
});