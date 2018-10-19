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
     * Method to check if an outcome devname is unique locally amongst all other outcomes.
     * @param {Object[]} allOutcomes - list of all outcome objects
     * @param {string} devNameToBeValidated - for uniqueness
     * @param {string} currentOutcomeGuid - guid of the current outcome whose devname is tested for uniquness
     * @returns {string|null} errorString or null
     */
    validateWaitEventNameUniquenessLocally = (state, devNameToBeValidated, currentWaitEventGuid) => {
        // Add the wait editor guid and api name to the list to check
        const allLocalValues = state.waitEvents.concat([{guid: state.guid, name: state.name}]);
        const matches = allLocalValues.filter(existingLocalValue => existingLocalValue.guid !== currentWaitEventGuid && existingLocalValue.name.value.toLowerCase() === devNameToBeValidated.toLowerCase());
        return matches.length > 0 ? ValidationRules.LABELS.fieldNotUnique : null;
    };
}

export const waitValidation = new WaitValidation(additionalRules);