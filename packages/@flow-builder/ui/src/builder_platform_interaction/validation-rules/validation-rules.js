// TODO i18n after W-4693112
/**
 * @param {Object} rule - object containing regex pattern and message
 * @param {string} value - value to be evaluated
 * @returns {string|null} errorString or null
 */
const evaluateRegex = (rule, value) => {
    const regex = new RegExp(rule.regexPattern);
    if (regex.test(value)) {
        return rule.message;
    }
    return null;
};

const regexConfig = {
    shouldNotBeBlank: {
        regexPattern: '^\\s*$',
        message: 'Cannot be blank.'
    },
    shouldNotBeginOrEndWithEmptySpaces: {
        regexPattern: '^[ \\t]+|[ \\t]+$',
        message: 'Should not have trailing empty spaces at the beginning or ending.',
    },
    shouldNotBeginOrEndWithUnderscores: {
        regexPattern: '^[_{0,}]+|_{2,}|[_{0,}]+$',
        message: 'Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.',
    },
    shouldAcceptAlphanumericOrSpecialCharacters: {
        regexPattern: '^[^a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=.\\-_ ]+$',
        message: 'Accepts only AlphaNumeric or Special Characters.',
    },
    shouldNotBeginWithNumericOrSpecialCharacters: {
        regexPattern: '^[^a-zA-Z]{1}',
        message: 'Should always begin with Alphabetical Characters instead of Numeric or Special Characters.',
    },
    shouldAcceptOnlyAlphanumericCharacters: {
        regexPattern: '\\W+$',
        message: 'Cannot accept any Special Characters.',
    }
};

export const VALIDATE_ALL = 'VALIDATE_ALL';

/** Exported Validation Rules Start **/

/**
 * Function to test the value should not be blank
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldNotBeBlank = (value) => evaluateRegex(regexConfig.shouldNotBeBlank, value);

/**
 * Function to test the value should not begin or end with empty spaces
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldNotBeginOrEndWithEmptySpaces = (value) => evaluateRegex(regexConfig.shouldNotBeginOrEndWithEmptySpaces, value);

/**
 * Function to test the value should not begin or end with underscore
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldNotBeginOrEndWithUnderscores = (value) => evaluateRegex(regexConfig.shouldNotBeginOrEndWithUnderscores, value);

/**
 * Function to test the value should accept only alphanumeric or special characters
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldAcceptAlphanumericOrSpecialCharacters = (value) => evaluateRegex(regexConfig.shouldAcceptAlphanumericOrSpecialCharacters, value);

/**
 * Function to test the value should not begin with numeric or special characters
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldNotBeginWithNumericOrSpecialCharacters = (value) => evaluateRegex(regexConfig.shouldNotBeginWithNumericOrSpecialCharacters, value);

/**
 * Function to test the value should not be blank
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldAcceptOnlyAlphanumericCharacters = (value) => evaluateRegex(regexConfig.shouldAcceptOnlyAlphanumericCharacters, value);


/**
 * Curry Function to test the length of the value does not go beyond a maximum character limit specified
 * Usage - for a field rule : maximumCharacterLimit(80) it runs as :  maximumCharacterLimit(80) (value)
 * @param {number} limit - maximum number of characters possible in value
 * @returns {string|null} errorString or null
 */
export const maximumCharactersLimit = (limit) => {
    return function (value) {
        if (value.length > limit) {
            return 'Cannot accept more than ' + limit + ' characters.';
        }
        return null;
    };
};

/** Exported Validation Rules End **/