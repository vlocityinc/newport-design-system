import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { isUndefinedOrNull, format } from "builder_platform_interaction/commonUtils";
import { Store } from "builder_platform_interaction/storeLib";
import { LABELS as labels} from "./validationRulesLabels";

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
    const d = new Date(value);
    if (!(d instanceof Date && isFinite(d))) {
        return LABELS.mustBeAValidDate;
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
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [shouldNotBeBlank];
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
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const matches = Object.values(elements).filter(element =>
        !listOfGuidsToSkip.includes(element.guid) &&
        (element.name && element.name.toLowerCase()) === nameToBeTested.toLowerCase());
    return matches.length > 0 ? LABELS.fieldNotUnique : null;
};

/**
 * Checks the uniqueness of the order number amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {number} orderNumberToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {string|null} errorString or null
 */
export const isUniqueOrderNumberInStore = (orderNumberToBeTested, listOfGuidsToSkip = []) => {
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const matches = Object.values(elements).filter(element =>
        !listOfGuidsToSkip.includes(element.guid) && (element.stageOrder) === orderNumberToBeTested);
    return matches.length > 0 ? LABELS.orderNumberNotUnique : null;
};

    /** Exported Validation Rules End **/
