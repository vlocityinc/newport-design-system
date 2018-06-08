import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    'name'  : [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    'expression' : [
        ValidationRules.maximumCharactersLimit(3900)
    ]
};

export const formulaValidation = new Validation(additionalRules);