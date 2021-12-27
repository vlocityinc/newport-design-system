// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    label: [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.maximumCharactersLimit(255)
    ],
    name: [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeNullOrUndefined,
        ValidationRules.shouldNotBeginOrEndWithUnderscores,
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
    interviewLabel: [ValidationRules.maximumCharactersLimit(1000), ValidationRules.isValidResourcedTextArea],
    triggerOrder: [ValidationRules.shouldBeInRange(1, 2000)]
};

export const flowPropertiesEditorValidation = new Validation(additionalRules, true);
export const getRules = (state, isSavingExistingFlow) => {
    const overrideRules = Object.assign({}, flowPropertiesEditorValidation.finalizedRules);

    if (isSavingExistingFlow) {
        overrideRules.name = [];
    }

    return overrideRules;
};
