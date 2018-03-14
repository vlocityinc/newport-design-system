// TODO here to replace the expected error message with a reference to the label file once we have that in place
import { Validation } from 'builder_platform_interaction-validation';

const validation = new Validation();

describe('Default Validations', () => {
    describe('when props set to LABEL', () => {
        it('and when valid string is passed should return - null', () => {
            expect(validation.validateProperty('label', "valid string")).toBeNull();
        });

        it('and when a empty string is passed should return the error message - {string} Cannot be blank.', () => {
            expect(validation.validateProperty('label', "")).toBe('Cannot be blank.');
        });

        it('and when a string has trailing spaces at the end should return the error message - {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('label', "valid_string ")).toBe('Should not have trailing empty spaces at the beginning or ending.');
        });

        it('and when a string has trailing spaces at the beginning should return the error message - {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('label', " valid_string")).toBe('Should not have trailing empty spaces at the beginning or ending.');
        });

        it('and when a string has trailing underscores at the end should return the error message- {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('label', "valid_string_")).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });

        it('and when a string has trailing underscores at the beginning should return the error message - {string} Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.', () => {
            expect(validation.validateProperty('label', "_valid_string")).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });
    });

    describe('when props set to NAME', () => {
        it('and when valid string is passed should return - null', () => {
            expect(validation.validateProperty('name', "valid string")).toBeNull();
        });

        it('and when a empty string is passed should return the error message - {string} Cannot be blank.', () => {
            expect(validation.validateProperty('name', "")).toBe('Cannot be blank.');
        });

        it('and when a string has trailing spaces at the end should return the error message - {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('name', "valid_string ")).toBe('Should not have trailing empty spaces at the beginning or ending.');
        });

        it('and when a string has trailing spaces at the beginning should return the error message - {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('name', " valid_string")).toBe('Should not have trailing empty spaces at the beginning or ending.');
        });

        it('and when a string has trailing underscores at the end should return the error message- {string} Should not have trailing empty spaces at the beginning or ending.', () => {
            expect(validation.validateProperty('name', "valid_string_")).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });

        it('and when a string has trailing underscores at the beginning should return the error message - {string} Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.', () => {
            expect(validation.validateProperty('name', "_valid_string")).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
        });
    });
});