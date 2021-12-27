// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

export const additionalRules = {
    picklistObject: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined],
    dataType: [ValidationRules.shouldNotBeNullOrUndefined],
    picklistField: [ValidationRules.shouldNotBeNullOrUndefined]
};

export const picklistChoiceSetValidation = new Validation(additionalRules);

/**
 * Get finalized rules for validation
 *
 * @param {Object} choice get the storedValueIndex from the choice
 * @param choice.picklistObjectIndex
 * @returns {Object} the overridden rules
 */
export const getRules = ({ picklistObjectIndex }) => {
    const overrideRules = Object.assign({}, picklistChoiceSetValidation.finalizedRules);
    overrideRules.picklistObject.push(ValidationRules.validateResourcePicker(picklistObjectIndex));
    return overrideRules;
};
