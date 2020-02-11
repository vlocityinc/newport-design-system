import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const addtionalRules = {
    startDate: [ValidationRules.shouldNotBeBlank],
    startTime: [ValidationRules.shouldNotBeBlank],
    frequency: [ValidationRules.shouldNotBeBlank]
};

export const scheduleTriggerValidation = new Validation(addtionalRules, true);
