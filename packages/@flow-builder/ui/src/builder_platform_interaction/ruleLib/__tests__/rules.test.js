import { RULE_TYPES, RULE_PROPERTY, setRules, getRules, getOutputRules, getRulesForElementType } from "../rules";

const { ASSIGNMENT, COMPARISON } = RULE_TYPES;
const { LEFT, RHS_PARAMS, EXCLUDE_ELEMS } = RULE_PROPERTY;

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
const mockSingleAssignmentRuleWithExcludeElems =
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
    '       "excludeElems":["SUBFLOW"]' +
    '   }]';

const verifyProperties = (testRulesVariable) => {
    expect(testRulesVariable).toHaveProperty(COMPARISON);
    expect(testRulesVariable).toHaveProperty(ASSIGNMENT);
};

const verifyOutputRuleShape = (testExcludeElems) => {
    const rule = testExcludeElems ? mockSingleAssignmentRuleWithExcludeElems : mockSingleAssignmentRule;
    const initialRule = JSON.parse(rule)[0];
    const initialLHS = initialRule[LEFT];
    const initialRHSParams = initialRule[RHS_PARAMS];

    setRules(rule);
    const outputRules = getOutputRules();

    // there should be two output rules, one per RHS param of initial rule
    expect(outputRules).toHaveLength(2);

    // each output rule has the initial rule's LHS as an RHS
    expect(outputRules[0][RHS_PARAMS]).toHaveLength(1);
    expect(outputRules[1][RHS_PARAMS]).toHaveLength(1);
    expect(outputRules[0][RHS_PARAMS][0]).toMatchObject(initialLHS);
    expect(outputRules[1][RHS_PARAMS][0]).toMatchObject(initialLHS);

    // each output rule has one of the initial RHS params as it's LHS
    expect(outputRules[0][LEFT]).toMatchObject(initialRHSParams[0]);
    expect(outputRules[1][LEFT]).toMatchObject(initialRHSParams[1]);

    if (testExcludeElems) {
        const initialExcludeElem = initialRule[EXCLUDE_ELEMS][0];
        // each output rule has the excludedElem set
        expect(outputRules[0][EXCLUDE_ELEMS]).toHaveLength(1);
        expect(outputRules[0][EXCLUDE_ELEMS][0]).toEqual(initialExcludeElem);
        expect(outputRules[0][EXCLUDE_ELEMS]).toHaveLength(1);
        expect(outputRules[0][EXCLUDE_ELEMS][0]).toEqual(initialExcludeElem);
    }

    return outputRules;
};

// new operator structure
describe('Set Flow Operator Rules', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    it('Create the rules variable with 1 assignment and 1 comparison ', () => {
        setRules(mockRulesFromServiceAssignmentAndComparison);
        const storedRules = getRules();
        expect(Object.keys(storedRules)).toHaveLength(2);
        verifyProperties(storedRules);
        expect(storedRules[ASSIGNMENT]).toHaveLength(1);
        expect(storedRules[COMPARISON]).toHaveLength(1);
    });

    it('Creates the rules variable with rules with includedElems', () => {
        setRules(mockRulesFromServiceAssignmentComparisonAndIncludedElems);
        const storedRules = getRules();
        expect(Object.keys(storedRules)).toHaveLength(3);
        verifyProperties(storedRules);
        expect(storedRules).toHaveProperty(decisionElement);
        const decisionSpecificRules = storedRules[decisionElement];
        expect(decisionSpecificRules).toHaveProperty('comparison');
        expect(decisionSpecificRules[COMPARISON]).toHaveLength(1);
    });

    it('Create the rules variable with 2 assignments ', () => {
        setRules(mockRulesFromServiceOnlyAssignment);
        const storedRules = getRules();
        verifyProperties(storedRules);
        expect(storedRules[ASSIGNMENT]).toHaveLength(2);
        expect(storedRules[COMPARISON]).toHaveLength(0);
    });

    it('Creates the rules variable when the service returns null ', () => {
        setRules(null);
        const storedRules = getRules();
        verifyProperties(storedRules);
        expect(storedRules[ASSIGNMENT]).toHaveLength(0);
        expect(storedRules[COMPARISON]).toHaveLength(0);
    });

    it('Creates the rules variable when the function is called with no rules ', () => {
        setRules();
        const storedRules = getRules();
        verifyProperties(storedRules);
        expect(storedRules[ASSIGNMENT]).toHaveLength(0);
        expect(storedRules[COMPARISON]).toHaveLength(0);
    });
    it('Stores assignment rules backwards to use as output rules', () => {
        verifyOutputRuleShape();
    });
    it('Stores rules with exclude elems in output rules with the excluded elem', () => {
        verifyOutputRuleShape(true);
    });
});
describe('get rules for element type', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    it('gets comparison rules', () => {
        setRules(mockRulesFromServiceAssignmentComparisonAndIncludedElems);

        const allRules = getRules();
        const comparisonRules = getRulesForElementType(COMPARISON, decisionElement);

        expect(comparisonRules).toEqual(allRules[COMPARISON].concat(allRules[decisionElement][COMPARISON]));
    });
});
