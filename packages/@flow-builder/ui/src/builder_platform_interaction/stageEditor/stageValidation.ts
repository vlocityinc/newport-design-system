// @ts-nocheck
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    stageOrder: [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeAPositiveIntegerOrZero,
        ValidationRules.shouldBeUnderMaxValue(99999999)
    ]
};

export const stageValidation = new Validation(additionalRules);
