import { Validation } from "builder_platform_interaction/validation";
import { validateParameter } from "builder_platform_interaction/calloutEditorLib";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    'inputAssignments': validateParameter(),
    'outputAssignments': validateParameter()
};

export const subflowValidation = new Validation(additionalRules);