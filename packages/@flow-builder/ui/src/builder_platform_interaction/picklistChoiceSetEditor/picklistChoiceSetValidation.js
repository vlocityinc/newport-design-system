import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

export const additionalRules = {
    'picklistObject': [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
    ],
    'dataType': [
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    'picklistField': [
        ValidationRules.shouldNotBeNullOrUndefined
    ]
};

export const picklistChoiceSetValidation = new Validation(additionalRules);