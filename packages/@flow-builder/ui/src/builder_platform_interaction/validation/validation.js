import * as ValidationRules from 'builder_platform_interaction-validation-rules';
import { updateProperties, set } from 'builder_platform_interaction-data-mutation-lib';
import { isPlainObject } from 'builder_platform_interaction-store-lib';

/**
 * @constant defaultRules - map of propertyName to validation rules
 * @type {Object}
 */
const defaultRules = {
    'label' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeginOrEndWithEmptySpaces
    ],
    'name' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeginOrEndWithEmptySpaces,
        ValidationRules.shouldNotBeginOrEndWithUnderscores
    ]
};

export class Validation {
    finalizedRules;

    constructor(additionalRules = defaultRules, isOverride = false) {
        this.finalizedRules = isOverride ? additionalRules : this.getMergedRules(defaultRules, additionalRules);
    }

    /**
     * @param {object} existingRules - default/common rules for the fields specified
     * @param {object} additionalRules - additional element specific rules
     * @returns {object} finalRules - after merging, if additionalRules is provided
     */
    getMergedRules(existingRules, additionalRules = {}) {
        const finalRules = updateProperties(existingRules);
        const flattenedAdditionalRulesList = Object.entries(additionalRules);
        for (let i = 0, ln = flattenedAdditionalRulesList.length; i < ln; i++) {
            const [key, value] = flattenedAdditionalRulesList[i];
            if (finalRules && finalRules.hasOwnProperty(key)) {
                if (Array.isArray(value) && Array.isArray(finalRules[key])) {
                    finalRules[key] = finalRules[key].concat(value);
                } else {
                    finalRules[key] = this.getMergedRules(finalRules[key], value);
                }
            } else {
                finalRules[key] = value;
            }
        }
        return finalRules;
    }

    /**
     * @param {Array} rules - list of rules
     * @param {string} data - value on which rule is run
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    runRulesOnData(rules, data) {
        let resultFromRule = null;
        for (let i = 0, rulesLen = rules.length; i < rulesLen; i++) {
            resultFromRule = rules[i](data);
            if (resultFromRule !== null) {
                break;
            }
        }
        return resultFromRule;
    }

    /**
     * @param {string} propName - property name to be validated
     * @param {string} value - value
     * @param {string[]} overrideRules - if passed these rules will override the default rules for that specific field.
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    validateProperty(propName, value, overrideRules) {
        const rulesForField = overrideRules || this.finalizedRules[propName] || [];
        return this.runRulesOnData(rulesForField, value);
    }

    /**
     * @param {Object} nodeElement - element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(nodeElement, overrideRules) {
        const rulesForTheNodeElement = overrideRules || this.finalizedRules || [];
        const flattenedRulesForNodeElement = Object.entries(rulesForTheNodeElement);
        for (let i = 0, ln = flattenedRulesForNodeElement.length; i < ln; i++) { // Go through each rule (eg: key: label, rules: [rule1, rule2])
            const [key, rules] = flattenedRulesForNodeElement[i];
            if (nodeElement.hasOwnProperty(key)) { // find out if the key exists in the top level object itself
                const nodeElementValueObject = nodeElement[key];
                if (isPlainObject(rules)) { // if the value for the key is an object and not an array, this can happen in case of assignment items/ any list/ array
                    nodeElement = updateProperties(nodeElement, {
                        [key]: this.validateAll(nodeElementValueObject, rulesForTheNodeElement[key])
                    });
                } else if (Array.isArray(rules)) { // check needed in case of inner property rules, also this is end of recursion
                    const errorReturnedFromRule = this.runRulesOnData(rules, nodeElementValueObject.value);
                    if (errorReturnedFromRule !== null) {
                        nodeElement = updateProperties(nodeElement, {
                            [key] : { value: nodeElementValueObject.value, error: errorReturnedFromRule }
                        });
                    }
                }
            } else if (Array.isArray(nodeElement)) { // nodeElement is an array with objects, go in each object and look for key and validate
                for (let j = 0, len = nodeElement.length; j < len; j++) {
                    if (nodeElement[j].hasOwnProperty(key)) {
                        nodeElement = set(nodeElement, [j], this.validateAll(updateProperties(nodeElement[j]), rulesForTheNodeElement));
                    }
                }
            }
        }
        return nodeElement;
    }
}