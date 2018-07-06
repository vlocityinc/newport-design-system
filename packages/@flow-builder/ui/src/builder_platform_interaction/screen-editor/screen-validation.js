import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const screenAdditionalRules = {
    'label' : [
        ValidationRules.shouldAcceptOnlyAlphanumericOrSpecialCharacters,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'name'  : [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    'fields' : {
        'name' : [
            ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
            ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
            ValidationRules.maximumCharactersLimit(80)
        ],
        'type.name="Number"': {
            'scale' : [
                ValidationRules.shouldBeAPositiveIntegerOrZero
            ]
        },
        'type.name="Date"': {
            'defaultValue' : [
                ValidationRules.shouldBeADate
            ]
        }
    }
};

export const screenValidation = new Validation(screenAdditionalRules);