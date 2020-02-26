import {
    RULE_TYPES,
    RULE_PROPERTY,
    RULE_OPERATOR,
    setRules,
    getRules,
    getOutputRules,
    getRulesForElementType
} from '../rules';
import { rules } from 'serverData/RetrieveAllRules/rules.json';
import { ELEMENT_TYPE, UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { hasArrayPopulated, setOfDistinctRhsParams, ASSIGNMENT, COMPARISON } from './operatorAndRulesTestUtil';

const { LEFT, RHS_PARAMS, EXCLUDE_ELEMS } = RULE_PROPERTY;

const NB_RULE_TYPES = new Set(rules.map(({ ruleType }) => ruleType)).size;
const NB_ASSIGNMENT_RULES = rules.filter(({ ruleType }) => ruleType === ASSIGNMENT).length;
const NB_COMPARISON_RULES = rules.filter(rule => rule.ruleType === COMPARISON).length;
const RULES_WITH_INCLUDE_ELEMENTS = rules.filter(rule => hasArrayPopulated(rule.includeElems));
const DISTINCT_INCLUDE_ELEMENTS = new Set(
    RULES_WITH_INCLUDE_ELEMENTS.reduce((acc, rule) => [...acc, ...rule.includeElems], [])
);
const RULES_WITH_INCLUDE_ELEMENTS_RULE_TYPES = RULES_WITH_INCLUDE_ELEMENTS.map(rule => rule.ruleType);
const NB_COMPARISON_RULES_WITH_INCLUDE_ELEMENTS = RULES_WITH_INCLUDE_ELEMENTS.filter(
    rule => rule.ruleType === COMPARISON
).length;
const NB_ASSIGNMENT_RULES_WITH_INCLUDE_ELEMENTS = RULES_WITH_INCLUDE_ELEMENTS.filter(
    rule => rule.ruleType === ASSIGNMENT
).length;

const verifyRuleTypeProperties = testRulesVariable => {
    expect(testRulesVariable).toHaveProperty(COMPARISON);
    expect(testRulesVariable).toHaveProperty(ASSIGNMENT);
};

const verifyRuleByIncludeElement = (storedRules, { ruleType: ruleWithIncludeElements }, includeElement) => {
    expect(storedRules).toHaveProperty(includeElement);
    const includeElementSpecificRules = storedRules[includeElement];
    expect(includeElementSpecificRules).toHaveProperty(ruleWithIncludeElements);
    expect(includeElementSpecificRules[ruleWithIncludeElements]).toHaveLength(
        RULES_WITH_INCLUDE_ELEMENTS.filter(
            rule => rule.ruleType === ruleWithIncludeElements && rule.includeElems.includes(includeElement)
        ).length
    );
};
const verifyOutputRulePerInitialRule = initialRule => {
    const initialLHS = initialRule[LEFT];
    const initialRHSParams = initialRule[RHS_PARAMS];
    const outputRules = getOutputRules();

    // each output rule has the initial rule's LHS as an RHS
    expect(outputRules[0][RHS_PARAMS]).toHaveLength(1);
    expect(outputRules[1][RHS_PARAMS]).toHaveLength(1);
    expect(outputRules[0][RHS_PARAMS][0]).toMatchObject(initialLHS);
    expect(outputRules[1][RHS_PARAMS][0]).toMatchObject(initialLHS);

    // each output rule has one of the initial RHS params as it's LHS
    expect(outputRules[0][LEFT]).toMatchObject(initialRHSParams[0]);
    expect(outputRules[1][LEFT]).toMatchObject(initialRHSParams[1]);

    if (hasArrayPopulated(initialRule.excludeElems)) {
        const initialExcludeElem = initialRule[EXCLUDE_ELEMS][0];
        // each output rule has the excludedElem set
        expect(outputRules[0][EXCLUDE_ELEMS]).toHaveLength(1);
        expect(outputRules[0][EXCLUDE_ELEMS][0]).toEqual(initialExcludeElem);
        expect(outputRules[0][EXCLUDE_ELEMS]).toHaveLength(1);
        expect(outputRules[0][EXCLUDE_ELEMS][0]).toEqual(initialExcludeElem);
    }

    return outputRules;
};

describe('Set Flow Operator Rules', () => {
    let storedRules;
    describe('Rules from service', () => {
        let nbDistinctIncludeElements, nbDistinctRhsParams;
        beforeAll(() => {
            const rhsParams = setOfDistinctRhsParams(rules);
            nbDistinctRhsParams = rhsParams.size;
            nbDistinctIncludeElements = DISTINCT_INCLUDE_ELEMENTS.size;
            setRules(rules);
            storedRules = getRules();
        });
        describe('setRules', () => {
            it('sets rules by rule type and elements in includeElems', () => {
                expect(Object.keys(storedRules)).toHaveLength(NB_RULE_TYPES + nbDistinctIncludeElements);
            });
            it('sets expected rule types', () => {
                verifyRuleTypeProperties(storedRules);
            });
            it('sets rules by rule type only for those without include elements', () => {
                expect(storedRules[ASSIGNMENT]).toHaveLength(
                    NB_ASSIGNMENT_RULES - NB_ASSIGNMENT_RULES_WITH_INCLUDE_ELEMENTS
                );
                expect(storedRules[COMPARISON]).toHaveLength(
                    NB_COMPARISON_RULES - NB_COMPARISON_RULES_WITH_INCLUDE_ELEMENTS
                );
            });
            it('sets the rules variable with rules with includedElems', () => {
                RULES_WITH_INCLUDE_ELEMENTS.forEach(ruleWithIncludeElements => {
                    ruleWithIncludeElements.includeElems.forEach(includeElement => {
                        verifyRuleByIncludeElement(storedRules, ruleWithIncludeElements, includeElement);
                    });
                });
            });
            it('sets output rules per distinct RHS params', () => {
                const outputRules = getOutputRules();

                expect(outputRules).toHaveLength(nbDistinctRhsParams);
            });
        });
        describe('get rules for element type', () => {
            it('gets comparison rules', () => {
                Object.keys(RULE_TYPES).forEach(ruleType => {
                    Object.keys(ELEMENT_TYPE).forEach(elementType => {
                        const ruleTypeName = RULE_TYPES[ruleType];
                        const elementTypeName = ELEMENT_TYPE[elementType];
                        const elementTypeInRuleName =
                            UI_ELEMENT_TYPE_TO_RULE_ELEMENT_TYPE[elementTypeName] || elementTypeName;
                        const rulesForElementType = getRulesForElementType(
                            RULE_TYPES[ruleType],
                            ELEMENT_TYPE[elementType]
                        );
                        if (
                            DISTINCT_INCLUDE_ELEMENTS.has(elementTypeInRuleName) &&
                            RULES_WITH_INCLUDE_ELEMENTS_RULE_TYPES.includes(ruleTypeName)
                        ) {
                            expect(rulesForElementType).toEqual(
                                storedRules[ruleTypeName].concat(storedRules[elementTypeInRuleName][ruleTypeName])
                            );
                        } else {
                            expect(rulesForElementType).toEqual(storedRules[ruleTypeName]);
                        }
                    });
                });
            });
        });
    });
    describe('getOutputRules with individual rule', () => {
        it('Stores assignment rules backwards to use as output rules', () => {
            rules.forEach(rule => {
                if (
                    rule.assignmentOperator &&
                    rule.assignmentOperator.value === RULE_OPERATOR.ASSIGN &&
                    hasArrayPopulated(rule.rhsParams)
                ) {
                    setRules([rule]);
                    verifyOutputRulePerInitialRule(rule);
                } else {
                    setRules([rule]);
                    expect(getOutputRules()).toStrictEqual([]);
                }
            });
        });
    });
    describe('rule service issues', () => {
        it('Creates the rules variable when the service returns null ', () => {
            setRules(null);
            storedRules = getRules();
            verifyRuleTypeProperties(storedRules);
            expect(storedRules[ASSIGNMENT]).toHaveLength(0);
            expect(storedRules[COMPARISON]).toHaveLength(0);
        });

        it('Creates the rules variable when the function is called with no rules ', () => {
            setRules();
            storedRules = getRules();
            verifyRuleTypeProperties(storedRules);
            expect(storedRules[ASSIGNMENT]).toHaveLength(0);
            expect(storedRules[COMPARISON]).toHaveLength(0);
        });
    });
});
