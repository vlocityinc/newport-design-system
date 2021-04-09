// @ts-nocheck
import {
    isMatch,
    getLHSTypes,
    getOperators,
    getRHSTypes,
    transformOperatorsForCombobox,
    setOperators,
    isCollectionRequired
} from '../operatorRuleUtil';
import {
    dateCollectionParam,
    dateParam,
    dateParamCannotBeElements,
    dateParamMissingCollection,
    dateParamMustBeElements,
    dateParamNoElementsList,
    numberParamCanBeAnything,
    numberParamCannotBeField,
    numberParamCannotBeProperty,
    numberParamMustBeField,
    numberParamMustBeProperty,
    stageParam,
    stringParam
} from 'mock/ruleService';
import {
    stringVariableForPropertyEditor,
    dateVariable,
    dateCollectionVariable,
    stageElement,
    accountSObjectVariable
} from 'mock/storeData';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import { rulesForRecordTriggerTypeCreate } from 'serverData/RetrieveAllRules/rulesForRecordTriggerTypeCreate.json';
import { rulesForRecordTriggerTypeUpdate } from 'serverData/RetrieveAllRules/rulesForRecordTriggerTypeUpdate.json';
import { PARAM_PROPERTY, setRules, getRulesForElementType } from '../rules';
import {
    ELEMENT_TYPE,
    UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE,
    FlowComparisonOperator
} from 'builder_platform_interaction/flowMetadata';
import { ASSIGNMENT, COMPARISON, setOfDistinctRhsParams } from './operatorAndRulesTestUtil';
const ASSIGNMENT_OPERATOR = 'Assign';
const EQUALS_OPERATOR = 'EqualTo';
const {
    IS_COLLECTION,
    SYSTEM_VARIABLE_REQUIREMENT,
    SOBJECT_FIELD_REQUIREMENT,
    APEX_PROPERTY_REQUIREMENT
} = PARAM_PROPERTY;
const mockAccountField = {
    sobjectName: 'Account',
    dataType: 'Number'
};
const mockApexProperty = {
    apexClass: 'someApex',
    dataType: 'Number'
};

const RULES_WITH_EXCLUSION = rules.filter((rule) => rule.excludeElems && rule.excludeElems.length > 0);
const RULE_WITH_EXCLUSION = RULES_WITH_EXCLUSION[0];
const ELEMENT_TYPE_WITH_EXCLUSION = RULE_WITH_EXCLUSION.excludeElems[0];
const RULE_TYPE_WITH_EXCLUSION = RULE_WITH_EXCLUSION.ruleType;
const RULES_WITH_EXCLUSION_LEFTS_AND_OPERATORS = RULES_WITH_EXCLUSION.filter(
    (rule) =>
        rule.ruleType === RULE_TYPE_WITH_EXCLUSION &&
        rule.excludeElems &&
        rule.excludeElems.includes(ELEMENT_TYPE_WITH_EXCLUSION) &&
        rule.left &&
        (rule.left.dataType === 'Date' || (rule.left.mustBeElements && rule.left.mustBeElements.includes('STAGE')))
).map((rule) => ({ left: rule.left, operator: rule.assignmentOperator || rule.comparisonOperator }));
const RULES_WITH_EXCLUSION_LEFTS = RULES_WITH_EXCLUSION_LEFTS_AND_OPERATORS.map(
    (ruleLeftAndOperator) => ruleLeftAndOperator.left
);

const uiElementType = (ruleElementType) =>
    Object.keys(UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE).find(
        (uiElementTypeKey) => UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE[uiElementTypeKey] === ruleElementType
    );
const setOfDistinctLeftParams = (filter) =>
    new Set(rules.filter((rule) => filter(rule)).map((rule) => JSON.stringify(rule.left)));

const ruleTypeFilter = (rule, ruleType) => rule.ruleType === ruleType;
const lhsDataTypeFilter = (rule, dataType) => rule.left && rule.left.dataType === dataType;
const lhsElementFilter = (rule, element) =>
    rule.left && rule.left.mustBeElements && rule.left.mustBeElements.includes(element);
