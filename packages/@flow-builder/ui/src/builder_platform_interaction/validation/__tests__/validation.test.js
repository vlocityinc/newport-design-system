// TODO here to replace the expected error message with a reference to the label file once we have that in place
import { Validation } from 'builder_platform_interaction-validation';
import * as ValidationRules from 'builder_platform_interaction-validation-rules';

const TRAILING_UNDERSCORE_ERROR = 'Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.';


describe('Default Validations', () => {
    const validation = new Validation();

    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(validation.validateProperty('label', 'valid string')).toBeNull();
        });

        it('and when a empty string is passed should return the error message - {string} Cannot be blank.', () => {
            expect(validation.validateProperty('label', '')).toBe('Cannot be blank.');
        });
    });

    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(validation.validateProperty('name', 'valid string')).toBeNull();
        });

        it('and when a empty string is passed should return the error message - {string} Cannot be blank.', () => {
            expect(validation.validateProperty('name', '')).toBe('Cannot be blank.');
        });

        it('and when a string has trailing underscores at the end should return the error message- {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('name', 'valid_string_')).toBe(TRAILING_UNDERSCORE_ERROR);
        });

        it('and when a string has trailing underscores at the beginning should return the error message - {string} Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.', () => {
            expect(validation.validateProperty('name', '_valid_string')).toBe(TRAILING_UNDERSCORE_ERROR);
        });
    });
});
describe('runRulesOnData method', () => {
    const validation = new Validation();
    it('returns null if no rule is specified in rules list', () => {
        expect(validation.runRulesOnData({}, '__test data__')).toBeNull();
    });
    it('returns the error message from the first failed rule', () => {
        expect(validation.runRulesOnData([
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeginOrEndWithUnderscores,
            ValidationRules.maximumCharactersLimit(3)
        ], 'testNameWithATrailingUnderScore_')).toBe(TRAILING_UNDERSCORE_ERROR);
    });
});
describe('getMergedRules method', () => {
    const validation = new Validation();
    it('returns the existing/default rules if no additional rules are specified', () => {
        expect(validation.getMergedRules({name:['rule1', 'rule2']})).toEqual({name:['rule1', 'rule2']});
    });
    it('returns the appended set of rules (and inner subkeys) for the same key', () => {
        const ruleSet1 = {
            'name': ['nRule1', 'nRule2'],
            'label': ['lRule1', 'lRule2'],
            'assignmentItems': {
                'leftHandSide' : ['lhsRule1']
            }
        };
        const ruleSet2 = {
            'name': ['nRule3'],
            'assignmentItems': {
                'leftHandSide' : ['lhsRule2'],
                'rightHandSide' : ['rhsRule1']
            }
        };
        const expectedRuleSet = {
            'name' : ['nRule1', 'nRule2', 'nRule3'],
            'label': ['lRule1', 'lRule2'],
            'assignmentItems': {
                'leftHandSide': ['lhsRule1', 'lhsRule2'],
                'rightHandSide': ['rhsRule1']
            }
        };
        expect(validation.getMergedRules(ruleSet1, ruleSet2)).toEqual(expectedRuleSet);
    });
    it('returns the appended keys in rules object if there are different keys in exisitng and additional rules', () => {});
});
describe('validateAll method', () => {
    it('returns the same object if no applicable rule is present', () => {
        const testObj = {
            name1: {value:" testValue ", error:null},
            label1: {value:"", error: null}
        };
        const validation = new Validation();
        expect(validation.validateAll(testObj)).toBe(testObj);
    });
    it('returns the same object if no rule is failed', () => {
        const testObj = {
            name: {value:"testValueWithNoErrors", error:null},
            label: {value:"testValueWithNoErrors", error: null}
        };
        const validation = new Validation();
        expect(validation.validateAll(testObj)).toBe(testObj);
    });
    it('returns the object with errors when rules fail at various level of properties', () => {
        // This function is to prove that we can validate RHS using the LHS value
        const validateRHS = (condition) => {
            return () => {
                return 'LHS is ' + condition.leftHandSide.value;
            };
        };
        const additionalRules = {
            outcomes: () => {
                return {
                    name: [ValidationRules.maximumCharactersLimit(10)],
                    conditions: (condition) => {
                        return {
                            leftHandSide: [ValidationRules.maximumCharactersLimit(50), ValidationRules.shouldNotBeBlank],
                            rightHandSide: [validateRHS(condition)],
                        };
                    },
                };
            }
        };
        const testObj = {
            name: {value: "valueWithError(trailingSpaces)_", error: null},
            label: {value: "valueWithNoErrors", error: null},
            outcomes : [{
                name: {value: "valueWithMaximumCharLimitExceeded", error: null},
                devName: {value:"mockValue", error:null},
                conditions: [
                    {
                        leftHandSide: {value: "", error:null}
                    },
                    {
                        leftHandSide: {value: "valueWithNoErrors", error:null}
                    }
                ]
            },
            {
                name: {value: "RHSError", error: null},
                devName: {value: "mockValue", error:null},
                conditions: [
                    {
                        leftHandSide: {value: "valueWithNoErrors", error: null},
                        rightHandSide: {value: "valueWithError", error: null},
                    }
                ]
            },
            {
                name: {value: "valueNoErr", error: null},
                devName: {value:"mockValue", error:null},
                conditions: [
                    {
                        leftHandSide: {value: "valueWithNoErrors", error:null}
                    },
                    {
                        leftHandSide: {value: "valueWithNoErrors", error:null}
                    }
                ]
            }]
        };
        const expectedObjectAfterValidateAll = {
            name: {value: "valueWithError(trailingSpaces)_", error: TRAILING_UNDERSCORE_ERROR},
            label: {value: "valueWithNoErrors", error: null},
            outcomes : [{
                name: {value: "valueWithMaximumCharLimitExceeded", error: "Cannot accept more than 10 characters."},
                devName: {value:"mockValue", error:null},
                conditions: [
                    {
                        leftHandSide: {value: "", error:"Cannot be blank."}
                    },
                    {
                        leftHandSide: {value: "valueWithNoErrors", error:null}
                    }
                ]
            },
            {
                name: {value: "RHSError", error: null},
                devName: {value: "mockValue", error:null},
                conditions: [
                    {
                        leftHandSide: {value: "valueWithNoErrors", error: null},
                        rightHandSide: {value: "valueWithError", error: "LHS is valueWithNoErrors"},
                    }
                ]
            },
            {
                name: {value: "valueNoErr", error: null},
                devName: {value:"mockValue", error:null},
                conditions: [
                    {
                        leftHandSide: {value: "valueWithNoErrors", error:null}
                    },
                    {
                        leftHandSide: {value: "valueWithNoErrors", error:null}
                    }
                ]
            }]
        };
        const validationClassWithAdditionalRules = new Validation(additionalRules);
        expect(validationClassWithAdditionalRules.validateAll(testObj)).toEqual(expectedObjectAfterValidateAll);
    });
});
