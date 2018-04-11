import * as ValidationRules from 'builder_platform_interaction-validation-rules';

/**
 * @constant defaultRules - map of propertyName to validation rules
 * @type {Object}
 */
// TODO here to replace the expected error message with a reference to the label file once we have that in place
const defaultRules = {
    'label' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeginOrEndWithEmptySpaces
    ],
    'name' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeginOrEndWithEmptySpaces,
        ValidationRules.shouldNotBeginOrEndWithUnderscores
    ]
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
            errorReturnedFromRule = rule(value);
            if (errorReturnedFromRule !== null) {
                break; // come out of the loop and return the error
            }
        }
        return errorReturnedFromRule;
    }
}