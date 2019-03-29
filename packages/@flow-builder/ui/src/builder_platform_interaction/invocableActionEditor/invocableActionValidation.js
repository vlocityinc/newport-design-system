import { Validation } from "builder_platform_interaction/validation";
import { validateParameter } from "builder_platform_interaction/calloutEditorLib";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    'inputParameters': validateParameter(),
    'outputParameters': validateParameter()
};

export const invocableActionValidation = new Validation(additionalRules);
