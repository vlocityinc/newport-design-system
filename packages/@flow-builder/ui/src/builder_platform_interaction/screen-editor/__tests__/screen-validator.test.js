import { screenValidation } from '../screen-validation';

describe('Default Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(screenValidation.validateProperty('label', "valid string")).toBeNull();
        });
        it('and when valid string is passed should return characters allowed error', () => {
            expect(screenValidation.validateProperty('label', '°°°°°°°°°°')).toBe('Accepts only AlphaNumeric or Special Characters.');
        });
        it('and when string length more than 255 characters should return max string length error', () => {
            expect(screenValidation.validateProperty('label', 'slgtkIhgGmCxhghaqlSsvqzpoVTjXXXpiFkUnrbTffSmlaPBNHviXxZOsuzprwgbDqyRjbmpgfBsHqvuAteZQFpiZOZTMHwqXUhgVVXcazWHrTDtmjVEOkoOBnjnUFftAmcvKZZKaVUUrxnDHKivVwLwmUlgArcCfeXPdzAGWWAntNRCaBAVzlTLIGuiXwKdcjuHkwnhsNuodNQdoqAOetbMZvwzRICvRydEVqLnefBJTUMJkmZQhbCIwYhQGlla')).toBe('Cannot accept more than 255 characters.');
        });
        it('and when string has consecutive underscores, should return return no consecutive underscores error', () => {
            expect(screenValidation.validateProperty('name', 'Hello__c')).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });
        it('and when string has underscores at start, should return no starting underscores error', () => {
            expect(screenValidation.validateProperty('name', '_Otherwise orindary')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
    });
    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(screenValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('and when invalid string is passed should return valid start characters error', () => {
            expect(screenValidation.validateProperty('name', '1111111')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
        it('and when invalid string is passed should return characters allowed error', () => {
            expect(screenValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe('Cannot accept any Special Characters.');
        });
        it('and when string has consecutive underscores, should return return return no consecutive underscores error', () => {
            expect(screenValidation.validateProperty('name', 'Hello__c')).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });
        it('and when string has underscores at start, should return no starting underscores error', () => {
            expect(screenValidation.validateProperty('name', '_Otherwise orindary')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
        it('and when string length more than 80 characters should return max string length error', () => {
            expect(screenValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe('Cannot accept more than 80 characters.');
        });
    });
});