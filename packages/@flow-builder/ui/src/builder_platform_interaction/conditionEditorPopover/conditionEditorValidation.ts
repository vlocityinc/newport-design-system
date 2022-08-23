import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * @constant additionalRules - map of propertyName to validation rules
 */
const additionalRules = {
    condition: ValidationRules.validateExpressionWith3Properties()
};

export const conditionEditorValidation = new Validation(additionalRules);
