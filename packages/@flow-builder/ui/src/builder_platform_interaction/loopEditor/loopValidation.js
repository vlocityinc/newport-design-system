import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
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
    ],
    assignNextValueToReference : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    collectionReference : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined
    ]
};

export const loopValidation = new Validation(additionalRules);
