import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const screenAdditionalRules = {
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
        'type.name="Currency"': {
            'scale' : [
                ValidationRules.shouldBeAPositiveIntegerOrZero
            ]
        },
        'type.name="Date"': {
            'defaultValue' : [
                ValidationRules.shouldBeADate
            ]
        }
        // TODO: W-5297355 - add complete set of validation rules for screens
    }
};

export const screenValidation = new Validation(screenAdditionalRules);