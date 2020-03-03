import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    label: [ValidationRules.shouldNotBeNullOrUndefined],
    name: [ValidationRules.shouldNotBeNullOrUndefined],
    collectionReference: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined]
};

export const loopValidation = new Validation(additionalRules);

/**
 * Validate the assignNextValueToReference item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignNextValueToReference = assignNextValueToReferenceIndex => {
    return [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.validateResourcePicker(assignNextValueToReferenceIndex)
    ];
};

/**
 * Get finalized rules for validation
 * @param {Object} state get the assignNextValueToReferenceIndex & collectionReferenceIndex from the loop
 * @returns {Object} the overridden rules
 */
export const getRules = ({ assignNextValueToReferenceIndex, collectionReferenceIndex, storeOutputAutomatically }) => {
    const overrideRules = Object.assign({}, loopValidation.finalizedRules);

    if (!storeOutputAutomatically) {
        overrideRules.assignNextValueToReference = validateAssignNextValueToReference(assignNextValueToReferenceIndex);
    }

    overrideRules.collectionReference.push(ValidationRules.validateResourcePicker(collectionReferenceIndex));
    return overrideRules;
};
