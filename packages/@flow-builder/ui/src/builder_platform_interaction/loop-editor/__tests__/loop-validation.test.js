// TODO here to replace the expected error message with a reference to the label file once we have that in place
import { loopValidation } from '../loop-validation';

describe('Default Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(loopValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('and when valid string is passed should return - {string} Accepts only AlphaNumeric or Special Characters.', () => {
            expect(loopValidation.validateProperty('label', '°°°°°°°°°°')).toBe('Accepts only AlphaNumeric or Special Characters.');
        });
        it('and when string length more than 255 characters should return - {string} Cannot accept more than 255 characters.', () => {
            expect(loopValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe('Cannot accept more than 255 characters.');
        });
    });
    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(loopValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('and when invalid string is passed should return - {string} Should begin with Alphabetical Characters instead of Numeric or Special Characters', () => {
            expect(loopValidation.validateProperty('name', '1111111')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
        it('and when invalid string is passed should return - {string} Cannot accept any Special Characters.', () => {
            expect(loopValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe('Cannot accept any Special Characters.');
        });
        it('and when string length more than 80 characters should return - {string} Cannot accept more than 80 characters.', () => {
            expect(loopValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe('Cannot accept more than 80 characters.');
        });
    });
});
