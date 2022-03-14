import {
    MAX_MAX_RESPONSES,
    MAX_WITHIN_DAYS,
    MIN_MAX_RESPONSES,
    MIN_WITHIN_DAYS
} from 'builder_platform_interaction/limitRepetitionsLib';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const additionalRules = {
    maxResponses: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeANumber,
        ValidationRules.shouldBeInRange(MIN_MAX_RESPONSES, MAX_MAX_RESPONSES)
    ],
    withinDays: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeANumber,
        ValidationRules.shouldBeInRange(MIN_WITHIN_DAYS, MAX_WITHIN_DAYS)
    ],
    inputRecommendations: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined],
    responseTypeToLimit: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined]
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
