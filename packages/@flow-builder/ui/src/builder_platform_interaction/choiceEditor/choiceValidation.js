import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

export const additionalRules = {
    'choiceText' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'dataType': [
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    'userInput': {
        'promptText': [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeNullOrUndefined
        ]
    }
};

export const choiceValidation = new Validation(additionalRules);