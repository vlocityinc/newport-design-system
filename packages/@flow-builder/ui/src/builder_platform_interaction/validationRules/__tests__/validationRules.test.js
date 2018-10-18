import * as rules from "builder_platform_interaction/validationRules";
import { assignmentElementGuid, assignmentElementName, stageGuid, stageOrderNumber, startElementName } from "mock/storeData";
import { mockAccountFields } from "mock/serverEntityData";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { LABELS } from "../validationRulesLabels";
import { format } from "builder_platform_interaction/commonUtils";

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        elementToParam: require.requireActual('builder_platform_interaction/ruleLib').elementToParam,
        isMatch: require.requireActual('builder_platform_interaction/ruleLib').isMatch,
    };
});

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetch: jest.fn().mockImplementation((actionType, callback) => {
            callback({
                data: JSON.stringify(mockAccountFields),
            });
        }),
        SERVER_ACTION_TYPE: require.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE,
    };
});

describe('shouldNotBeBlank method', () => {
    it('should return null when valid string ( with non blank value ) is passed.', () => {
        expect(rules.shouldNotBeBlank('test value')).toBeNull();
    });
    it('should return an error message when invalid string ( with a blank value) is passed.', () => {
        expect(rules.shouldNotBeBlank('')).toBe(LABELS.cannotBeBlank);
    });
});
describe('shouldNotBeginOrEndWithUnderscores method', () => {
    it('should return null when valid string ( with single underscore in between ) is passed.', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('test_value')).toBeNull();
    });
    it('should return an error message when invalid string ( starts with underscore ) is passed.', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('_test_value')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
    });
    it('should return an error message when invalid string ( ends with underscore ) is passed.', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('test_value_')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
    });
    it('should return an error message when invalid string ( consecutive underscores in the middle ) is passed.', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('test__value')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
    });
    it('should return an error message when invalid string ( starts with consecutive underscores ) is passed.', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('__test_value')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
    });
    it('should return an error message when invalid string ( ends with consecutive underscores ) is passed.', () => {
        expect(rules.shouldNotBeginOrEndWithUnderscores('test_value__')).toBe(LABELS.shouldNotBeginOrEndWithUnderscores);
    });
});
describe('shouldNotBeginWithNumericOrSpecialCharacters method', () => {
    it('should return null when valid string ( does not begin with numeric or special characters) is passed.', () => {
        expect(rules.shouldNotBeginWithNumericOrSpecialCharacters('s123#')).toBeNull();
    });
    it('should return an error message when invalid string ( begins with numeric characters) is passed.', () => {
        expect(rules.shouldNotBeginWithNumericOrSpecialCharacters('123s')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
    });
    it('should return an error message when invalid string ( begins with special characters) is passed. ', () => {
        expect(rules.shouldNotBeginWithNumericOrSpecialCharacters('#123s')).toBe(LABELS.shouldNotBeginWithNumericOrSpecialCharacters);
    });
});
describe('shouldAcceptOnlyAlphanumericCharacters method', () => {
    it('should return null when valid string ( contains only alphanumeric characters ) is passed.', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('AlphanumericOnly1234')).toBeNull();
    });
    it('should return null when valid string ( contains underscores ) is passed.', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('_')).toBeNull();
    });
    it('should return an error when invalid string ( ends with non-alphanumeric characters ) is passed.', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('aa*^*^')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
    });
    it('should return an error when invalid string ( has non-alphanumeric characters in between ) is passed.', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('aa$#bbb')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
    });
    it('should return an error when invalid string ( starts with non-alphanumeric characters ) is passed.', () => {
        expect(rules.shouldAcceptOnlyAlphanumericCharacters('$abc')).toBe(LABELS.shouldAcceptOnlyAlphanumericCharacters);
    });
});
describe('shouldBeAPositiveIntegerOrZero method', () => {
    it('should return null when the input contains a positive integer or 0', () => {
        expect(rules.shouldBeAPositiveIntegerOrZero('1')).toBeNull();
        expect(rules.shouldBeAPositiveIntegerOrZero('0')).toBeNull();
    });
    it('should return an error when the input contains a negative integer, a float or NaN', () => {
        expect(rules.shouldBeAPositiveIntegerOrZero('-1')).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
        expect(rules.shouldBeAPositiveIntegerOrZero('1.01')).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
        expect(rules.shouldBeAPositiveIntegerOrZero('1AF')).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
    });
});

