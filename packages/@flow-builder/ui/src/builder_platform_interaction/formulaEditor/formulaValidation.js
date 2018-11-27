import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
*/
const additionalRules = {
    'dataType': [ValidationRules.shouldNotBeNullOrUndefined],
    'expression' : [
        ValidationRules.maximumCharactersLimit(3900),
        ValidationRules.shouldNotBeBlank,
        ValidationRules.isValidTextWithMergeFields({ allowGlobalConstants : false }),
    ]
};

export const formulaValidation = new Validation(additionalRules);