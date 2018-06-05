import { formulaValidation } from '../formula-validation';

describe('Default Validations', () => {
    describe('when prop set to name', () => {
        it('and when valid string is passed should return - null', () => {
            expect(formulaValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('and when invalid string is passed should return - {string} Cannot be blank.', () => {
            expect(formulaValidation.validateProperty('name', '')).toBe('Cannot be blank.');
        });
        it('and when invalid string is passed should return - {string} Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.', () => {
            expect(formulaValidation.validateProperty('name', '_startWithUnderscore')).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });
        it('and when invalid string is passed should return - {string} Should begin with Alphabetical Characters instead of Numeric or Special Characters', () => {
            expect(formulaValidation.validateProperty('name', '1111111')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
        it('and when invalid string is passed should return - {string} Cannot accept any Special Characters.', () => {
            expect(formulaValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe('Cannot accept any Special Characters.');
        });
        it('and when string length more than 80 characters should return - {string} Cannot accept more than 80 characters.', () => {
            expect(formulaValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe('Cannot accept more than 80 characters.');
        });
    });
});