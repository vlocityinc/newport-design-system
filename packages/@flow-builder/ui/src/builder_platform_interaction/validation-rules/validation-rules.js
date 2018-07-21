import { getRulesForContext, getRHSTypes, elementToParam } from 'builder_platform_interaction-rule-lib';
import { EXPRESSION_PROPERTY_TYPE, isElementAllowed, getFieldParamRepresentation,
    getResourceByUniqueIdentifier } from 'builder_platform_interaction-expression-utils';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { isUndefinedOrNull, format } from 'builder_platform_interaction-common-utils';
import { sanitizeGuid } from 'builder_platform_interaction-data-mutation-lib';
import { Store } from 'builder_platform_interaction-store-lib';
import { LABELS as labels} from './validation-rules-labels';

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
        regexPattern: '\\W+$',
        message: LABELS.shouldAcceptOnlyAlphanumericCharacters,
    },
    shouldBeAPositiveIntegerOrZero : {
        regexPattern: '[^0-9]+',
        message: LABELS.shouldBeAPositiveIntegerOrZero
    }
};

const validateBlankRHS = (lhsIdentifier, operator, contextConfig) => {
    // TODO: clean up when NULL is handled by the rules W-4983639
    return () => {
        let lhsParam = null;
        const blankRHSParam = {
            isCollection: null,
            elementType: ELEMENT_TYPE.VARIABLE,
            dataType: 'String',
        };
        const complexGuid = sanitizeGuid(lhsIdentifier);
        const flowElement = getResourceByUniqueIdentifier(complexGuid.guidOrLiteral);
        if (complexGuid.fieldName) {
            const sobject = (flowElement) ? flowElement.objectType : complexGuid.guidOrLiteral;
            lhsParam = getFieldParamRepresentation(sobject, complexGuid.fieldName);
        } else {
            lhsParam = elementToParam(flowElement);
        }
        const rhsTypes = getRHSTypes(contextConfig.elementType, lhsParam, operator, getRulesForContext(contextConfig));
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
            return format(LABELS.maximumCharactersLimit, limit);
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
                    validateBlankRHS(expression[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value,
                        expression[EXPRESSION_PROPERTY_TYPE.OPERATOR].value, contextConfig),
                ];
            }
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

    /** Exported Validation Rules End **/
