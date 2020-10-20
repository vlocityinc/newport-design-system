import { Validation } from 'builder_platform_interaction/validation';
import { Guid } from 'builder_platform_interaction/flowModel';

class TimeTriggersValidation extends Validation {
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
        const stateGuidToDevName = [
            {
                guid: state.guid,
                name: state.name.value
            }
        ];
        const timeTriggerssDevNameToGuidList = state.timeTriggers.map((timeTrigger) => {
            return {
                guid: timeTrigger.guid,
                name: timeTrigger.name.value
            };
        });
        const finalListOfGuidToDevNames = stateGuidToDevName.concat(timeTriggerssDevNameToGuidList);
        return this.validateDevNameUniquenessLocally(
            finalListOfGuidToDevNames,
            devNameToBeValidate,
            currentTimeTriggerGuid
        );
    };
}

export const timeTriggersValidation = new TimeTriggersValidation();
