import { RULE_TYPES, RULE_PROPERTY } from "../rules";

const decisionElement = 'DECISION';

const mockRulesFromServiceAssignmentAndComparison =
    '[{' +
    '       "ruleType": "comparison",' +
    '       "assignmentOperator":null,' +
    '       "comparisonOperator":{"value":"Equal"},' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   },' +
    '   {' +
    '       "ruleType": "assignment",' +
    '       "assignmentOperator":{"value":"Assign"},' +
    '       "comparisonOperator":null,' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   }]';

const mockRulesFromServiceAssignmentComparisonAndIncludedElems =
    '[{' +
    '       "ruleType": "comparison",' +
    '       "assignmentOperator":null,' +
    '       "comparisonOperator":{"value":"Equal"},' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   },' +
    '   {' +
    '       "ruleType": "assignment",' +
    '       "assignmentOperator":{"value":"Assign"},' +
    '       "comparisonOperator":null,' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '    },'  +
    '    {' +
    '       "ruleType": "comparison",' +
    '       "assignmentOperator":null,' +
    '       "comparisonOperator":{"value":"Equal"},' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":["' + decisionElement + '"],' +
    '       "excludeElems":null' +
    '   }]';

const mockRulesFromServiceOnlyAssignment =
    '[{' +
    '       "ruleType": "assignment",' +
    '       "assignmentOperator":{"value":"Assign"},' +
    '       "comparisonOperator":null,' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   },' +
    '   {' +
    '       "ruleType": "assignment",' +
    '       "assignmentOperator":{"value":"Assign"},' +
    '       "comparisonOperator":null,' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"String"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   }]';

const mockSingleAssignmentRule =
    '[{' +
    '       "ruleType": "assignment",' +
    '       "assignmentOperator":{"value":"Assign"},' +
    '       "comparisonOperator":null,' +
    '       "left":{' +
    '           "paramType":"Data",' +
    '           "paramIndex":1,' +
    '           "dataType":{"value":"String"},' +
    '           "elementType":null,' +
    '           "collection":false' +
    '           },' +
    '       "rhsParams":[{' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"Number"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           },' +
    '           {' +
    '               "paramType":"Data",' +
    '               "paramIndex":1,' +
    '               "dataType":{"value":"Date"},' +
    '               "elementType":null,' +
    '               "collection":false' +
    '           }],' +
    '       "includeElems":null,' +
    '       "excludeElems":null' +
    '   }]';

const verifyProperties = (testRulesVariable) => {
    expect(testRulesVariable).toHaveProperty(RULE_TYPES.COMPARISON);
    expect(testRulesVariable).toHaveProperty(RULE_TYPES.ASSIGNMENT);
};

// new operator structure
describe('Set Flow Operator Rules', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    it('Create the rules variable with 1 assignment and 1 comparison ', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules(mockRulesFromServiceAssignmentAndComparison);
        const storedRules = rulesLib.getRules();
        expect(Object.keys(storedRules)).toHaveLength(2);
        verifyProperties(storedRules);
        expect(storedRules[RULE_TYPES.ASSIGNMENT]).toHaveLength(1);
        expect(storedRules[RULE_TYPES.COMPARISON]).toHaveLength(1);
    });

    it('Creates the rules variable with rules with includedElems', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules(mockRulesFromServiceAssignmentComparisonAndIncludedElems);
        const storedRules = rulesLib.getRules();
        expect(Object.keys(storedRules)).toHaveLength(3);
        verifyProperties(storedRules);
        expect(storedRules).toHaveProperty(decisionElement);
        const decisionSpecificRules = storedRules[decisionElement];
        expect(decisionSpecificRules).toHaveProperty('comparison');
        expect(decisionSpecificRules[RULE_TYPES.COMPARISON]).toHaveLength(1);
    });

    it('Create the rules variable with 2 assignments ', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules(mockRulesFromServiceOnlyAssignment);
        const storedRules = rulesLib.getRules();
        verifyProperties(storedRules);
        expect(storedRules[RULE_TYPES.ASSIGNMENT]).toHaveLength(2);
        expect(storedRules[RULE_TYPES.COMPARISON]).toHaveLength(0);
    });

    it('Creates the rules variable when the service returns null ', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules(null);
        const storedRules = rulesLib.getRules();
        verifyProperties(storedRules);
        expect(storedRules[RULE_TYPES.ASSIGNMENT]).toHaveLength(0);
        expect(storedRules[RULE_TYPES.COMPARISON]).toHaveLength(0);
    });

    it('Creates the rules variable when the function is called with no rules ', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules();
        const storedRules = rulesLib.getRules();
        verifyProperties(storedRules);
        expect(storedRules[RULE_TYPES.ASSIGNMENT]).toHaveLength(0);
        expect(storedRules[RULE_TYPES.COMPARISON]).toHaveLength(0);
    });

    it('Rules variable is a singleton ', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules();
        const storedRules1 = rulesLib.getRules();
        expect(storedRules1[RULE_TYPES.ASSIGNMENT]).toHaveLength(0);
        rulesLib.setRules(mockRulesFromServiceAssignmentAndComparison);
        const storedRules2 = rulesLib.getRules();
        expect(storedRules1).toBe(storedRules2);
        expect(storedRules1[RULE_TYPES.ASSIGNMENT]).toHaveLength(1);
    });
    it('Stores assignment rules backwards to use as output rules', () => {
        const initialRule = JSON.parse(mockSingleAssignmentRule)[0];
        const initialLHS = initialRule[RULE_PROPERTY.LEFT];
        const initialRHSParams = initialRule[RULE_PROPERTY.RHS_PARAMS];

        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules(mockSingleAssignmentRule);
        const outputRules = rulesLib.getOutputRules();

        // there should be two output rules, one per RHS param of initial rule
        expect(outputRules).toHaveLength(2);

        // each output rule has the initial rule's LHS as an RHS
        expect(outputRules[0][RULE_PROPERTY.RHS_PARAMS]).toHaveLength(1);
        expect(outputRules[1][RULE_PROPERTY.RHS_PARAMS]).toHaveLength(1);
        expect(outputRules[0][RULE_PROPERTY.RHS_PARAMS][0]).toMatchObject(initialLHS);
        expect(outputRules[1][RULE_PROPERTY.RHS_PARAMS][0]).toMatchObject(initialLHS);

        // each output rule has one of the initial RHS params as it's LHS
        expect(outputRules[0][RULE_PROPERTY.LEFT]).toMatchObject(initialRHSParams[0]);
        expect(outputRules[1][RULE_PROPERTY.LEFT]).toMatchObject(initialRHSParams[1]);
    });
});
describe('get rules for element type', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    it('decision returns comparison rules', () => {
        const rulesLib = require.requireActual('builder_platform_interaction-rule-lib');
        rulesLib.setRules(mockRulesFromServiceAssignmentComparisonAndIncludedElems);

        const allRules = rulesLib.getRules();
        const comparisonRules = rulesLib.getRulesForContext({elementType: decisionElement});

        expect(comparisonRules).toEqual(allRules[RULE_TYPES.COMPARISON].concat(allRules[decisionElement][RULE_TYPES.COMPARISON]));
    });
});
