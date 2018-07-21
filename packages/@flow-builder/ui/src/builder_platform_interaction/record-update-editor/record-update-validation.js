import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    label: [
        ValidationRules.maximumCharactersLimit(255)
    ],
    name: [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    inputReference: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank
    ]
};

export const recordUpdateValidation = new Validation(additionalRules);