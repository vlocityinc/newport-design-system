import * as ValidationRules from "builder_platform_interaction/validationRules";
import { updateProperties, set, getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";

/**
 * @constant defaultRules - map of propertyName to validation rules
 * @type {Object}
 */
export const defaultRules = {
    'label' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.maximumCharactersLimit(255)
    ],
    'name' : [
        ValidationRules.shouldNotBeBlank,
        ValidationRules.shouldNotBeginOrEndWithUnderscores,
        ValidationRules.shouldNotBeginWithNumericOrSpecialCharacters,
        ValidationRules.shouldAcceptOnlyAlphanumericCharacters,
        ValidationRules.maximumCharactersLimit(80)
    ]
};

export class Validation {
    finalizedRules;

    constructor(additionalRules = defaultRules, isOverride = false) {
        this.finalizedRules = isOverride ? additionalRules : this.getMergedRules(defaultRules, additionalRules);
    }

    /**
     * @param {Object[]} guidToNameList array of objects with guid and name keys
     * @param {string} devNameToBeValidated
     * @param {string} guidToBeValidated
     * @returns {string|null} errorString or null
     */
    validateDevNameUniquenessLocally = (guidToNameList, devNameToBeValidated, guidToBeValidated) => {
        const matches = guidToNameList.filter(existingLocalValue =>
            (existingLocalValue.guid !== guidToBeValidated) &&
            (existingLocalValue.name.toLowerCase() === devNameToBeValidated.toLowerCase()));
        return matches.length > 0 ? ValidationRules.LABELS.fieldNotUnique : null;
    };
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
            if (nodeElement.hasOwnProperty(key) && nodeElement[key]) { // find out if the key exists in the top level object itself
                const nodeElementValueObject = nodeElement[key];
                if (Array.isArray(rules)) { // if there is an array of rules, evaluate it
                    const errorReturnedFromRule = this.runRulesOnData(rules, getValueFromHydratedItem(nodeElementValueObject));
                    if (errorReturnedFromRule !== null) {
                        nodeElement = updateProperties(nodeElement, {
                            [key] : { value: nodeElementValueObject.value, error: errorReturnedFromRule }
                        });
                    }
                    // if you have a function, and the value object is an array, calling that function with each object of the array should return you the array of rules for that object
                } else if (rules instanceof Function && Array.isArray(nodeElementValueObject)) {
                    for (let j = 0, len = nodeElementValueObject.length; j < len; j++) {
                        nodeElement = set(nodeElement, [key, j], this.validateAll(updateProperties(nodeElementValueObject[j]), rules(nodeElementValueObject[j])));
                    }
                } else {
                    nodeElement = set(nodeElement, [key], this.validateAll(nodeElementValueObject, rules));
                }
            }
        }
        return nodeElement;
    }
}
