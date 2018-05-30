import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    'label' : [
        ValidationRules.shouldAcceptOnlyAlphanumericOrSpecialCharacters,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'name'  : [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(8)
    ],
    'helpText' : [
        ValidationRules.maximumCharactersLimit(8)
    ]
};

export const screenValidation = new Validation(additionalRules);