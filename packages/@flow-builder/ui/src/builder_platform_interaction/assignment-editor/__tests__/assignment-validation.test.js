import { assignmentValidation } from '../assignment-validation';
import { LABELS } from 'builder_platform_interaction-validation-rules';

describe('Default Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(assignmentValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('and when string length more than 255 characters should return - {string} Cannot accept more than 255 characters.', () => {
            expect(assignmentValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(assignmentValidation.validateProperty('name', "validstring")).toBeNull();
        });
        it('and when invalid string is passed should return - {string} Should begin with Alphabetical Characters instead of Numeric or Special Characters', () => {
            expect(assignmentValidation.validateProperty('name', '1111111')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('and when invalid string is passed should return - {string} Cannot accept any Special Characters.', () => {
            expect(assignmentValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });
        it('and when string length more than 80 characters should return - {string} Cannot accept more than 80 characters.', () => {
            expect(assignmentValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(LABELS.maximumCharactersLimit);
        });
    });
});