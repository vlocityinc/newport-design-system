import { Validation } from 'builder_platform_interaction/validation';
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
class ScheduledPathsValidation extends Validation {
    /**
     * @param {Object} nodeElement - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(nodeElement, overrideRules) {
        if (nodeElement.scheduledPaths) {
            const scheduledPaths = nodeElement.scheduledPaths.map((scheduledPath) => {
                return super.validateAll(scheduledPath, overrideRules);
            });
            nodeElement = updateProperties(nodeElement, { scheduledPaths });
        }
        return super.validateAll(nodeElement, overrideRules);
    }

    /**
     * Method to check if devname is unique locally amongst all other scheduled path.
     * @param state - overall state of decision node
     * @param devNameToBeValidate - for uniqueness
     * @param currentScheduledPathGuid - guid of the current outcome whose devname is tested for uniquness
     * @returns errorString or null
     */
    validateScheduledPathNameUniquenessLocally = (
        state,
        devNameToBeValidate: string,
        currentScheduledPathGuid: UI.Guid
    ): string | null => {
        const scheduledPathssDevNameToGuidList = state.scheduledPaths.map((scheduledPath) => {
            return {
                guid: scheduledPath.guid,
                name: scheduledPath.name.value
            };
        });
        return this.validateDevNameUniquenessLocally(
            scheduledPathssDevNameToGuidList,
            devNameToBeValidate,
            currentScheduledPathGuid
        );
    };
}

// @ts-ignore
export const scheduledPathsValidation = new ScheduledPathsValidation(additionalRules);
