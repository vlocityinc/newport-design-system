// @ts-nocheck
import { validateParameter } from 'builder_platform_interaction/calloutEditorLib';
import { Validation } from 'builder_platform_interaction/validation';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    inputParameters: validateParameter()
};

export const apexPluginValidation = new Validation(additionalRules);
