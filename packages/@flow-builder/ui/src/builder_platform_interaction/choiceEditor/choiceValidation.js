import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

const additionalRules = {
    'choiceText' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'dataType': [
        ValidationRules.shouldNotBeNullOrUndefined
    ],
    'userInput': {
        'promptText': [
            ValidationRules.shouldNotBeBlank,
            ValidationRules.shouldNotBeNullOrUndefined
        ]
    },
};

export const choiceValidation = new Validation(additionalRules);

/**
 * Get finalized rules for validation
 * @param {Object} choice get the storedValueIndex from the choice
 * @returns {Object} the overridden rules
 */
export const getRules = ({storedValueIndex}) => {
    const overrideRules = Object.assign({}, choiceValidation.finalizedRules);
    overrideRules.storedValue = [ValidationRules.validateResourcePicker(storedValueIndex)];
    return overrideRules;
};