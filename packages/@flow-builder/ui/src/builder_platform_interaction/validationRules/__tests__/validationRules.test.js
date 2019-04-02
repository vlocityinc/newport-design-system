import * as rules from "builder_platform_interaction/validationRules";
import { assignmentElementGuid, assignmentElementName, stageGuid, stageOrderNumber } from "mock/storeData";
import { mockAccountFields } from "mock/serverEntityData";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { LABELS } from "../validationRulesLabels";
import { format } from "builder_platform_interaction/commonUtils";
import { isValidMetadataDateTime, getFormat } from 'builder_platform_interaction/dateTimeUtils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { validatePicker } from "builder_platform_interaction/expressionValidator";

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/expressionValidator', () => require('builder_platform_interaction_mocks/expressionValidator'));

jest.mock('builder_platform_interaction/ruleLib', () => {
    const actual = require.requireActual('../../ruleLib/ruleLib.js');
    return {
        elementToParam: actual.elementToParam,
        isMatch: actual.isMatch,
        PARAM_PROPERTY: actual.PARAM_PROPERTY,
    };
});

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockName('validateTextWithMergeFields').mockReturnValue([]),
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
        SERVER_ACTION_TYPE: require.requireActual('../../serverDataLib/serverDataLib.js').SERVER_ACTION_TYPE,
    };
});

jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        getFormat: jest.fn().mockName('getFormat'),
        isValidMetadataDateTime: jest.fn().mockName('isValidMetadataDateTime'),
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
    beforeEach(() => {
        getFormat.mockReturnValueOnce('mm/dd/yyyy');
    });

    it('calls isValidMetadataDateTime', () => {
        const date = new Date();
        rules.shouldBeADate(date.toISOString());
        expect(isValidMetadataDateTime).toHaveBeenCalledWith(date.toISOString(), false);
    });
    it('should return null when the input contains a valid date string', () => {
        isValidMetadataDateTime.mockReturnValueOnce(true);
        expect(rules.shouldBeADate(new Date().toISOString())).toBeNull();
    });
    it('should return null when the input contains a null value', () => {
        expect(rules.shouldBeADate(null)).toBeNull();
    });
    it('should return null when the input contains an empty string', () => {
        expect(rules.shouldBeADate('')).toBeNull();
    });
    it('should return an error when the input contains non-alphanumeric characters', () => {
        const expectedErrorMessage = format(LABELS.dateErrorMessage, getFormat());
        isValidMetadataDateTime.mockReturnValueOnce(false);
        isValidMetadataDateTime.mockReturnValueOnce(false);
        expect(rules.shouldBeADate('aaa')).toBe(expectedErrorMessage);
        expect(rules.shouldBeADate('13/13/13')).toBe(expectedErrorMessage);
    });
});

describe('shouldBeADateTime method', () => {
    beforeEach(() => {
        getFormat.mockReturnValueOnce('mm/dd/yyyy hh:mm:ss');
    });

    it('calls isValidMetadataDateTime', () => {
        const date = new Date();
        rules.shouldBeADateTime(date.toISOString());
        expect(isValidMetadataDateTime).toHaveBeenCalledWith(date.toISOString(), true);
    });
    it('should return null when the input contains a valid date time string', () => {
        isValidMetadataDateTime.mockReturnValueOnce(true);
        expect(rules.shouldBeADateTime(new Date().toISOString())).toBeNull();
    });
    it('should return null when the input contains a null value', () => {
        expect(rules.shouldBeADateTime(null)).toBeNull();
    });
    it('should return null when the input contains an empty string', () => {
        expect(rules.shouldBeADateTime('')).toBeNull();
    });
    it('should return an error when the input contains non-alphanumeric characters', () => {
        const expectedErrorMessage = format(LABELS.datetimeErrorMessage, getFormat(true));
        isValidMetadataDateTime.mockReturnValueOnce(false);
        isValidMetadataDateTime.mockReturnValueOnce(false);
        expect(rules.shouldBeADateTime('aaa')).toBe(expectedErrorMessage);
        expect(rules.shouldBeADateTime('13/13/13')).toBe(expectedErrorMessage);
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
        // rules.lhsShouldBeValid comes in as an anonymous function here
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toHaveLength(2);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.OPERATOR]).toEqual([rules.shouldNotBeBlank]);
    });
    it('should not contain RHS rule if LHS, operator, and RHS are all populated', () => {
        const rulesObject = rules.validateExpressionWith3Properties()(
            {
                [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'populated'},
                [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: 'populated'},
                [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: 'populated'}
            });
        // rules.lhsShouldBeValid comes in as an anonymous function here
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toHaveLength(2);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.OPERATOR]).toEqual([rules.shouldNotBeBlank]);
        // rules.rhsShouldBeValid comes in as an anonymous function here
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]).toHaveLength(1);
    });
});

