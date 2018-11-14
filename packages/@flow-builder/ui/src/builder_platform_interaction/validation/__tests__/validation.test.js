import { Validation } from "builder_platform_interaction/validation";
import * as ValidationRules from "builder_platform_interaction/validationRules";
const TRAILING_UNDERSCORE_ERROR = ValidationRules.LABELS.shouldNotBeginOrEndWithUnderscores;

describe('Default Validations', () => {
    const validation = new Validation();

    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(validation.validateProperty('label', 'valid string')).toBeNull();
        });

        it('and when a empty string is passed should return the error message - {string} Cannot be blank.', () => {
            expect(validation.validateProperty('label', '')).toBe(ValidationRules.LABELS.cannotBeBlank);
        });

        it('and when string length more than 255 characters should return - {string} Cannot accept more than 255 characters.', () => {
            expect(validation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe(ValidationRules.LABELS.maximumCharactersLimit);
        });
    });

    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(validation.validateProperty('name', 'valid_devName')).toBeNull();
        });

        it('and when a empty string is passed should return the error message - {string} Cannot be blank.', () => {
            expect(validation.validateProperty('name', '')).toBe(ValidationRules.LABELS.cannotBeBlank);
        });

        it('and when a string has trailing underscores at the end should return the error message- {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('name', 'valid_string_')).toBe(TRAILING_UNDERSCORE_ERROR);
        });

        it('and when a string has trailing underscores at the beginning should return the error message - {string} Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.', () => {
            expect(validation.validateProperty('name', '_valid_string')).toBe(TRAILING_UNDERSCORE_ERROR);
        });

        it('and when string has special or numeric characters at start, should return the error meessage - {string} no starting with numeric or special characters', () => {
            expect(validation.validateProperty('name', '#$$%@adsf')).toBe(ValidationRules.LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });

        it('and when invalid string is passed should return - {string} Cannot accept any Special Characters.', () => {
            expect(validation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(ValidationRules.LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });

        it('should return an error if length is > 80 characters', () => {
            expect(validation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(ValidationRules.LABELS.maximumCharactersLimit);
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
describe('validateDevNameUniquenessLocally method', () => {
    const validation = new Validation();
    const mockGuidToNameList = [
        {
            guid: 'GUID_PARENT',
            name: 'parentDevName'
        },
        {
            guid: 'GUID_CHILD1',
            name: 'childDevName1'
        },
    ];
    it('returns null if the dev name is unique locally i.e. within the guidToDevNameList passed', () => {
        const result = validation.validateDevNameUniquenessLocally(mockGuidToNameList, 'testDevName', 'testGuid');
        expect(result).toBeNull();
    });
    it('returns an error if the dev name is not unique locally', () => {
        const result = validation.validateDevNameUniquenessLocally(mockGuidToNameList, 'childDevName1', 'testGuid');
        expect(result).toBe(ValidationRules.LABELS.fieldNotUnique);
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
            name1: {value:' testValue ', error:null},
            label1: {value:'', error: null}
        };
        const validation = new Validation();
        expect(validation.validateAll(testObj)).toBe(testObj);
    });
    it('returns the same object if no rule is failed', () => {
        const testObj = {
            name: {value:'testValueWithNoErrors', error:null},
            label: {value:'testValueWithNoErrors', error: null}
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
            name: {value: 'valueWithError(trailingSpaces)_', error: null},
            label: {value: 'valueWithNoErrors', error: null},
            outcomes : [{
                name: {value: 'valueWithMaximumCharLimitExceeded', error: null},
                devName: {value:'mockValue', error:null},
                conditions: [
                    {
                        leftHandSide: {value: '', error:null}
                    },
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error:null}
                    }
                ]
            },
            {
                name: {value: 'RHSError', error: null},
                devName: {value: 'mockValue', error:null},
                conditions: [
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error: null},
                        rightHandSide: {value: 'valueWithError', error: null},
                    }
                ]
            },
            {
                name: {value: 'valueNoErr', error: null},
                devName: {value:'mockValue', error:null},
                conditions: [
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error:null}
                    },
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error:null}
                    }
                ]
            }]
        };
        const expectedObjectAfterValidateAll = {
            name: {value: 'valueWithError(trailingSpaces)_', error: TRAILING_UNDERSCORE_ERROR},
            label: {value: 'valueWithNoErrors', error: null},
            outcomes : [{
                name: {value: 'valueWithMaximumCharLimitExceeded', error: ValidationRules.LABELS.maximumCharactersLimit},
                devName: {value:'mockValue', error:null},
                conditions: [
                    {
                        leftHandSide: {value: '', error: ValidationRules.LABELS.cannotBeBlank}
                    },
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error:null}
                    }
                ]
            },
            {
                name: {value: 'RHSError', error: null},
                devName: {value: 'mockValue', error:null},
                conditions: [
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error: null},
                        rightHandSide: {value: 'valueWithError', error: 'LHS is valueWithNoErrors'},
                    }
                ]
            },
            {
                name: {value: 'valueNoErr', error: null},
                devName: {value:'mockValue', error:null},
                conditions: [
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error:null}
                    },
                    {
                        leftHandSide: {value: 'valueWithNoErrors', error:null}
                    }
                ]
            }]
        };
        const validationClassWithAdditionalRules = new Validation(additionalRules);
        expect(validationClassWithAdditionalRules.validateAll(testObj)).toEqual(expectedObjectAfterValidateAll);
    });
});
