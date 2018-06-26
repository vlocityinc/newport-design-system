import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { getRulesForContext, getRHSTypes, elementToParam } from 'builder_platform_interaction-rule-lib';
import { EXPRESSION_PROPERTY_TYPE, isElementAllowed } from 'builder_platform_interaction-expression-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { isUndefinedOrNull } from 'builder_platform_interaction-common-utils';

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

const cannotBeBlankError = 'Cannot be blank.';

const regexConfig = {
    shouldNotBeBlank: {
        regexPattern: '^\\s*$',
        message: cannotBeBlankError,
    },
    shouldNotBeginOrEndWithUnderscores: {
        regexPattern: '^_{1,}|_{1,}$|_{2,}',
        message: 'Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.',
    },
    shouldAcceptOnlyAlphanumericOrSpecialCharacters: {
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

const validateRHS = (lhs, operator, contextConfig) => {
    // TODO: clean up when NULL is handled by the rules W-4983639
    return () => {
        const blankRHSParam = {
            isCollection: null,
            elementType: ELEMENT_TYPE.VARIABLE,
            dataType: 'String',
        };
        const rhsTypes = getRHSTypes(contextConfig.elementType, elementToParam(getElementByGuid(lhs)), operator, getRulesForContext(contextConfig));
        const rhsValid = isElementAllowed(rhsTypes, blankRHSParam);
        if (!rhsValid) {
            return cannotBeBlankError;
        }
        return null;
    };
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
export const shouldAcceptOnlyAlphanumericOrSpecialCharacters = (value) => evaluateRegex(regexConfig.shouldAcceptOnlyAlphanumericOrSpecialCharacters, value);

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
 * Test if the value is null or undefined
 * @param {String} value the value to be tested
 * @returns {String|null} errorString or null
 */
export const shouldNotBeNullOrUndefined = (value) => {
    if (isUndefinedOrNull(value)) {
        return cannotBeBlankError;
    }
    return null;
};

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

/**
 * Validates 3 part expression builder to make sure LHS and operator are not blank,
 * and RHS is only null if it's valid.
 *
 * @param {Object} contextConfig   the same contextConfig that will be used to setup the expressionBuilder
 * @returns {string|null} errorString or null
 */
export const validateExpressionWith3Properties = (contextConfig) => {
    return (expression) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [shouldNotBeBlank]
        };

        if (expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [shouldNotBeBlank];
            if (expression[EXPRESSION_PROPERTY_TYPE.OPERATOR].value && !expression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value) {
                rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [
                    validateRHS(expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value,
                        expression[EXPRESSION_PROPERTY_TYPE.OPERATOR].value, contextConfig),
                ];
            }
        }

        return rules;
    };
};

    /** Exported Validation Rules End **/
