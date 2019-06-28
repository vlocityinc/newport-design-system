import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

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
    interviewLabel: [
        ValidationRules.maximumCharactersLimit(1000),
        ValidationRules.isValidResourcedTextArea
    ]
};

export const flowPropertiesEditorValidation = new Validation(
    additionalRules,
    true
);
export const getRules = (state, isSavingExistingFlow) => {
    const overrideRules = Object.assign(
        {},
        flowPropertiesEditorValidation.finalizedRules
    );

    if (isSavingExistingFlow) {
        overrideRules.name = [];
    }

    return overrideRules;
};
