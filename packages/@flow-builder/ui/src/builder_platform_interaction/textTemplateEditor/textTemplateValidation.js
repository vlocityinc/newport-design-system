import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from 'builder_platform_interaction/validation';

export const additionalRules = {
        text : [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeNullOrUndefined
        ]
    };

export const textTemplateValidation = new Validation(additionalRules);