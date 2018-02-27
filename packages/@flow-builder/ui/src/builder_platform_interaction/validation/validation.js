import * as ValidationRules from 'builder_platform_interaction-validation-rules';
/**
 * @constant fieldToValidationRulesMap - map of propertyName to validation rules
 * @type {Object}
 */
const fieldToValidationRulesMap = {
    // TODO: Example for label field, actual rules may wary after the spike from sgesin
    'label' : [ValidationRules.shouldNotBeEmpty, ValidationRules.cannotStartWithUnderScore]
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
        let rulesForField = fieldToValidationRulesMap[propName] || [];
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