describe('validateExpressionWith3PropertiesWithNoEmptyRHS', () => {
    const rulesObject = rules.validateExpressionWith3PropertiesWithNoEmptyRHS()(
        {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'populated'},
            [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {value: 'populated'},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {}
        });
    expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toHaveLength(2);
    expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
    expect(rulesObject[EXPRESSION_PROPERTY_TYPE.OPERATOR]).toEqual([rules.shouldNotBeBlank]);
    expect(rulesObject[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]).toHaveLength(2);
    expect(rulesObject[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
});

describe('validateExpressionWith2Properties', () => {
    const rulesObject = rules.validateExpressionWith2Properties()(
        {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'populated'},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: 'populated'}
        });
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toHaveLength(2);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]).toHaveLength(1);
});

describe('validateExpressionWith2PropertiesWithNoEmptyRHS', () => {
    const rulesObject = rules.validateExpressionWith2PropertiesWithNoEmptyRHS()(
        {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {value: 'populated'},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {value: 'populated'}
        });
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toHaveLength(2);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]).toHaveLength(2);
        expect(rulesObject[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]).toContain(rules.shouldNotBeBlank);
});

describe('validateResourcePicker', () => {
    const error = 'error';
    validatePicker.mockReturnValueOnce('error');
    expect(rules.validateResourcePicker('guid')()).toEqual(error);
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
});

describe('checkDevNameUniqueness method', () => {
    it('returns null if a unique dev name is passed', () => {
        expect(rules.checkDevNameUniqueness("mockUniqueName", ["mockGuid"])).toBeNull();
    });
    it('returns an error if dev name passed is not unique', () => {
        expect(rules.checkDevNameUniqueness(assignmentElementName.toUpperCase(), [assignmentElementGuid])).toBe(LABELS.fieldNotUnique);
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

describe('isValidTextWithMergeFields', () => {
    it('returns a function', () => {
        const rule = rules.isValidTextWithMergeFields();
        expect(rule).toEqual(expect.any(Function));
    });

    it('calls validateTextWithMergeFields with the text', () => {
        const rule = rules.isValidTextWithMergeFields();
        const text = 'some merge {!field}';
        rule(text);
        expect(validateTextWithMergeFields).toHaveBeenCalledWith(text, undefined);
    });

    it('calls validateTextWithMergeFields with given options', () => {
        const options = { globalConstantsAllowed: false };
        const rule = rules.isValidTextWithMergeFields(options);
        rule(undefined, options);
        expect(validateTextWithMergeFields).toHaveBeenCalledWith(undefined, options);
    });

    it('returns null when no errors are found', () => {
        const rule = rules.isValidTextWithMergeFields();
        const result = rule();
        expect(result).toBeNull();
    });

    it('returns the first error message when errors are found', () => {
        const mockErrors = [{ message: 'firstError' }, { message:'secondError' }];
        validateTextWithMergeFields.mockReturnValueOnce(mockErrors);
        const rule = rules.isValidTextWithMergeFields();
        const result = rule();
        expect(result).toEqual(mockErrors[0].message);
    });
});

describe('isValideResourceTextArea', () => {
    it('calls isValidTextWithMergeFields and disables global constants and allows collection variables ', () => {
        const text = 'some text';
        rules.isValidResourcedTextArea(text);
        expect(validateTextWithMergeFields).toHaveBeenCalledWith(text, { allowGlobalConstants : false, allowCollectionVariables : true });
    });
});

/*
TODO: to be used when we being validating null on RHS W-4983953
describe('RHS validation', () => {
    beforeAll(() => {
        getRHSTypes.mockReturnValue({
            String : [stringParam],
            Number : [numberParamCanBeAnything],
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