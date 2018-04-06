// import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { Validation } from 'builder_platform_interaction-validation';

// TODO copied from assignment-validation, needs to be refactored and filled out


/**
 * @constant additionalRules - map of propertyName to validation rules
 * @type {Object}
 */
const additionalRules = {
    // Example rules : actual rules will be put in after spike
    // TODO: Fix for Avinash's refactoring
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004uM2RIAU/view
    // 'label' : [ValidationRules.shouldNotBeMoreThan256Chars],
    // 'name': [ValidationRules.shouldNotBeEmpty]
    'label' : [],
    'name': [],
};

class DecisionValidation extends Validation {
    /**
     * @param {string} propName - property name to be validated
     * @param {string} value - value
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    validateProperty(propName, value) {
        return super.validateProperty(propName, value, additionalRules[propName]);
    }
}
export const decisionValidation = new DecisionValidation();

