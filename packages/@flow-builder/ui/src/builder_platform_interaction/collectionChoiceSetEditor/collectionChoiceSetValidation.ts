import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

/**
 * Rules used in addition to defaultRules in Validation
 *
 * @returns rules to merge with default rules in Validation constructor
 */
const additionalRules = (): RuleSet => {
    return {
        collectionReference: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined]
    };
};

export const collectionChoiceSetValidation = () => {
    return new Validation(additionalRules());
};

export const validate = (state, showSecondSection) => {
    return collectionChoiceSetValidation().validateAll(state, getRules(state, showSecondSection));
};

export const getRules = (collectionChoice, showSecondSection) => {
    const overrideRules = Object.assign({}, collectionChoiceSetValidation().finalizedRules);

    overrideRules.collectionReference.push(
        ValidationRules.validateResourcePicker(collectionChoice.collectionReference)
    );

    // Validating the following fields only after the second section is made visible
    if (showSecondSection) {
        overrideRules.displayField = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
        overrideRules.dataType = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
        overrideRules.valueField = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
    }

    return overrideRules;
};
