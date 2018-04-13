import { setRules, getRules, getRulesForElementType } from 'builder_platform_interaction-rule-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

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

const verifyProperties = (testRulesVariable) => {
    expect(testRulesVariable).toHaveProperty('comparison');
    expect(testRulesVariable).toHaveProperty('assignment');
};

// new operator structure
describe('Set Flow Operator Rules', () => {
    it('Create the rules variable with 1 assignment and 1 comparison ', () => {
        setRules(mockRulesFromServiceAssignmentAndComparison);
        const storedRules = getRules();
        expect(Object.keys(storedRules)).toHaveLength(2);
        verifyProperties(storedRules);
        expect(storedRules.assignment).toHaveLength(1);
        expect(storedRules.comparison).toHaveLength(1);
    });

    it('Create the rules variable with 2 assignments ', () => {
        setRules(mockRulesFromServiceOnlyAssignment);
        const storedRules = getRules();
        verifyProperties(storedRules);
        expect(storedRules.assignment).toHaveLength(2);
        expect(storedRules.comparison).toHaveLength(0);
    });

    it('Creates the rules variable when the service returns null ', () => {
        setRules(null);
        const storedRules = getRules();
        verifyProperties(storedRules);
        expect(storedRules.assignment).toHaveLength(0);
        expect(storedRules.comparison).toHaveLength(0);
    });

    it('Creates the rules variable when the function is called with no rules ', () => {
        setRules();
        const storedRules = getRules();
        verifyProperties(storedRules);
        expect(storedRules.assignment).toHaveLength(0);
        expect(storedRules.comparison).toHaveLength(0);
    });

    it('Rules variable is a singleton ', () => {
        setRules();
        const storedRules1 = getRules();
        expect(storedRules1.assignment).toHaveLength(0);
        setRules(mockRulesFromServiceAssignmentAndComparison);
        const storedRules2 = getRules();
        expect(storedRules1).toBe(storedRules2);
        expect(storedRules1.assignment).toHaveLength(1);
    });

    describe('for element type', () => {
        it('decision returns comparison rules', () => {
            setRules(mockRulesFromServiceAssignmentAndComparison);

            const allRules = getRules();
            const comparisonRules = getRulesForElementType(ELEMENT_TYPE.DECISION);

            expect(comparisonRules).toEqual(allRules.comparison);
        });
    });
});
