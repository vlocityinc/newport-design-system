import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";

/**
 * validates against possible blank, empty or undefined value
 * @returns {Array} corresponding array of validation rules
 */
const validateAgainstBlankNullOrUndefined = () => {
    return [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined];
};

/**
 * Validates the record filter item.
 * Here we can't use the ValidationRules.validateExpressionWith3Properties because this function allows empty RHS
 * @returns {function} the function to be called with each filter item to return the array of rules.
 */
const validateFilters = () => {
    return (filter) => {
        const rules = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: [ValidationRules.shouldNotBeBlank]
        };
        if (filter[EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE].value) {
            rules[EXPRESSION_PROPERTY_TYPE.OPERATOR] = [ValidationRules.shouldNotBeBlank];
            if (filter[EXPRESSION_PROPERTY_TYPE.OPERATOR].value) {
                rules[EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE] = [ValidationRules.shouldNotBeBlank];
            }
        }
        return rules;
    };
};

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
    } else {
        overrideRules.object = validateAgainstBlankNullOrUndefined();
        if (nodeElement.object.value !== '' && !nodeElement.object.error) {
            overrideRules.filters = validateFilters();
        }
    }
    return overrideRules;
};

