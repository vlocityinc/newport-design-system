import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

const MAX_ERR_MESSAGE_LEN = 65535;
const MAX_SCALE_VALUE = 17;


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
        'label' : [
            ValidationRules.maximumCharactersLimit(1000)
        ],
        'type.name="Number"': {
            'scale' : [
                ValidationRules.shouldBeAPositiveIntegerOrZero,
                ValidationRules.shouldBeUnderMaxValue(MAX_SCALE_VALUE)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="TextBox"': {
            'defaultValue' : [
                ValidationRules.maximumCharactersLimit(255)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="LargeTextArea"': {
            'defaultValue' : [
                ValidationRules.maximumCharactersLimit(255)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="Currency"': {
            'scale' : [
                ValidationRules.shouldBeAPositiveIntegerOrZero,
                ValidationRules.shouldBeUnderMaxValue(MAX_SCALE_VALUE)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="Date"': {
            'defaultValue' : [
                ValidationRules.shouldBeADate
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        },
        'type.name="Password"': {
            'defaultValue' : [
                ValidationRules.maximumCharactersLimit(255)
            ],
            'errorMessage' : [
                ValidationRules.maximumCharactersLimit(MAX_ERR_MESSAGE_LEN)
            ]
        }
        // TODO: W-5297355 - add complete set of validation rules for screens
    }
};

export const screenValidation = new Validation(screenAdditionalRules);