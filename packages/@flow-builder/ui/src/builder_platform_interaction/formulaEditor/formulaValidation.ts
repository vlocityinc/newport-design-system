// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    dataType: [ValidationRules.shouldNotBeNullOrUndefined],
    expression: [
        ValidationRules.maximumCharactersLimit(3900),
        ValidationRules.shouldNotBeBlank,
        ValidationRules.isValidFormulaExpression
    ]
};

export const formulaValidation = new Validation(additionalRules);
