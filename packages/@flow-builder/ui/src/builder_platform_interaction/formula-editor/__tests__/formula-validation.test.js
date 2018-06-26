import { formulaValidation } from '../formula-validation';

describe('Default Validations', () => {
    describe('Name property validation', () => {
        it('should return null if valid', () => {
            expect(formulaValidation.validateProperty('name', "valid string")).toBeNull();
        });
        it('should return an error if empty', () => {
            expect(formulaValidation.validateProperty('name', '')).toBe('Cannot be blank.');
        });
        it('should return an error if it starts with an underscore', () => {
            expect(formulaValidation.validateProperty('name', '_startWithUnderscore')).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });
        it('should return an error if it does not start with Alphabetical Characters', () => {
            expect(formulaValidation.validateProperty('name', '1111111')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
        });
        it('should return an error if it conatins Special Characters', () => {
            expect(formulaValidation.validateProperty('name', 'Special Characters $#$@&^%!$()')).toBe('Cannot accept any Special Characters.');
        });
        it('should return an error if length is > 80 characters', () => {
            expect(formulaValidation.validateProperty('name', 'OJqlWSveOtulUjcyHgrDOOSPArDKdbftmvEKPBPDxLqrwtseblHPBcgctlMYmRsbPyngaEmZqCqMxksyv')).toBe('Cannot accept more than 80 characters.');
        });
    });
    describe('DataType property', () => {
        it('should return an error if null', () => {
            expect(formulaValidation.validateProperty('dataType', null)).toBe('Cannot be blank.');
        });
    });
    describe('Expression property', () => {
        it('should return an error if empty', () => {
            expect(formulaValidation.validateProperty('expression', '')).toBe('Cannot be blank.');
        });
    });
});