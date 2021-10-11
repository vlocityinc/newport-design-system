import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
const additionalRules: RuleSet = {
    collectionReference: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
};

/*
    major TODO
    Values need to be VALID not just included!  "silly" currently passes in Ferov Resoucre Picker
 */

export const collectionChoiceSetValidation = new Validation(additionalRules as RuleSet);
export const getRules = (collectionChoice, showSecondSection) => {
    const overrideRules = Object.assign({}, collectionChoiceSetValidation.finalizedRules);

    // Validating the following fields only after the second section is made visible
    if (showSecondSection) {
        overrideRules.displayField = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
        overrideRules.dataType = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
        overrideRules.valueField = [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank];
    }

    return overrideRules;
};
