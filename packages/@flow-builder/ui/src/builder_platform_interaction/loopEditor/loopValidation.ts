import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @param elements elements of the flow
 * @type {Object}
 */
const additionalRules = (elements = {}) => {
    return {
        label: [ValidationRules.shouldNotBeNullOrUndefined],
        name: [ValidationRules.shouldNotBeNullOrUndefined],
        collectionReference: [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeNullOrUndefined,
            ValidationRules.shouldReferenceACollection(elements)
        ]
    };
};

export const loopValidation = (elements = {}) => {
    return new Validation(additionalRules(elements));
};

/**
 * Validate the assignNextValueToReference item.
 * @return {function} the function to be called with each filter item to return the array of rules.
 */
const validateAssignNextValueToReference = (assignNextValueToReferenceIndex) => {
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
const getRules = (
    { assignNextValueToReferenceIndex, collectionReferenceIndex, storeOutputAutomatically },
    elements
) => {
    const overrideRules = Object.assign({}, loopValidation(elements).finalizedRules);

    if (!storeOutputAutomatically) {
        overrideRules.assignNextValueToReference = validateAssignNextValueToReference(assignNextValueToReferenceIndex);
    }

    overrideRules.collectionReference.push(ValidationRules.validateResourcePicker(collectionReferenceIndex));
    return overrideRules;
};

export const validate = (state, elements) => {
    return loopValidation(elements).validateAll(state, getRules(state, elements));
};
