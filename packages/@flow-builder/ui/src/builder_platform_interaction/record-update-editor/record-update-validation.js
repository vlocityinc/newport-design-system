import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    inputReference: [
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeBlank
    ]
};

export const recordUpdateValidation = new Validation(additionalRules);