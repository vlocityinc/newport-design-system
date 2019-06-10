import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

export const MAX_TEXT_LENGTH = 65535;
export const additionalRules = {
    text: [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.isValidResourcedTextArea,
        ValidationRules.maximumCharactersLimit(MAX_TEXT_LENGTH)
    ]
};

export const textTemplateValidation = new Validation(additionalRules);
