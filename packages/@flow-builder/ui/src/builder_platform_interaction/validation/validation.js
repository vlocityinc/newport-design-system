import * as ValidationRules from 'builder_platform_interaction-validation-rules';

/**
 * @constant defaultRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const defaultRules = {
    'label' : [{
        ruleName: 'should_not_be_blank',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '^\\s*$',
        message: "Cannot be blank."
    }, {
        ruleName: 'should_not_begin_or_end_with_empty_spaces',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '(^|\\s)($|\\s)',
        message: "Should not have trailing empty spaces at the beginning or ending.",
    }, {
        ruleName: 'should_not_begin_or_end_with_underscores',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '(^|_)($|_)',
        message: "Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.",
    }],
    'name' : [{
        ruleName: 'should_not_be_blank',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '^\\s*$',
        message: "Cannot be blank."
    }, {
        ruleName: 'should_not_begin_or_end_with_empty_spaces',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '(^|\\s)($|\\s)',
        message: "Should not have trailing empty spaces at the beginning or ending.",
    }, {
        ruleName: 'should_not_begin_or_end_with_underscores',
        funcType: ValidationRules.evaluateRegex,
        regexPattern: '(^|_)($|_)',
        message: "Should not have trailing underscores to begin with (or) end with (or) should not have consecutive underscores.",
    }]
};

export class Validation {
    /**
     * @param {string} propName - property name to be validated
     * @param {string} value - value
     * @param {string[]} additionalRules - additional element specific rules
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    validateProperty(propName, value, additionalRules) {
        let errorReturnedFromRule = null;
        let rulesForField = defaultRules[propName] || [];
        if (additionalRules) {
            rulesForField = rulesForField.concat(additionalRules);
        }
        for (const rule of rulesForField) {
            errorReturnedFromRule = rule.funcType(value, rule);
            if (errorReturnedFromRule !== null) {
                break; // come out of the loop and return the error
            }
        }
        return errorReturnedFromRule;
    }
}