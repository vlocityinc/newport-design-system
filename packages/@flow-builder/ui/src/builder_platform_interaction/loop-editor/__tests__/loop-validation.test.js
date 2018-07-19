import { loopValidation } from '../loop-validation';
import {LABELS} from 'builder_platform_interaction-validation-rules';

describe('Default Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(loopValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('and when valid string is passed should return - {string} Accepts only AlphaNumeric or Special Characters.', () => {
            expect(loopValidation.validateProperty('label', '°°°°°°°°°°')).toBe(LABELS.shouldAcceptOnlyAlphanumericOrSpecialCharacters);
        });
        it('and when string length more than 255 characters should return - {string} Cannot accept more than 255 characters.', () => {
            expect(loopValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe(LABELS.maximumCharactersLimit);
        });
    });
    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(loopValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('and when invalid string is passed should return - {string} Should begin with Alphabetical Characters instead of Numeric or Special Characters', () => {
            expect(loopValidation.validateProperty('name', '1111111')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
        });
        it('and when invalid string is passed should return - {string} Cannot accept any Special Characters.', () => {
            expect(loopValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
        });
        it('and when string length more than 80 characters should return - {string} Cannot accept more than 80 characters.', () => {
            expect(loopValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe(LABELS.maximumCharactersLimit);
        });
    });
});