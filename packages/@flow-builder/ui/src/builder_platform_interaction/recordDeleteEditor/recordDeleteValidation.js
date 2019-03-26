import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

/**
 * validates against possible blank, empty or undefined value
 * @returns {Array} corresponding array of validation rules
 */
const validateAgainstBlankNullOrUndefined = () => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined];
};

/**
 * Validates the record filter item.
 * @returns {function} the function to be called with each filter item to return the array of rules.
 */
const validateFilters = () => ValidationRules.validateExpressionWith3PropertiesWithNoEmptyRHS();

export const recordDeleteValidation = new Validation();

/**
 * @param {Object} nodeElement the element that need to be validated
 * @param {Object} grabbing properties isSObjectMode
 * @returns {Object} the overridden rules
 */
export const getRules = (nodeElement, {isSObjectMode}) => {
    const overrideRules = {...recordDeleteValidation.finalizedRules};
    // case where an sObject has been selected
    if (isSObjectMode) {
        overrideRules.inputReference = validateAgainstBlankNullOrUndefined();
        overrideRules.inputReference.push(ValidationRules.validateResourcePicker(nodeElement.inputReferenceIndex));
    } else {
        overrideRules.object = validateAgainstBlankNullOrUndefined();
        if (nodeElement.object.value !== '' && !nodeElement.object.error) {
            overrideRules.filters = validateFilters();
        }
    }
    return overrideRules;
};

