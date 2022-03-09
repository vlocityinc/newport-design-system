import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const additionalRules = {
    maxReaction: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeANumber,
        ValidationRules.shouldBeInRange(1, 2000)
    ],
    lookBackDays: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeANumber,
        ValidationRules.shouldBeInRange(1, 99999)
    ],
    inputOffers: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined],
    reactionType: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined]
};

export const limitRepetitionsValidation = new Validation(additionalRules);

/**
 * Build specific overridden rules
 *
 * @param state {Object}
 * @param elements
 * @returns {Object} the overridden rules
 */
export const getRules = (state) => {
    const overriddenRules = { ...limitRepetitionsValidation.finalizedRules };

    return overriddenRules;
};
