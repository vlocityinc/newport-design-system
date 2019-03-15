import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { isUndefinedOrNull, format } from "builder_platform_interaction/commonUtils";
import { isDevNameInStore, isOrderNumberInStore } from "builder_platform_interaction/storeUtils";
import { isValidMetadataDateTime, getFormat } from 'builder_platform_interaction/dateTimeUtils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LABELS as labels} from "./validationRulesLabels";
import { validateLHS, validateRHS } from "builder_platform_interaction/expressionValidator";

/**
 * @param {Object} rule - object containing regex pattern and message
 * @param {string} value - value to be evaluated
 * @returns {string|null} errorString or null
 */

export const LABELS = labels;

const evaluateRegex = (rule, value) => {
    const regex = new RegExp(rule.regexPattern);
    if (regex.test(value)) {
        return rule.message;
    }
    return null;
};

const cannotBeBlankError = LABELS.cannotBeBlank;
const dateErrorMessage = format(LABELS.dateErrorMessage, getFormat());
const datetimeErrorMessage = format(LABELS.datetimeErrorMessage, getFormat(true));

const regexConfig = {
    shouldNotBeBlank: {
        regexPattern: '^\\s*$',
        message: cannotBeBlankError,
    },
    shouldNotBeginOrEndWithUnderscores: {
        regexPattern: '^_{1,}|_{1,}$|_{2,}',
        message: LABELS.shouldNotBeginOrEndWithUnderscores,
    },
    shouldNotBeginWithNumericOrSpecialCharacters: {
        regexPattern: '^[^a-zA-Z]{1}',
        message: LABELS.shouldNotBeginWithNumericOrSpecialCharacters,
    },
    shouldAcceptOnlyAlphanumericCharacters: {
        regexPattern: '\\W+',
        message: LABELS.shouldAcceptOnlyAlphanumericCharacters,
    },
    shouldBeAPositiveIntegerOrZero : {
        regexPattern: '[^0-9]+',
        message: LABELS.shouldBeAPositiveIntegerOrZero
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
 * Function to test the value should not begin or end with underscore
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldNotBeginOrEndWithUnderscores = (value) => evaluateRegex(regexConfig.shouldNotBeginOrEndWithUnderscores, value);

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
 * Function to test the value is zero or a positive integer
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldBeAPositiveIntegerOrZero = (value) => evaluateRegex(regexConfig.shouldBeAPositiveIntegerOrZero, value);

/**
 * Function to test the value is a valid date
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldBeADate = (value) => {
    if (!value) {
        return null;
    }

    if (!isValidMetadataDateTime(value, false)) {
        return dateErrorMessage;
    }

    return null;
};

/**
 * Function to test the value is a valid date/time
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldBeADateTime = (value) => {
    if (!value) {
        return null;
    }

    if (!isValidMetadataDateTime(value, true)) {
        return datetimeErrorMessage;
    }

    return null;
};

/**
 * Function to test the value is under the max integer value allowed.
 * @param {string} maxLimit - max value allowed
 * @returns {string|null} errorString or null
 */
export const shouldBeUnderMaxValue = (maxLimit) => {
    return function (value) {
        if (isNaN(value)) {
            return LABELS.shouldBeAPositiveIntegerOrZero;
        } else if (value > maxLimit) {
            return format(LABELS.overMaxIntegerValue, maxLimit);
        }
        return null;
    };
};

/**
 * Function to test the value is a valid number
 * @param {string} value - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldBeANumber = (value) => {
    if (isNaN(Number(value))) {
        return LABELS.mustBeAValidNumber;
    }

    return null;
};

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
        if (value && value.length > limit) {
            return format(LABELS.maximumCharactersLimit, limit);
        }
        return null;
    };
};
/**
 * Tests if the value passed is within the given range or not.
 * @param {number} rangeMinimum Minimum
 * @param {number} rangeMaximum Maximum
 * @returns {string|null} errorString or null
 */
export const shouldBeInRange = (rangeMinimum, rangeMaximum) => {
    return function (value) {
        if (value !== '') {
            value = Number(value);
            if (value < rangeMinimum || value > rangeMaximum) {
            return format(LABELS.shouldBeInRange, rangeMinimum, rangeMaximum);
            }
        }
        return null;
    };
};

/**
 * Run validation on LHS of an expression
 * @param {String} rowIndex the index(guid) of the expression
 */
export const lhsShouldBeValid = (rowIndex) => {
    return function () {
        return validateLHS(rowIndex);
    };
};

/**
 * Run validation on RHS of an expression
 * @param {String} rowIndex the index(guid) of the expression
 */
export const rhsShouldBeValid = (rowIndex) => {
    return function () {
        return validateRHS(rowIndex);
    };
};

/**
 * Validates 3 part expression builder to make sure LHS and operator are not blank
 *
 * @returns {string|null} errorString or null
 */
export const validateExpressionWith3Properties = () => {
    return (expression) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [shouldNotBeBlank]
        };

        if (expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].push(lhsShouldBeValid(expression.rowIndex));
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [shouldNotBeBlank];
        }

        if (expression[EXPRESSION_PROPERTY_TYPE.OPERATOR].value) {
            rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [rhsShouldBeValid(expression.rowIndex)];
        }

        return rules;
    };
};

