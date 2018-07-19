import { screenValidation } from '../screen-validation';
import { LABELS } from 'builder_platform_interaction-validation-rules';
describe('Default Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(screenValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('and when valid string is passed should return characters allowed error', () => {
            expect(screenValidation.validateProperty('label', '°°°°°°°°°°')).toBe(LABELS.shouldAcceptOnlyAlphanumericOrSpecialCharacters);
        });
        it('and when string length more than 255 characters should return max string length error', () => {
            expect(screenValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe(LABELS.maximumCharactersLimit);
        });
        it('and when string has consecutive underscores, should return return no consecutive underscores error', () => {
            expect(screenValidation.validateProperty('name', 'Hello__c')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
        });
        it('and when string has underscores at start, should return no starting underscores error', () => {
            expect(screenValidation.validateProperty('name', '_Otherwise orindary')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
    });
    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(screenValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('and when invalid string is passed should return valid start characters error', () => {
            expect(screenValidation.validateProperty('name', '1111111')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('and when invalid string is passed should return characters allowed error', () => {
            expect(screenValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });
        it('and when string has consecutive underscores, should return return return no consecutive underscores error', () => {
            expect(screenValidation.validateProperty('name', 'Hello__c')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
        });
        it('and when string has underscores at start, should return no starting underscores error', () => {
            expect(screenValidation.validateProperty('name', '_Otherwise orindary')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('and when string length more than 80 characters should return max string length error', () => {
            expect(screenValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(LABELS.maximumCharactersLimit);
        });
    });
});