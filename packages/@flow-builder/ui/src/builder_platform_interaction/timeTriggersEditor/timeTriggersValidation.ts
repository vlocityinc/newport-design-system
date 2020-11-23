import { Validation } from 'builder_platform_interaction/validation';
import { Guid } from 'builder_platform_interaction/uiModel';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
export const additionalRules = {
    offsetUnit: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined],
    timeSource: [ValidationRules.shouldNotBeBlank, ValidationRules.shouldNotBeNullOrUndefined],
    offsetNumber: [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldBeANumber,
        ValidationRules.shouldBeAPositiveIntegerOrZero
    ],
    label: [ValidationRules.shouldNotBeBlank],
    name: [ValidationRules.shouldNotBeBlank]
};
class TimeTriggersValidation extends Validation {
    /**
     * @param {Object} nodeElement - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(nodeElement, overrideRules) {
        if (nodeElement.timeTriggers) {
            const timeTriggers = nodeElement.timeTriggers.map((timeTrigger) => {
                return super.validateAll(timeTrigger, overrideRules);
            });
            nodeElement = updateProperties(nodeElement, { timeTriggers });
        }
        return super.validateAll(nodeElement, overrideRules);
    }

    /**
     * Method to check if devname is unique locally amongst all other time trigger.
     * @param state - overall state of decision node
     * @param devNameToBeValidate - for uniqueness
     * @param currentTimeTriggerGuid - guid of the current outcome whose devname is tested for uniquness
     * @returns errorString or null
     */
    validateTimeTriggerNameUniquenessLocally = (
        state,
        devNameToBeValidate: string,
        currentTimeTriggerGuid: Guid
    ): string | null => {
        const timeTriggerssDevNameToGuidList = state.timeTriggers.map((timeTrigger) => {
            return {
                guid: timeTrigger.guid,
                name: timeTrigger.name.value
            };
        });
        return this.validateDevNameUniquenessLocally(
            timeTriggerssDevNameToGuidList,
            devNameToBeValidate,
            currentTimeTriggerGuid
        );
    };
}

// @ts-ignore
export const timeTriggersValidation = new TimeTriggersValidation(additionalRules);
