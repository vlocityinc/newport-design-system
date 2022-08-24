import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const additionalRules = {
    resumeTime: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank],
    resumeDate: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
};

export const dateWaitValidation = new Validation(additionalRules);

/**
 * Build specific overridden rules
 *
 * @returns the overridden rules
 */
export const getRules = () => {
    return { ...dateWaitValidation.finalizedRules };
};
