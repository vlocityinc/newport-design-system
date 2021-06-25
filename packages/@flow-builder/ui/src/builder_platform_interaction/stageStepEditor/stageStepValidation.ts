import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { validateParameter } from 'builder_platform_interaction/calloutEditorLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { lhsShouldBeValid, rhsShouldBeValid, shouldNotBeBlank } from 'builder_platform_interaction/validationRules';

const validateActionName = () => {
    return {
        actionName: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
    };
};

const assigneeShouldNotBeBlank = () => {
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
    assignees: assigneeShouldNotBeBlank,
    entryAction: validateActionName(),
    entryActionInputParameters: validateParameter(),
    action: validateActionName(),
    inputParameters: validateParameter(),
    relatedRecordItem: [relatedRecordItemValueShouldNotBeBlank],
    exitAction: validateActionName(),
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
