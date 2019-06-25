import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    condition: ValidationRules.validateExpressionWith3Properties({
        elementType: ELEMENT_TYPE.SCREEN
    })
};

export const conditionEditorValidation = new Validation(additionalRules);
