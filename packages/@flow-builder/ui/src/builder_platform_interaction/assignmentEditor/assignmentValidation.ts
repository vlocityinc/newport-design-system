// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    assignmentItems: ValidationRules.validateExpressionWith3Properties({
        elementType: ELEMENT_TYPE.ASSIGNMENT
    })
};

export const assignmentValidation = new Validation(additionalRules);
