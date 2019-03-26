import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    label : [
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    name  : [
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    assignNextValueToReference : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
    ],
    collectionReference : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
    ]
};

export const loopValidation = new Validation(additionalRules);

/**
 * Get finalized rules for validation
 * @param {Object} state get the assignNextValueToReferenceIndex & collectionReferenceIndex from the loop
 * @returns {Object} the overridden rules
 */
export const getRules = ({assignNextValueToReferenceIndex, collectionReferenceIndex}) => {
    const overrideRules = Object.assign({}, loopValidation.finalizedRules);
    overrideRules.assignNextValueToReference.push(ValidationRules.validateResourcePicker(assignNextValueToReferenceIndex));
    overrideRules.collectionReference.push(ValidationRules.validateResourcePicker(collectionReferenceIndex));
    return overrideRules;
};
