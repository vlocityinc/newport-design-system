import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const additionalRules = {
    'label' : [{
        ruleName: 'should_accept_alphanumeric_or_special_characters',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '^(?![a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(+=.\\-_ ]+$)',
        message: "Accepts only AlphaNumeric or Special Characters.",
    }, {
        ruleName: 'maximum_characters_limit',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '^(?!.{0,255}$)',
        message: "Cannot accept more than 255 characters.",
    }],
    'name' : [{
        ruleName: 'should_not_begin_with_numeric_or_special_characters',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '^(?![A-z]+[a-zA-Z0-9!@#\\$%\\^\\&*\\)\\(\\?\\/_+=.~\\- ]*$)',
        message: "Should begin with Alphabetical Characters instead of Numeric Characters.",
    }, {
        ruleName: 'maximum_characters_limit',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '^(?!.{0,80}$)',
        message: "Cannot accept more than 80 characters.",
    }]
};

class AssignmentValidation extends Validation {
    /**
     * @param {string} propName - property name to be validated
     * @param {string} value - value
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    validateProperty(propName, value) {
        return super.validateProperty(propName, value, additionalRules[propName]);
    }
}

export const assignmentValidation = new AssignmentValidation();