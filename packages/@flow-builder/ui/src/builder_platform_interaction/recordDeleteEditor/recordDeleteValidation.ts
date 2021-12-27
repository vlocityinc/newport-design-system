// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * validates against possible blank, empty or undefined value
 *
 * @param index
 * @returns {Array} corresponding array of validation rules
 */
const validateAgainstBlankNullOrUndefined = (index) => {
    return [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.validateResourcePicker(index)
    ];
};

/**
 * Validates the record filter item.
 *
 * @returns {Function} the function to be called with each filter item to return the array of rules.
 */
const validateFilters = () => ValidationRules.validateExpressionWith3PropertiesWithNoEmptyRHS();

export const recordDeleteValidation = new Validation();

/**
 * @param {Object} nodeElement the element that need to be validated
 * @param {Object} grabbing properties isSObjectMode
 * @param grabbing.isSObjectMode
 * @returns {Object} the overridden rules
 */
export const getRules = (nodeElement, { isSObjectMode }) => {
    const overrideRules = { ...recordDeleteValidation.finalizedRules };
    // case where an sObject has been selected
    if (isSObjectMode) {
        overrideRules.inputReference = validateAgainstBlankNullOrUndefined(nodeElement.inputReferenceIndex);
    } else {
        overrideRules.object = validateAgainstBlankNullOrUndefined(nodeElement.objectIndex);
        if (nodeElement.object.value !== '' && !nodeElement.object.error) {
            overrideRules.filterLogic = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
            overrideRules.filters = validateFilters();
        }
    }
    return overrideRules;
};
