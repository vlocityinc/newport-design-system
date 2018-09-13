import * as ValidationRules from "builder_platform_interaction/validationRules";
import { updateProperties, set, getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";

/**
 * @constant defaultRules - map of propertyName to validation rules
 * @type {Object}
 */
const defaultRules = {
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

const ATTRIBUTE_VALUE_MATCHER_REGEX = /(.*)=["'](.*)["']/g;

class AttributeMatcher {
    property;
    value;

    constructor(pattern) {
        const result = ATTRIBUTE_VALUE_MATCHER_REGEX.exec(pattern);
        ATTRIBUTE_VALUE_MATCHER_REGEX.lastIndex = 0;

        if (result) { // attribute=value matcher
            this.property = result[1].split('.');
            this.value = result[2];
        } else {
            this.property = pattern.split('.');
        }
    }

    matches(value) {
        let currObject = value;
        for (const term of this.property) {
            if (currObject.hasOwnProperty(term)) {
                currObject = currObject[term];
            } else {
                return false;
            }
        }

        return this.value ? currObject === this.value : currObject !== undefined;
    }

    getValue(element) {
        if (!this.value) {
            let currObject = element;
            for (const term of this.property) {
                if (currObject && currObject.hasOwnProperty(term)) {
                    currObject = currObject[term];
                }
            }
            return currObject;
        }

        return element;
    }
}

export class Validation {
    finalizedRules;

    constructor(additionalRules = defaultRules, isOverride = false) {
        this.finalizedRules = this.compile(isOverride ? additionalRules : this.getMergedRules(additionalRules, defaultRules));
    }

    /**
     * Compiles the rules object into a validation object
     * @param {array} rules - The rules object
     * @param {boolean} appendDefaultRules - should default rules be added when not present.
     * @returns {array} - The compiled rules
     */
    compile(rules, appendDefaultRules) {
        const allRules = {};
        for (const name in rules) {
            if (rules.hasOwnProperty(name)) {
                const propertyRules = rules[name];
                if (Array.isArray(propertyRules)) {
                    allRules[name] = {
                        matcher: new AttributeMatcher(name),
                        type: 'array',
                        rules: propertyRules
                    };
                } else if (propertyRules instanceof Function) {
                    allRules[name] = {
                        matcher: new AttributeMatcher(name),
                        type: 'function',
                        rules: propertyRules
                    };
                } else if (propertyRules instanceof Object) { // Another set of rules, create a validation object for the field
                    allRules[name] = {
                        matcher: new AttributeMatcher(name),
                        type: 'validation',
                        rules: new Validation(propertyRules, appendDefaultRules)
                    };
                }
            }
        }

        return allRules;
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
     * Pushes all the terms in expression into the terms array.
     * @param {Array} terms - the terms array
     * @param {string} expression - the expression to evaluate, either 'propname' or 'propname[att='value']
     */
    pushTerms(terms, expression) {
        const regexComplexProperty = /^([^[]*)(?:\[(.*)\])?/g;
        const groups = regexComplexProperty.exec(expression);
        terms.push(groups[1]);
        if (groups.length === 3 && groups[2]) {
            terms.push(groups[2]);
        }
        regexComplexProperty.lastIndex = 0;
    }

    /**
     * Returns the rules to apply for the given property name.
     * @param {string} propName - the propName (can be just a propname like 'name' or a more complex path like 'fields[type='NUMBER'].scale'
     * @param {array} overrideRules - Rules to be used instead of the ones stored in this validation object
     * @returns {array} - The validation rules to apply based on the property name or overrideRules if present
     */
    getRulesForProperty(propName, overrideRules) {
        if (overrideRules) {
            return overrideRules;
        }

        const regexSplitByPeriodNotInBrackets = /\.(?=[^\]]*(?:\[|$))/g;
        const terms = [];
        let lastIndex = 0;
        while (regexSplitByPeriodNotInBrackets.exec(propName)) { // split by period not in brackets
            const term = propName.substring(lastIndex, regexSplitByPeriodNotInBrackets.lastIndex - 1);
            this.pushTerms(terms, term);
            lastIndex = regexSplitByPeriodNotInBrackets.lastIndex;
        }

        this.pushTerms(terms, propName.substring(lastIndex));

        let currentRules = this.finalizedRules;
        for (const term of terms) {
            if (currentRules.hasOwnProperty(term)) {
                if (currentRules[term].rules) {
                    if (currentRules[term].rules.finalizedRules) {
                        currentRules = currentRules[term].rules.finalizedRules;
                    } else {
                        currentRules = currentRules[term].rules;
                    }
                } else {
                    currentRules = currentRules[term];
                }
            } else {
                break;
            }
        }

        return currentRules || [];
    }

    /**
     * @param {string} propName - property name to be validated
     * @param {string} value - value
     * @param {string[]} overrideRules - if passed these rules will override the default rules for that specific field.
     * @returns {string|null} error - error string or null based on if the field value is valid or not
     */
    validateProperty(propName, value, overrideRules) {
        const rulesForField = this.getRulesForProperty(propName, overrideRules);
        return this.runRulesOnData(rulesForField, value);
    }

    /**
     * @param {Object} nodeElement - element data passed as an object.
     * @param {Object} overrideRules - if passed, will override the default rules.
     * @param {Array} path - The path from the root element to the element being validated
     * @returns {Object} nodeElement - updated Node element after all the rules are run on respective data values.
     */
    validateAll(nodeElement, overrideRules, path = []) {
        path.push(nodeElement);
        const rulesForTheNodeElement = overrideRules || this.finalizedRules || [];
        const flattenedRulesForNodeElement = Object.entries(rulesForTheNodeElement);
        for (let i = 0, ln = flattenedRulesForNodeElement.length; i < ln; i++) { // Go through each rule (eg: key: label, rules: [rule1, rule2])
            const [key, ruleConfig] = flattenedRulesForNodeElement[i];

            // Function validation uses an array of rules instead of a ruleConfig with a matcher
            if ((ruleConfig.matcher && ruleConfig.matcher.matches(nodeElement)) || nodeElement[key]) { // find out if the key exists in the top level object itself
                const nodeElementValueObject = (ruleConfig.matcher && ruleConfig.matcher.getValue(nodeElement)) || nodeElement[key];
                const rules = ruleConfig.rules ? ruleConfig.rules : ruleConfig;

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
                        const currentElement = updateProperties(nodeElementValueObject[j]);
                        const currentRules = rules(nodeElementValueObject[j], path);
                        nodeElement = set(nodeElement, [key, j], this.validateAll(currentElement, currentRules, path));
                    }
                } else if (ruleConfig.type === 'validation') { // A full set of validation rules for the property
                    if (Array.isArray(nodeElementValueObject)) {
                        for (let j = 0, len = nodeElementValueObject.length; j < len; j++) {
                            nodeElement = set(nodeElement, [key, j], ruleConfig.rules.validateAll(nodeElementValueObject[j], null, path));
                        }
                    } else {
                        nodeElement = ruleConfig.rules.validateAll(nodeElementValueObject, null, path);
                    }
                }

                // we may need a fourth case here, for non-array objects within objects
            }
        }
        path.pop();
        return nodeElement;
    }
}