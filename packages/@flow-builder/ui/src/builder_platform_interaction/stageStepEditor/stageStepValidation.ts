import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { validateParameter } from 'builder_platform_interaction/calloutEditorLib';

const validateActionName = () => {
    return {
        actionName: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
    };
};

const assigneeValidation = () => {
    return {
        assignee: [
            (value) => ValidationRules.shouldNotBeNullOrUndefined(value),
            (value) => ValidationRules.shouldNotBeBlank(value)
        ]
    };
};

const relatedRecordItemValueShouldNotBeBlank = (relatedRecordParameterItem) => {
    return (
        ValidationRules.shouldNotBeNullOrUndefined(relatedRecordParameterItem.value) ||
        ValidationRules.shouldNotBeNullOrUndefined(relatedRecordParameterItem.value.value) ||
        ValidationRules.shouldNotBeBlank(relatedRecordParameterItem.value.value)
    );
};

const additionalRules = {
    label: [ValidationRules.shouldNotBeNullOrUndefined],
    name: [ValidationRules.shouldNotBeNullOrUndefined],
    assignees: assigneeValidation,
    entryActionInputParameters: validateParameter(),
    action: validateActionName(),
    inputParameters: validateParameter(),
    relatedRecordItem: [relatedRecordItemValueShouldNotBeBlank],
    exitActionInputParameters: validateParameter()
};

export const stageStepValidation = new Validation(additionalRules);

/**
 * Get finalized rules for validation
 *
 * @returns {Object} the overridden rules
 */
export const getRules = (): object => {
    return Object.assign({}, stageStepValidation.finalizedRules);
};
