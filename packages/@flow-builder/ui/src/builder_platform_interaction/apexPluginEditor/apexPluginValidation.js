import { Validation } from "builder_platform_interaction/validation";
import { validateRequiredInputParameter } from "builder_platform_interaction/calloutEditorLib";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    'inputParameters': validateRequiredInputParameter(),
};

export const apexPluginValidation = new Validation(additionalRules);
