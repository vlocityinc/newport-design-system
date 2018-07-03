import * as rules from 'builder_platform_interaction-validation-rules';
import { numberVariableGuid } from 'mock-store-data';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-expression-utils';

jest.mock('builder_platform_interaction-rule-lib', () => {
    return {
        getRulesForContext: jest.fn().mockReturnValue([]),
        elementToParam: require.requireActual('builder_platform_interaction-rule-lib').elementToParam,
        getRHSTypes: require.requireActual('builder_platform_interaction-rule-lib').getRHSTypes,
    };
});

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
    it('should return null when the value ends with _0', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('Assignment_0')).toBeNull();
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
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('aa*^*^')).toBe('Cannot accept any Special Characters.');
    });
});
describe('shouldBeAPositiveIntegerOrZero method', () => {
    it('should return null when the input contains a positive integer or 0', () => {
        expect(rules.shouldBeAPositiveIntegerOrZero('1')).toBeNull();
        expect(rules.shouldBeAPositiveIntegerOrZero('0')).toBeNull();
    });
    it('should return an error when the input contains a negative integer, a float or NaN', () => {
        expect(rules.shouldBeAPositiveIntegerOrZero('-1')).toBe('Must be a positive integer or zero');
        expect(rules.shouldBeAPositiveIntegerOrZero('1.01')).toBe('Must be a positive integer or zero');
        expect(rules.shouldBeAPositiveIntegerOrZero('1AF')).toBe('Must be a positive integer or zero');
    });
});
describe('shouldBeADate method', () => {
    it('should return null when the input contains a valid date string', () => {
        expect(rules.shouldBeADate(new Date().toString())).toBeNull();
    });
    it('should return an error when the input contains non-alphanumeric characters', () => {
        expect(rules.shouldBeADate('aaa')).toBe('Must be a valid date');
        expect(rules.shouldBeADate('13/13/13')).toBe('Must be a valid date');
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
describe('validateExpressionWith3Properties', () => {
    it('should always return an object containing LHS rule shouldNotBeBlank', () => {
        const rulesObject = rules.validateExpressionWith3Properties()(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {}
            });
        expect(rulesObject).toMatchObject({[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [rules.shouldNotBeBlank]});
    });
    it('should return an object containing operator rule if LHS is populated', () => {
        const rulesObject = rules.validateExpressionWith3Properties()(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'populated'},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {}
            });
        expect(rulesObject).toMatchObject({[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [rules.shouldNotBeBlank], [EXPRESSION_PROPERTY_TYPE.OPERATOR]: [rules.shouldNotBeBlank]});
    });
    it('should not contain RHS rule if LHS, operator, and RHS are all populated', () => {
        const rulesObject = rules.validateExpressionWith3Properties()(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'populated'},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: 'populated'},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: 'populated'}
            });
        expect(rulesObject).toEqual({[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [rules.shouldNotBeBlank], [EXPRESSION_PROPERTY_TYPE.OPERATOR]: [rules.shouldNotBeBlank]});
    });
});
describe('RHS validation', () => {
    it('allows null when valid', () => {
        const rulesArray = rules.validateExpressionWith3Properties({elementType: 'ASSIGNMENT'})(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: numberVariableGuid},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value:'ASSIGN'},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {}
            });
        const result = rulesArray.rightHandSide[0]();
        expect(result).toBeTruthy();
    });
});
