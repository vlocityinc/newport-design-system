import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    label: [
        ValidationRules.shouldAcceptOnlyAlphanumericOrSpecialCharacters,
        ValidationRules.maximumCharactersLimit(255)
    ],
    name: [
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ],
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
}

export const decisionValidation = new DecisionValidation(additionalRules);