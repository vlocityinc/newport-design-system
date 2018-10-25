import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { CONDITION_LOGIC } from "builder_platform_interaction/flowMetadata";

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    defaultConnectorLabel: [
        ValidationRules.shouldNotBeBlank
    ],
    conditionLogic: [
        ValidationRules.shouldNotBeBlank
    ],
};

const conditionRule = {
    conditions: ValidationRules.validateExpressionWith3Properties({elementType: ELEMENT_TYPE.WAIT})
};

class WaitValidation extends Validation {
    /**
     * @param {Object} nodeElement - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(nodeElement, overrideRules) {
        if (nodeElement.waitEvents) {
            const waitEvents = nodeElement.waitEvents.map((waitEvent) => {
                if (waitEvent.conditionLogic.value !== CONDITION_LOGIC.NO_CONDITIONS) {
                    // Make sure to validate conditions in cases other than 'Always Wait'
                    overrideRules = Object.assign(overrideRules = {}, this.finalizedRules, conditionRule);
                }
                return super.validateAll(waitEvent, overrideRules);
            });
            nodeElement = updateProperties(nodeElement, {waitEvents});
        }
        return super.validateAll(nodeElement, overrideRules);
    }

    /**
     * Method to check if devname is unique locally amongst all other waitevents and parent wait node state.
     * @param {Object} state -  overall state of wait node
     * @param {string} devNameToBeValidated - for uniqueness
     * @param {string} currentWaitEventGuid - guid of the current waitevent whose devname is tested for uniquness
     * @returns {string|null} errorString or null
     */
    validateWaitEventNameUniquenessLocally = (state, devNameToBeValidated, currentWaitEventGuid) => {
        const stateGuidToDevName = [{
            guid: state.guid,
            name: state.name.value
        }];
        const waitEventsDevNameToGuidList = state.waitEvents.map(waitEvent => {
            return {
                guid: waitEvent.guid,
                name: waitEvent.name.value,
            };
        });
        const finalListOfGuidToDevNames = stateGuidToDevName.concat(waitEventsDevNameToGuidList);
        return this.validateDevNameUniquenessLocally(finalListOfGuidToDevNames, devNameToBeValidated, currentWaitEventGuid);
    };
}

export const waitValidation = new WaitValidation(additionalRules);