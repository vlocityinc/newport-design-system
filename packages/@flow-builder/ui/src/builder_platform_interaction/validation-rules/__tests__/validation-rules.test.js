import * as rules from 'builder_platform_interaction-validation-rules';

describe('shouldNotBeBlank method', () => {
    it('should return null with a non blank value', () => {
        expect(rules.shouldNotBeBlank('test value')).toBeNull();
    });
    it('should return an error message with a blank value', () => {
        expect(rules.shouldNotBeBlank('')).toBe('Cannot be blank.');
    });
});
describe('shouldNotBeginOrEndWithUnderscores method', () => {
    it('should return null when the value does not start or end with an underscore', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('test value')).toBeNull();
    });
    it('should return an error message when the value starts with an underscore', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('_test value')).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
    });
    it('should return an error message when the value ends with an underscore', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('test value_')).toBe('Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.');
    });
});
describe('shouldAcceptOnlyAlphanumericOrSpecialCharacters method', () => {
    it('should return null when the input has only alphanumeric or special characters', () => {
        expect(rules.shouldAcceptOnlyAlphanumericOrSpecialCharacters('Aa23$%&^*')).toBeNull();
    });
    it('should return an error message when the input has non alphanumeric or non-special characters', () => {
        expect(rules.shouldAcceptOnlyAlphanumericOrSpecialCharacters('°°°°°°°°°°')).toBe('Accepts only AlphaNumeric or Special Characters.');
    });
});
describe('shouldNotBeginWithNumericOrSpecialCharacters method', () => {
    it('should return null when the input does not begin with numeric or special characters', () => {
        expect(rules.shouldNotBeginWithNumericOrSpecialCharacters('s123')).toBeNull();
    });
    it('should return an error message when the input begins with numeric characters', () => {
        expect(rules.shouldNotBeginWithNumericOrSpecialCharacters('123s')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
    });
    it('should return an error message when the input begins with special characters', () => {
        expect(rules.shouldNotBeginWithNumericOrSpecialCharacters('#123s')).toBe('Should always begin with Alphabetical Characters instead of Numeric or Special Characters.');
    });
});
describe('shouldAcceptOnlyAlphanumericCharacters method', () => {
    it('should return null when the input contains only alphanumeric characters', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('AlphanumericOnly1234')).toBeNull();
    });
    it('should return an error when the input contains non-alphanumeric characters', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('*^*^')).toBe('Cannot accept any Special Characters.');
    });
});
describe('maximumCharactersLimit method', () => {
    const charLimit = 12;
    it('should return null if the input is within the character limit', () => {
        expect(rules.maximumCharactersLimit(charLimit)('right input')).toBeNull();
    });
    it('should return an error message if the input exceeds the character limit', () => {
        expect(rules.maximumCharactersLimit(charLimit)('wrong input which exceeds character limit')).toBe('Cannot accept more than 12 characters.');
    });
});
