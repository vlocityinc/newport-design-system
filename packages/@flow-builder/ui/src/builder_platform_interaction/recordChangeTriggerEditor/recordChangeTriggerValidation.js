import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const addtionalRules = {
    triggerType: [ValidationRules.shouldNotBeBlank],
    recordTriggerType: [ValidationRules.shouldNotBeBlank]
};

export const recordChangeTriggerValidation = new Validation(addtionalRules, true);
