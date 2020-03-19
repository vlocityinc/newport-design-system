import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const additionalRules = {
    object: [ValidationRules.shouldNotBeBlank]
};

export const platformEventValidation = new Validation(additionalRules, true);
