import { recordCreateValidation } from '../record-create-validation';
import { LABELS } from 'builder_platform_interaction-validation-rules';
describe('Default Validations', () => {
    describe('when props set to Label', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('should return an error if the value is too long', () => {
            expect(recordCreateValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('when props set to NAME', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('name', "validstring")).toBeNull();
        });
        it('should return an error if contains alphanumerical characters', () => {
            expect(recordCreateValidation.validateProperty('name', '1111111')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('should return an error if contains special characters', () => {
            expect(recordCreateValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });
        it('should return an error if the value is too long', () => {
            expect(recordCreateValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('when props set to inputReference', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('inputReference', "valid string")).toBeNull();
        });
        it('should return an error if blank', () => {
            expect(recordCreateValidation.validateProperty('inputReference', '')).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            expect(recordCreateValidation.validateProperty('inputReference', null)).toBe(LABELS.cannotBeBlank);
        });
    });
});