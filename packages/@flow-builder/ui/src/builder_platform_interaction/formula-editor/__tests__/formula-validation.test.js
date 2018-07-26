import { formulaValidation } from '../formula-validation';
import { LABELS } from 'builder_platform_interaction-validation-rules';

describe('Default Validations', () => {
    describe('Name property validation', () => {
        it('should return null if valid', () => {
            expect(formulaValidation.validateProperty('name', "validstring")).toBeNull();
        });
        it('should return an error if empty', () => {
            expect(formulaValidation.validateProperty('name', '')).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if it starts with an underscore', () => {
            expect(formulaValidation.validateProperty('name', '_startWithUnderscore')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('should return an error if it does not start with Alphabetical Characters', () => {
            expect(formulaValidation.validateProperty('name', '1111111')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('should return an error if it contains Special Characters', () => {
            expect(formulaValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });
        it('should return an error if length is > 80 characters', () => {
            expect(formulaValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('DataType property', () => {
        it('should return an error if null', () => {
            expect(formulaValidation.validateProperty('dataType', null)).toBe(LABELS.cannotBeBlank);
        });
    });
    describe('Expression property', () => {
        it('should return an error if empty', () => {
            expect(formulaValidation.validateProperty('expression', '')).toBe(LABELS.cannotBeBlank);
        });
    });
});