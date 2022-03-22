import { validateParameter } from 'builder_platform_interaction/calloutEditorLib';
import { isUndefined } from 'builder_platform_interaction/commonUtils';
import { ValueWithError } from 'builder_platform_interaction/dataMutationLib';
import { StageStep } from 'builder_platform_interaction/elementFactory';
import { ACTION_TYPE, EntryCriteria, ExitCriteria } from 'builder_platform_interaction/flowMetadata';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const validateActionName = () => {
    return {
        actionName: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
    };
};

const relatedRecordItemValueShouldNotBeBlank = (relatedRecordParameterItem) => {
    // if the value is double nested then validate the double nested value
    const valueToValidate = !isUndefined(relatedRecordParameterItem?.value?.value)
        ? relatedRecordParameterItem?.value?.value
        : relatedRecordParameterItem?.value;

    return (
        ValidationRules.shouldNotBeNullOrUndefined(valueToValidate) || ValidationRules.shouldNotBeBlank(valueToValidate)
    );
};

const additionalRules = {
    label: [ValidationRules.shouldNotBeNullOrUndefined],
    name: [ValidationRules.shouldNotBeNullOrUndefined],
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
 * @param assigneePickerGuid guid that identifies the assignee reference resource picker
 * @param relatedRecordPickerGuid guid that identifies the related record resource picker
 * @returns {Object} the overridden rules
 */
export const getRules = (state: StageStep, assigneePickerGuid: string, relatedRecordPickerGuid: string): object => {
    const rules = Object.assign({}, stageStepValidation.finalizedRules);
    if (
        state?.action?.actionType === ACTION_TYPE.STEP_INTERACTIVE ||
        state?.action?.actionType?.value === ACTION_TYPE.STEP_INTERACTIVE
    ) {
        rules.relatedRecordItem = [
            relatedRecordItemValueShouldNotBeBlank,
            ValidationRules.validateResourcePicker(relatedRecordPickerGuid)
        ];

        rules.assignees = () => {
            const assigneeRules = [
                (value) => ValidationRules.shouldNotBeNullOrUndefined(value),
                (value) => ValidationRules.shouldNotBeBlank(value)
            ];

            if (state?.assignees[0]?.isReference) {
                assigneeRules.push(ValidationRules.validateResourcePicker(assigneePickerGuid));
            }
            return {
                assignee: assigneeRules
            };
        };
    }

    if ((state.entryCriteria as ValueWithError)?.value === EntryCriteria.ON_DETERMINATION_COMPLETE) {
        rules.entryAction = validateActionName();
    }

    if ((state.exitCriteria as ValueWithError)?.value === ExitCriteria.ON_DETERMINATION_COMPLETE) {
        rules.exitAction = validateActionName();
    }

    return rules;
};
