import * as ValidationRules from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import { validateParameter } from 'builder_platform_interaction/calloutEditorLib';
import { StageStep } from 'builder_platform_interaction/elementFactory';
import { ACTION_TYPE, EntryCriteria, ExitCriteria } from 'builder_platform_interaction/flowMetadata';
import { ValueWithError } from 'builder_platform_interaction/dataMutationLib';

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
    exitActionInputParameters: validateParameter()
};

export const stageStepValidation = new Validation(additionalRules);

/**
 * Get finalized rules for validation
 *
 * @param state
 * @returns {Object} the overridden rules
 */
export const getRules = (state: StageStep): object => {
    const rules = Object.assign({}, stageStepValidation.finalizedRules);

    if (
        state?.action?.actionType === ACTION_TYPE.STEP_INTERACTIVE ||
        state?.action?.actionType?.value === ACTION_TYPE.STEP_INTERACTIVE
    ) {
        rules.relatedRecordItem = [relatedRecordItemValueShouldNotBeBlank];
    }

    if ((state.entryCriteria as ValueWithError)?.value === EntryCriteria.ON_DETERMINATION_COMPLETE) {
        rules.entryAction = validateActionName();
    }

    if ((state.exitCriteria as ValueWithError)?.value === ExitCriteria.ON_DETERMINATION_COMPLETE) {
        rules.exitAction = validateActionName();
    }

    return rules;
};