describe('shouldBeADate method', () => {
    it('should return null when the input contains a valid date string', () => {
        expect(rules.shouldBeADate(new Date().toString())).toBeNull();
    });
    it('should return an error when the input contains non-alphanumeric characters', () => {
        expect(rules.shouldBeADate('aaa')).toBe(LABELS.mustBeAValidDate);
        expect(rules.shouldBeADate('13/13/13')).toBe(LABELS.mustBeAValidDate);
    });
});
describe('maximumCharactersLimit method', () => {
    const charLimit = 12;
    it('should return null if the input is within the character limit', () => {
        expect(rules.maximumCharactersLimit(charLimit)('right input')).toBeNull();
    });
    it('should return an error message if the input exceeds the character limit', () => {
        expect(rules.maximumCharactersLimit(charLimit)('wrong input which exceeds character limit')).toBe(LABELS.maximumCharactersLimit);
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
describe('isUniqueDevNameInStore method', () => {
    it('returns null when a unique dev name is tested against store data', () => {
        const uniqueName = 'idiosyncraticName';
        expect(rules.isUniqueDevNameInStore(uniqueName)).toBeNull();
    });
    it('returns null when a unique dev name is tested against store data while using the listOfGuidsToSkip param', () => {
        expect(rules.isUniqueDevNameInStore(assignmentElementName, [assignmentElementGuid])).toBeNull();
    });
    it('returns an error when the dev name is not unique (uniqueness is case insensitive)', () => {
        expect(rules.isUniqueDevNameInStore(assignmentElementName.toUpperCase())).toBe(LABELS.fieldNotUnique);
    });
    it('returns null when a dev name is blank & tested against store data - { start element }.', () => {
        expect(rules.isUniqueDevNameInStore(startElementName)).toBeNull();
    });
});

describe('shouldBeUnderMaxValue method', () => {
    it('should return null when valid number is passed', () => {
        expect(rules.shouldBeUnderMaxValue(100)(100)).toBeNull();
    });
    it('should return an error message when a number over the limit is passed in', () => {
        expect(rules.shouldBeUnderMaxValue(100)(101)).toBe(format(LABELS.overMaxIntegerValue, 100));
    });
    it('should return an error message when non-number value is passed in', () => {
        expect(rules.shouldBeUnderMaxValue(100)('a')).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
    });
});

describe('isUniqueOrderNumberInStore method', () => {
    it('returns null when a unique order number is tested against store data', () => {
        const uniqueNumber = 1;
        expect(rules.isUniqueOrderNumberInStore(uniqueNumber)).toBeNull();
    });
    it('returns null when a unique order number is tested against store data while using the listOfGuidsToSkip param', () => {
        expect(rules.isUniqueOrderNumberInStore(stageOrderNumber, [stageGuid])).toBeNull();
    });
    it('returns an error when the order number is not unique', () => {
        expect(rules.isUniqueOrderNumberInStore(stageOrderNumber)).toBe(LABELS.orderNumberNotUnique);
    });
});

/*
TODO: to be used when we being validating null on RHS W-4983953
describe('RHS validation', () => {
    beforeAll(() => {
        getRHSTypes.mockReturnValue({
            String : [stringParam],
            Number : [numberParamCanBeField],
        });
    });

    it('allows null when valid', () => {
        const rulesArray = rules.validateExpressionWith3Properties({elementType: 'ASSIGNMENT'})(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: numberVariableGuid},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value:'ASSIGN'},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {}
            });
        const result = rulesArray.rightHandSide[0]();
        expect(result).toBeNull();
    });
    it('allows null when valid with sobject field', () => {
        const rulesArray = rules.validateExpressionWith3Properties({elementType: 'ASSIGNMENT'})(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: accountSObjectVariableGuid + '.Name'},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value:'ASSIGN'},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {}
            });
        const result = rulesArray.rightHandSide[0]();
        expect(result).toBeNull();
    });
});
*/