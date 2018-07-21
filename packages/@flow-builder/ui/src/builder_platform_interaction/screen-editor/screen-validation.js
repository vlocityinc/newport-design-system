import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const screenAdditionalRules = {
    'label' : [
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
        // TODO: W-4947221 - add validation rules for default value based on type
        // i.e. if input type is number, make sure default value is a number.
    }
};

export const screenValidation = new Validation(screenAdditionalRules);