import { setRules, getRules } from 'builder_platform_interaction-rule-lib';

const mockRulesFromServiceAssignmentAndComparison = '[{"ruleType":"comparison","left":{"paramType":"Data","paramIndex":1,"dataType":{"value":"String"},"elementType":null,"collection":false},"operator":"EQUAL","rhsParams":[{"paramType":"Data","paramIndex":1,"dataType":{"value":"String"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Date"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"DateTime"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Number"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Currency"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Boolean"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Picklist"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Multipicklist"},"elementType":null,"collection":false},{"paramType":"Element","paramIndex":1,"dataType":null,"elementType":"STAGE","collection":false}],"includeElems":null,"excludeElems":null},{"ruleType":"assignment","left":{"paramType":"Data","paramIndex":1,"dataType":{"value":"String"},"elementType":null,"collection":false},"operator":"ASSIGNMENT","rhsParams":[{"paramType":"Data","paramIndex":1,"dataType":{"value":"String"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Date"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"DateTime"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Number"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Currency"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Boolean"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Picklist"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Multipicklist"},"elementType":null,"collection":false},{"paramType":"Element","paramIndex":1,"dataType":null,"elementType":"STAGE","collection":false},{"paramType":"Element","paramIndex":1,"dataType":null,"elementType":"STAGE","collection":true}],"includeElems":null,"excludeElems":null}]';
const mockRulesFromServiceOnlyAssignment = '[{"ruleType":"assignment","left":{"paramType":"Data","paramIndex":1,"dataType":{"value":"String"},"elementType":null,"collection":false},"operator":"ASSIGNMENT","rhsParams":[{"paramType":"Data","paramIndex":1,"dataType":{"value":"String"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Date"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"DateTime"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Number"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Currency"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Boolean"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Picklist"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"Multipicklist"},"elementType":null,"collection":false},{"paramType":"Element","paramIndex":1,"dataType":null,"elementType":"STAGE","collection":false},{"paramType":"Element","paramIndex":1,"dataType":null,"elementType":"STAGE","collection":true}],"includeElems":null,"excludeElems":null},{"ruleType":"assignment","left":{"paramType":"Data","paramIndex":1,"dataType":{"value":"Date"},"elementType":null,"collection":false},"operator":"ASSIGNMENT","rhsParams":[{"paramType":"Data","paramIndex":1,"dataType":{"value":"Date"},"elementType":null,"collection":false},{"paramType":"Data","paramIndex":1,"dataType":{"value":"DateTime"},"elementType":null,"collection":false}],"includeElems":null,"excludeElems":null}]';
const verifyProperties = (testRulesVariable) => {
    expect(testRulesVariable).toHaveProperty('comparison');
    expect(testRulesVariable).toHaveProperty('assignment');
};

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
});
