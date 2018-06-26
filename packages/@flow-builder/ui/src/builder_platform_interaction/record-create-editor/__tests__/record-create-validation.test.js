import { recordCreateValidation } from '../record-create-validation';

describe('Default Validations', () => {
    describe('when props set to Label', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('should return an error if contains alphanumerical or special characters', () => {
            expect(recordCreateValidation.validateProperty('label', '°°°°°°°°°°')).toBe('Accepts only AlphaNumeric or Special Characters.');
        });
        it('should return an error if the value is too long', () => {
            expect(recordCreateValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe('Cannot accept more than 255 characters.');
        });
    });
    describe('when props set to NAME', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('should return an error if contains alphanumerical characters', () => {
            expect(recordCreateValidation.validateProperty('name', '1111111')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
        it('should return an error if contains special characters', () => {
            expect(recordCreateValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe('Cannot accept any Special Characters.');
        });
        it('should return an error if the value is too long', () => {
            expect(recordCreateValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe('Cannot accept more than 80 characters.');
        });
    });
    describe('when props set to inputReference', () => {
        it('should return null if valid', () => {
            expect(recordCreateValidation.validateProperty('inputReference', "valid string")).toBeNull();
        });
        it('should return an error if blank', () => {
            expect(recordCreateValidation.validateProperty('inputReference', '')).toBe('Cannot be blank.');
        });
        it('should return an error if null', () => {
            expect(recordCreateValidation.validateProperty('inputReference', null)).toBe('Cannot be blank.');
        });
    });
});