const arrayToUndefinedIfEmpty = (array) => (array && array.length > 0 ? array : undefined);
const setOfStringifiedParamsToArray = (setOfStringifiedParams) =>
    Array.from(setOfStringifiedParams).map((entry) => JSON.parse(entry));
const dataTypeAndElementsFromRuleLefts = (ruleLefts) => {
    const lhsDataTypesOfRuleWithExclusion = [];
    const lhsElementsOfRuleWithExclusion = [];
    ruleLefts.forEach((ruleLeft) => {
        if (ruleLeft.dataType) {
            lhsDataTypesOfRuleWithExclusion.push(ruleLeft.dataType);
        } else if (ruleLeft.mustBeElements) {
            lhsElementsOfRuleWithExclusion.push(...ruleLeft.mustBeElements);
        }
    });
    return { lhsDataTypesOfRuleWithExclusion, lhsElementsOfRuleWithExclusion };
};

describe('Operator Rule Util', () => {
    let assignmentAssignmentRules, assignmentComparisonRules, elementTypeWithExclusionRules;
    beforeAll(() => {
        setRules(rules);
        assignmentAssignmentRules = getRulesForElementType(ASSIGNMENT, ELEMENT_TYPE.ASSIGNMENT);
        assignmentComparisonRules = getRulesForElementType(COMPARISON, ELEMENT_TYPE.ASSIGNMENT);
        elementTypeWithExclusionRules = getRulesForElementType(RULE_TYPE_WITH_EXCLUSION, ELEMENT_TYPE_WITH_EXCLUSION);
    });
    describe('isMatch util', () => {
        it('should return true if rule param and store element hydrated with errors match', () => {
            const stringParamWithLowerCase = { ...stringParam };
            stringParamWithLowerCase.dataType = 'string';
            const isEqual = isMatch(stringParamWithLowerCase, stringVariableForPropertyEditor());
            expect(isEqual).toBeTruthy();
        });
        it('should return true if rule param and store element hydrated with errors match ignoring case', () => {
            const isEqual = isMatch(stringParam, stringVariableForPropertyEditor());
            expect(isEqual).toBeTruthy();
        });

        it('should throw an error when given an empty rule param object', () => {
            expect(() => {
                isMatch({}, dateVariable);
            }).toThrow();
        });

        it('should throw an error when given an empty element object', () => {
            expect(() => {
                isMatch(stageParam, {});
            }).toThrow();
        });
        it('rule with collection = true should only match collection elements', () => {
            let isEqual = isMatch(dateCollectionParam, dateCollectionVariable);
            expect(isEqual).toBeTruthy();
            isEqual = isMatch(dateCollectionParam, dateVariable);
            expect(isEqual).toBeFalsy();
        });
        it('rule with collection = false should not match collection elements', () => {
            let isEqual = isMatch(dateParam, dateVariable);
            expect(isEqual).toBeTruthy();
            isEqual = isMatch(dateParam, dateCollectionVariable);
            expect(isEqual).toBeFalsy();
        });
        it('rule with collection undefined should match noncollection or collection elements', () => {
            let isEqual = isMatch(dateParamMissingCollection, dateVariable);
            expect(isEqual).toBeTruthy();
            isEqual = isMatch(dateParamMissingCollection, dateCollectionVariable);
            expect(isEqual).toBeTruthy();
        });
        it('for dataType param, elementType can be in canBe or mustBe list', () => {
            let isEqual = isMatch(dateParam, dateVariable);
            expect(isEqual).toBeTruthy();
            isEqual = isMatch(dateParamMustBeElements, dateVariable);
            expect(isEqual).toBeTruthy();
        });
        it('for dataType param, elementType can not be in cannotBe list', () => {
            const isEqual = isMatch(dateParamCannotBeElements, dateVariable);
            expect(isEqual).toBeFalsy();
        });
        it('dataType param should match if elementType is not mentioned', () => {
            const isEqual = isMatch(dateParamNoElementsList, dateVariable);
            expect(isEqual).toBeTruthy();
        });
        it('field should not be allowed if operator param says cannotBe sObjectField', () => {
            const isEqual = isMatch(numberParamCannotBeField, mockAccountField);
            expect(isEqual).toBeFalsy();
        });
        it('field should be allowed if operator param says canBe or mustBe sObjectField', () => {
            let isEqual = isMatch(numberParamCanBeAnything, mockAccountField);
            expect(isEqual).toBeTruthy();
            isEqual = isMatch(numberParamMustBeField, mockAccountField);
            expect(isEqual).toBeTruthy();
        });
        it('property should not be allowed if operator param says cannotBe apexProperty', () => {
            const isEqual = isMatch(numberParamCannotBeProperty, mockApexProperty);
            expect(isEqual).toBeFalsy();
        });
        it('field should be allowed if operator param says canBe or mustBe apexProperty', () => {
            let isEqual = isMatch(numberParamCanBeAnything, mockApexProperty);
            expect(isEqual).toBeTruthy();
            isEqual = isMatch(numberParamMustBeProperty, mockApexProperty);
            expect(isEqual).toBeTruthy();
        });
    });

    describe('get left hand side types util', () => {
        it('should return an object', () => {
            const lhsTypes = getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, assignmentAssignmentRules, ASSIGNMENT);
            expect(lhsTypes).toEqual(expect.any(Object));
        });

        it('should return an object with data type to param type mapping', () => {
            const lhsTypes = getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, assignmentAssignmentRules, ASSIGNMENT);
            const keys = Object.keys(lhsTypes);
            expect(lhsTypes).toMatchObject({
                [keys[0]]: expect.any(Array)
            });
        });

        it('should return all the left hand side types for rules, excluding appropriately', () => {
            const {
                lhsDataTypesOfRuleWithExclusion,
                lhsElementsOfRuleWithExclusion
            } = dataTypeAndElementsFromRuleLefts(RULES_WITH_EXCLUSION_LEFTS);
            const expectedDataTypes = (excludedDataType) =>
                setOfStringifiedParamsToArray(
                    setOfDistinctLeftParams(
                        (rule) =>
                            ruleTypeFilter(rule, RULE_TYPE_WITH_EXCLUSION) &&
                            lhsDataTypeFilter(rule, excludedDataType) &&
                            (!rule.excludeElems || !rule.excludeElems.includes(ELEMENT_TYPE_WITH_EXCLUSION))
                    )
                );
            const expectedElements = (excludedElement) =>
                setOfStringifiedParamsToArray(
                    setOfDistinctLeftParams(
                        (rule) =>
                            ruleTypeFilter(rule, RULE_TYPE_WITH_EXCLUSION) &&
                            lhsElementFilter(rule, excludedElement) &&
                            (!rule.excludeElems || !rule.excludeElems.includes(ELEMENT_TYPE_WITH_EXCLUSION))
                    )
                );

            const lhsTypes = getLHSTypes(
                uiElementType(ELEMENT_TYPE_WITH_EXCLUSION),
                elementTypeWithExclusionRules,
                RULE_TYPE_WITH_EXCLUSION
            );

            lhsDataTypesOfRuleWithExclusion.forEach((excludedDataType) =>
                expect(lhsTypes[excludedDataType]).toStrictEqual(
                    arrayToUndefinedIfEmpty(expectedDataTypes(excludedDataType))
                )
            );
            lhsElementsOfRuleWithExclusion.forEach((excludedElement) =>
                expect(lhsTypes[excludedElement]).toBe(arrayToUndefinedIfEmpty(expectedElements(excludedElement)))
            );
        });

        it('should return all the left hand side types for assignment rules', () => {
            const expectedDates = setOfStringifiedParamsToArray(
                setOfDistinctLeftParams((rule) => ruleTypeFilter(rule, ASSIGNMENT) && lhsDataTypeFilter(rule, 'Date'))
            );
            const expectedSObject = setOfStringifiedParamsToArray(
                setOfDistinctLeftParams(
                    (rule) => ruleTypeFilter(rule, ASSIGNMENT) && lhsDataTypeFilter(rule, 'SObject')
                )
            );
            const expectedStage = setOfStringifiedParamsToArray(
                setOfDistinctLeftParams((rule) => ruleTypeFilter(rule, ASSIGNMENT) && lhsElementFilter(rule, 'STAGE'))
            );
            const expectedDateTimes = setOfStringifiedParamsToArray(
                setOfDistinctLeftParams(
                    (rule) => ruleTypeFilter(rule, ASSIGNMENT) && lhsDataTypeFilter(rule, 'DateTime')
                )
            );

            const lhsTypes = getLHSTypes(
                ELEMENT_TYPE.RECORD_CREATE,
                getRulesForElementType(ASSIGNMENT, ELEMENT_TYPE.RECORD_CREATE),
                ASSIGNMENT
            );

            expect(lhsTypes).toMatchObject({
                Date: expectedDates,
                DateTime: expectedDateTimes,
                STAGE: expectedStage,
                SObject: expectedSObject
            });
        });

        it('should return all the left hand side types for comparison rules', () => {
            const expectedStage = setOfStringifiedParamsToArray(
                setOfDistinctLeftParams((rule) => ruleTypeFilter(rule, COMPARISON) && lhsElementFilter(rule, 'STAGE'))
            );

            const lhsTypes = getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, assignmentComparisonRules, COMPARISON);

            expect(lhsTypes).toMatchObject({
                STAGE: expectedStage
            });
        });

        it('should remove duplicates from list of left hand side types', () => {
            const {
                lhsDataTypesOfRuleWithExclusion,
                lhsElementsOfRuleWithExclusion
            } = dataTypeAndElementsFromRuleLefts(assignmentComparisonRules.map((rule) => rule.left));
            lhsDataTypesOfRuleWithExclusion.push(...lhsElementsOfRuleWithExclusion);
            const nbDistinctDataTypesAndElements = new Set(lhsDataTypesOfRuleWithExclusion).size;

            const lhsTypes = getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, assignmentComparisonRules, COMPARISON);

            expect(Object.keys(lhsTypes)).toHaveLength(nbDistinctDataTypesAndElements + 3); // 3 for canBeSobjectField, canBeSystemVariable, canBeApexProperty
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, rules);
            }).not.toThrow();
        });

        it('throws an error when the given rules are not an Array', () => {
            expect(() => {
                getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, 42, ASSIGNMENT);
            }).toThrow();
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getLHSTypes(ELEMENT_TYPE.ASSIGNMENT, rules, 'invalidRuleType');
            }).toThrow();
        });
    });

    describe('get operator types util', () => {
        const canBeFilter = (left, variableOrElement) => {
            if (left.canBeApexProperty === 'MustBe') {
                return variableOrElement.apexClass;
            }
            if (left.canBeSobjectField === 'MustBe') {
                return variableOrElement.sobjectName;
            }
            if (left.canBeSystemVariable === 'MustBe') {
                return variableOrElement.category;
            }
            let cannotBeCheck = true;
            if (left.canBeApexProperty === 'CannotBe') {
                cannotBeCheck = !variableOrElement.apexClass;
            }
            if (left.canBeSobjectField === 'CannotBe') {
                cannotBeCheck = !variableOrElement.sobjectName;
            }
            if (left.canBeSystemVariable === 'CannotBe') {
                cannotBeCheck = !variableOrElement.category;
            }
            return cannotBeCheck;
        };

        const operatorsPerRuleTypeAndLHSTypeForVariable = (variable, ruleType, elementType) =>
            new Set(
                rules
                    .filter(
                        (rule) =>
                            rule.ruleType === ruleType &&
                            rule.left &&
                            rule.left.dataType === variable.dataType &&
                            rule.left.collection === variable.isCollection &&
                            !rule.excludeElems.includes(elementType) &&
                            canBeFilter(rule.left, variable)
                    )
                    .map((rule) => rule[ruleType + 'Operator'].value)
            );

        const operatorsPerRuleTypeAndLHSTypeForElement = (element, ruleType, elementType) =>
            new Set(
                rules
                    .filter(
                        (rule) =>
                            rule.ruleType === ruleType &&
                            rule.left &&
                            rule.left.mustBeElements &&
                            rule.left.mustBeElements.includes(element) &&
                            !rule.excludeElems.includes(elementType) &&
                            !rule.excludeElems.includes(element) &&
                            canBeFilter(rule.left, element)
                    )
                    .map((rule) => rule[ruleType + 'Operator'].value)
            );
        const elementTypeInRuleName = (element) =>
            UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE[element.elementType] || element.elementType;

        it('should only return results from the given rule type', () => {
            let operators = getOperators(ELEMENT_TYPE.ASSIGNMENT, dateVariable, assignmentAssignmentRules, ASSIGNMENT);
            expect(operators).toHaveLength(
                operatorsPerRuleTypeAndLHSTypeForVariable(dateVariable, ASSIGNMENT, ELEMENT_TYPE.ASSIGNMENT).size
            );

            operators = getOperators(ELEMENT_TYPE.ASSIGNMENT, stageElement, assignmentComparisonRules, COMPARISON);

            expect(operators).toHaveLength(
                operatorsPerRuleTypeAndLHSTypeForElement(
                    elementTypeInRuleName(stageElement),
                    COMPARISON,
                    ELEMENT_TYPE.ASSIGNMENT
                ).size
            );
        });

        it('should return an empty array if given no lhs information', () => {
            const operators = getOperators(ELEMENT_TYPE.ASSIGNMENT, undefined, assignmentAssignmentRules, ASSIGNMENT);
            expect(operators).toHaveLength(0);
        });

        it('should return all the operators per rule type', () => {
            let operators = getOperators(ELEMENT_TYPE.ASSIGNMENT, dateVariable, assignmentAssignmentRules, ASSIGNMENT);
            expect(operators).toEqual(
                Array.from(operatorsPerRuleTypeAndLHSTypeForVariable(dateVariable, ASSIGNMENT, ELEMENT_TYPE.ASSIGNMENT))
            );
            operators = getOperators(ELEMENT_TYPE.ASSIGNMENT, stageElement, assignmentComparisonRules, COMPARISON);

            expect(operators).toEqual(
                Array.from(
                    operatorsPerRuleTypeAndLHSTypeForElement(
                        elementTypeInRuleName(stageElement),
                        COMPARISON,
                        ELEMENT_TYPE.ASSIGNMENT
                    )
                )
            );
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getOperators(ELEMENT_TYPE.ASSIGNMENT, dateVariable, rules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getOperators(ELEMENT_TYPE.ASSIGNMENT, dateVariable, 42, ASSIGNMENT);
            }).toThrow();
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getOperators(ELEMENT_TYPE.ASSIGNMENT, dateVariable, rules, 'invalidRuleType');
            }).toThrow();
        });
    });

    describe('transformOperatorsForCombobox', () => {
        const mockOperators = ['fancyOperator'];
        const mockMap = {
            fancyOperator: 'Fancy Operator'
        };

        beforeEach(() => {
            setOperators(mockMap);
        });

        it('returns a menu item with label from operator label map', () => {
            const result = transformOperatorsForCombobox(mockOperators);
            expect(result).toEqual(expect.any(Array));
            expect(result).toEqual([{ value: mockOperators[0], label: mockMap[mockOperators[0]] }]);
        });

        it('returns an array of objects with value and label properties', () => {
            const result = transformOperatorsForCombobox(mockOperators);
            expect(result).toEqual([{ value: expect.anything(), label: expect.anything() }]);
        });
    });

    describe('get right hand side types util', () => {
        const allowedValues = ['CanBe', 'MustBe'];

        const getCanBe = (params) => {
            let canBeSobjectField = false;
            let canBeApexProperty = false;
            let canBeSystemVariable = false;
            params.forEach((param) => {
                canBeSobjectField = canBeSobjectField || allowedValues.includes(param.canBeSobjectField);
                canBeApexProperty = canBeApexProperty || allowedValues.includes(param.canBeApexProperty);
                canBeSystemVariable = canBeSystemVariable || allowedValues.includes(param.canBeSystemVariable);
            });
            return { canBeSobjectField, canBeApexProperty, canBeSystemVariable };
        };

        it('should return an empty object if given no lhs information', () => {
            const rhsTypes = getRHSTypes(
                ELEMENT_TYPE.ASSIGNMENT,
                undefined,
                EQUALS_OPERATOR,
                assignmentAssignmentRules,
                ASSIGNMENT
            );

            expect(Object.keys(rhsTypes)).toHaveLength(0);
        });

        it('should return an object with data type to param type mapping', () => {
            const rhsTypes = getRHSTypes(
                ELEMENT_TYPE.ASSIGNMENT,
                dateVariable,
                ASSIGNMENT_OPERATOR,
                assignmentAssignmentRules,
                ASSIGNMENT
            );

            expect(Object.keys(rhsTypes)).toHaveLength(6);
            expect(rhsTypes).toMatchObject({
                Date: expect.any(Array),
                DateTime: expect.any(Array),
                '': expect.any(Array),
                [SOBJECT_FIELD_REQUIREMENT]: true,
                [SYSTEM_VARIABLE_REQUIREMENT]: true,
                [APEX_PROPERTY_REQUIREMENT]: true
            });
        });

        it('should return an object with data type to param type mapping for all rules that match', () => {
            const expectedRHSParams = setOfStringifiedParamsToArray(
                setOfDistinctRhsParams(
                    assignmentComparisonRules,
                    (rule) =>
                        lhsElementFilter(rule, 'STAGE') &&
                        ruleTypeFilter(rule, COMPARISON) &&
                        rule.comparisonOperator.value === EQUALS_OPERATOR
                )
            );
            const { canBeSobjectField, canBeApexProperty, canBeSystemVariable } = getCanBe(expectedRHSParams);

            const rhsTypes = getRHSTypes(
                ELEMENT_TYPE.ASSIGNMENT,
                stageElement,
                EQUALS_OPERATOR,
                assignmentComparisonRules,
                COMPARISON
            );
            expect(Object.keys(rhsTypes)).toHaveLength(5);
            // the Stage param & String param come from two different rules that match the LHS & operator pair
            expect(rhsTypes).toMatchObject({
                STAGE: expect.any(Array),
                String: expect.any(Array),
                [SOBJECT_FIELD_REQUIREMENT]: canBeSobjectField,
                [SYSTEM_VARIABLE_REQUIREMENT]: canBeSystemVariable,
                [APEX_PROPERTY_REQUIREMENT]: canBeApexProperty
            });
        });

        it('should return all the rhsTypes for assignment rules', () => {
            const expectedRHSParams = setOfStringifiedParamsToArray(
                setOfDistinctRhsParams(
                    assignmentAssignmentRules,
                    (rule) =>
                        lhsDataTypeFilter(rule, dateVariable.dataType) &&
                        rule.left &&
                        rule.left.collection === dateVariable.isCollection &&
                        ruleTypeFilter(rule, ASSIGNMENT) &&
                        rule.assignmentOperator.value === ASSIGNMENT_OPERATOR
                )
            );

            const rhsTypes = getRHSTypes(
                ELEMENT_TYPE.ASSIGNMENT,
                dateVariable,
                ASSIGNMENT_OPERATOR,
                assignmentAssignmentRules,
                ASSIGNMENT
            );

            expect(rhsTypes).toMatchObject({
                Date: expectedRHSParams.filter((rhsParam) => rhsParam.dataType === 'Date'),
                DateTime: expectedRHSParams.filter((rhsParam) => rhsParam.dataType === 'DateTime')
            });
        });

        it('should return all the rhsTypes for the comparison rules, excluding appropriately', () => {
            expect(RULES_WITH_EXCLUSION_LEFTS_AND_OPERATORS.length).toBeGreaterThan(0);

            const expectedRhsParamsForDatatype = (operator) =>
                setOfStringifiedParamsToArray(
                    setOfDistinctRhsParams(
                        elementTypeWithExclusionRules,
                        (rule) =>
                            ruleTypeFilter(rule, RULE_TYPE_WITH_EXCLUSION) &&
                            rule[RULE_TYPE_WITH_EXCLUSION + 'Operator'].value === operator &&
                            lhsDataTypeFilter(rule, 'Date') &&
                            (!rule.excludeElems || !rule.excludeElems.includes(ELEMENT_TYPE_WITH_EXCLUSION))
                    )
                );

            const expectedRhsParamsForElements = (operator) =>
                setOfStringifiedParamsToArray(
                    setOfDistinctRhsParams(
                        elementTypeWithExclusionRules,
                        (rule) =>
                            ruleTypeFilter(rule, RULE_TYPE_WITH_EXCLUSION) &&
                            rule[RULE_TYPE_WITH_EXCLUSION + 'Operator'].value === operator &&
                            lhsElementFilter(rule, 'STAGE') &&
                            (!rule.excludeElems || !rule.excludeElems.includes(ELEMENT_TYPE_WITH_EXCLUSION))
                    )
                );

            let expectedParams, lhsForTest;
            RULES_WITH_EXCLUSION_LEFTS_AND_OPERATORS.forEach((rulesWithExclusionLeftAndOperator) => {
                if (rulesWithExclusionLeftAndOperator.left.dataType === 'Date') {
                    expectedParams = expectedRhsParamsForDatatype(rulesWithExclusionLeftAndOperator.operator.value);
                    lhsForTest = dateVariable;
                } else {
                    expectedParams = expectedRhsParamsForElements(rulesWithExclusionLeftAndOperator.operator.value);
                    lhsForTest = stageElement;
                }
                if (expectedParams.length > 0) {
                    expectedParams.push(getCanBe(expectedParams));
                } else {
                    expectedParams = getCanBe(expectedParams);
                }

                const rhsTypes = getRHSTypes(
                    uiElementType(ELEMENT_TYPE_WITH_EXCLUSION),
                    lhsForTest,
                    rulesWithExclusionLeftAndOperator.operator.value,
                    elementTypeWithExclusionRules,
                    RULE_TYPE_WITH_EXCLUSION
                );

                expect(rhsTypes).toEqual(expectedParams);
            });
        });

        it('should return all the rhsTypes for the comparison rules', () => {
            const recordUpdateComparisonRules = getRulesForElementType(COMPARISON, ELEMENT_TYPE.RECORD_UPDATE);
            const expectedRHSParams = setOfStringifiedParamsToArray(
                setOfDistinctRhsParams(
                    recordUpdateComparisonRules,
                    (rule) =>
                        lhsElementFilter(rule, 'STAGE') &&
                        rule.left &&
                        rule.left.collection === dateVariable.isCollection &&
                        ruleTypeFilter(rule, COMPARISON) &&
                        rule.comparisonOperator.value === EQUALS_OPERATOR
                )
            );

            const rhsTypes = getRHSTypes(
                ELEMENT_TYPE.RECORD_UPDATE,
                stageElement,
                EQUALS_OPERATOR,
                recordUpdateComparisonRules,
                COMPARISON
            );

            expect(rhsTypes).toMatchObject({
                STAGE: expectedRHSParams.filter(
                    (rhsParam) => rhsParam.mustBeElements && rhsParam.mustBeElements.includes('STAGE')
                )
            });
        });

        it('should sort sObjects by object type', () => {
            const rhsTypes = getRHSTypes(
                ELEMENT_TYPE.ASSIGNMENT,
                accountSObjectVariable,
                ASSIGNMENT_OPERATOR,
                assignmentAssignmentRules,
                ASSIGNMENT
            );
            expect(rhsTypes).toHaveProperty('Account');
        });

        it('throws an error when given an invalid rule type', () => {
            expect(() => {
                getRHSTypes(ELEMENT_TYPE.ASSIGNMENT, dateVariable, ASSIGNMENT_OPERATOR, rules, 'invalidRuleType');
            }).toThrow();
        });

        it('does not throw an error when given an undefined rule type', () => {
            expect(() => {
                getRHSTypes(ELEMENT_TYPE.ASSIGNMENT, dateVariable, ASSIGNMENT_OPERATOR, rules);
            }).not.toThrow();
        });

        it('throws an error when the give rules are not an Array', () => {
            expect(() => {
                getRHSTypes(ELEMENT_TYPE.ASSIGNMENT, dateVariable, ASSIGNMENT_OPERATOR, 42, ASSIGNMENT);
            }).toThrow();
        });
    });

    describe('isCollectionRequired', () => {
        it('returns false when given no dataType', () => {
            const isRequired = isCollectionRequired({});
            expect(isRequired).toEqual(false);
        });

        it('returns false when there is no param for the given dataType', () => {
            const isRequired = isCollectionRequired({}, 'fooDataType');
            expect(isRequired).toEqual(false);
        });

        it('returns false when there is a param where literals are allowed', () => {
            const mockDataType = 'fooDataType';
            const mockParam = { IS_COLLECTION: false };
            const mockAllowedParams = {
                [mockDataType]: [mockParam]
            };

            const isRequired = isCollectionRequired(mockAllowedParams, mockDataType);
            expect(isRequired).toEqual(false);
        });

        it('returns true when all params require a collection', () => {
            const mockDataType = 'fooDataType';
            const mockParamOne = { [IS_COLLECTION]: true };
            const mockParamTwo = { [IS_COLLECTION]: true };
            const mockAllowedParams = {
                [mockDataType]: [mockParamOne, mockParamTwo]
            };

            const isRequired = isCollectionRequired(mockAllowedParams, mockDataType);
            expect(isRequired).toEqual(true);
        });
    });

    describe('Record trigger type Update', () => {
        beforeAll(() => {
            setRules(rulesForRecordTriggerTypeUpdate);
        });
        it('should include isChanged comparison operator for element type Start', () => {
            assignmentComparisonRules = getRulesForElementType(COMPARISON, ELEMENT_TYPE.START_ELEMENT);
            const operators = getOperators(
                ELEMENT_TYPE.START_ELEMENT,
                accountSObjectVariable,
                assignmentComparisonRules,
                COMPARISON
            );
            expect(operators).toContain(FlowComparisonOperator.IsChanged);
        });

        it('should not include isChanged comparison operator for element type Record Update', () => {
            assignmentComparisonRules = getRulesForElementType(COMPARISON, ELEMENT_TYPE.RECORD_UPDATE);
            const operators = getOperators(
                ELEMENT_TYPE.RECORD_UPDATE,
                accountSObjectVariable,
                assignmentComparisonRules,
                COMPARISON
            );
            expect(operators).not.toContain(FlowComparisonOperator.IsChanged);
        });
    });

    describe('Record trigger type Create', () => {
        beforeAll(() => {
            setRules(rulesForRecordTriggerTypeCreate);
        });
        it('should not include isChanged comparison operator for element type Start', () => {
            assignmentComparisonRules = getRulesForElementType(COMPARISON, ELEMENT_TYPE.START_ELEMENT);
            const operators = getOperators(
                ELEMENT_TYPE.START_ELEMENT,
                accountSObjectVariable,
                assignmentComparisonRules,
                COMPARISON
            );
            expect(operators).not.toContain(FlowComparisonOperator.IsChanged);
        });
    });

    // no element param any more
    // if it's an apex type, store by apex class name in allowedParamType map
});
