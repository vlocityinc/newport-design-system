import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const additionalRules = {
    offset: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeANumber
    ],
    offsetUnit: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
};

export const durationWaitValidation = new Validation(additionalRules);

/**
 * Build specific overridden rules
 *
 * @returns the overridden rules
 */
export const getRules = () => {
    return { ...durationWaitValidation.finalizedRules };
};
