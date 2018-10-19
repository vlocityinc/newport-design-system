import * as ValidationRules from "builder_platform_interaction/validationRules";
import { Validation } from "builder_platform_interaction/validation";
import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

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
    conditions: ValidationRules.validateExpressionWith3Properties({elementType: ELEMENT_TYPE.DECISION})
};

class DecisionValidation extends Validation {
    /**
     * @param {Object} nodeElement - node element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(nodeElement, overrideRules) {
        if (nodeElement.outcomes) {
            const outcomes = nodeElement.outcomes.map((outcome) => {
                return super.validateAll(outcome, overrideRules);
            });
            nodeElement = updateProperties(nodeElement, {outcomes});
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
    validateOutcomeNameUniquenessLocally = (state, devNameToBeValidated, currentOutcomeGuid) => {
        // Add the decision editor guid and api name to the list to check
        const allLocalValues = state.outcomes.concat([{guid: state.guid, name: state.name}]);
        const matches = allLocalValues.filter(existingLocalValue => existingLocalValue.guid !== currentOutcomeGuid && existingLocalValue.name.value.toLowerCase() === devNameToBeValidated.toLowerCase());
        return matches.length > 0 ? ValidationRules.LABELS.fieldNotUnique : null;
    };
}

export const decisionValidation = new DecisionValidation(additionalRules);