/**
 * Validates 3 part expression builders but requires the RHS to not be empty
 * @returns {string|null} errorString or null
 */
export const validateExpressionWith3PropertiesWithNoEmptyRHS = () => {
    return (expression) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [shouldNotBeBlank]
        };

        if (expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].push(lhsShouldBeValid(expression.rowIndex));
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [shouldNotBeBlank];
        }

        if (expression[EXPRESSION_PROPERTY_TYPE.OPERATOR].value) {
            rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [shouldNotBeBlank, rhsShouldBeValid(expression.rowIndex)];
        }

        return rules;
    };
};


/**
 * Validates 2 part expression builders
 * @returns {string|null} errorString or null
 */
export const validateExpressionWith2Properties = () => {
    return (expression) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [shouldNotBeBlank]
        };

        if (expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].push(lhsShouldBeValid(expression.rowIndex));
        }

        if (expression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [rhsShouldBeValid(expression.rowIndex)];
        }

        return rules;
    };
};

/**
 * Validates 2 part expression builders but requires the RHS to not be empty
 * @returns {string|null} errorString or null
 */
export const validateExpressionWith2PropertiesWithNoEmptyRHS = () => {
    return (expression) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [shouldNotBeBlank],
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: []
        };

        if (expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].push(lhsShouldBeValid(expression.rowIndex));
            rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [shouldNotBeBlank];
        }

        if (expression[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE].push(rhsShouldBeValid(expression.rowIndex));
        }

        return rules;
    };
};

/**
 * Checks the uniqueness of the devName string amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {string} nameToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {string|null} errorString or null
 */
export const isUniqueDevNameInStore = (nameToBeTested, listOfGuidsToSkip = []) => {
    return isDevNameInStore(nameToBeTested, listOfGuidsToSkip) ? LABELS.fieldNotUnique : null;
};

/**
 * Dev Name uniqueness check method while doing validate all.
 * @param {*} nameToBeTested - dev name to be tested for uniqueness in store.
 * @param {*} parentElement - parent element object to get the guid.
 */
export const checkDevNameUniqueness = (nameToBeTested, parentElement) => {
    if (!parentElement) {
        return null; // no-op in case parent Element is not defined. This happens when this rule is called via validate property (Without parentElement this rule can provide false positives)
    }
    const parentGuid = parentElement && parentElement.guid;
    return isUniqueDevNameInStore(nameToBeTested, [parentGuid]);
};

/**
 * Checks the uniqueness of the order number amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {number} orderNumberToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {string|null} errorString or null
 */
export const isUniqueOrderNumberInStore = (orderNumberToBeTested, listOfGuidsToSkip = []) => {
    return isOrderNumberInStore(orderNumberToBeTested, listOfGuidsToSkip) ? LABELS.orderNumberNotUnique : null;
};

/**
 * Calls validation libarary on the given text
 * @param {Object} options list of options to provide to merge field validation
 * @returns {Function} function that accepts the text to be validated. Returns an error from validation operation
 */
export const isValidTextWithMergeFields = (options) => {
    return (text) => {
        const errors = validateTextWithMergeFields(text, options);
        return errors.length > 0 ? errors[0].message : null;
    };
};

/**
 * Validates that the text inside a resourced text area is valid
 * @param {String} text the text to validate
 */
export const isValidResourcedTextArea = (text) => {
    return isValidTextWithMergeFields({ allowGlobalConstants : false, allowCollectionVariables : true })(text);
};
    /** Exported Validation Rules End **/
