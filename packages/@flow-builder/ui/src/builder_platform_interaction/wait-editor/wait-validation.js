import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
export const additionalRules = {
    label : [
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    name  : [
        ValidationRules.shouldNotBeNullOrUndefined
    ]
};

export const waitValidation = new Validation(additionalRules);