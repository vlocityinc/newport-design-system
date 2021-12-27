// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

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
