/**
 * Library for using the flow operator rules
 *
 * @ScrumTeam Process UI Runtime
 * @author cnastasa
 * @since 214
 */
import { RULE_TYPES, RULE_PROPERTY } from 'builder_platform_interaction-constant';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { set } from 'builder_platform_interaction-data-mutation-lib';

/**
 * contains an instance of the rules
 */
const rulesInstance = [];

/**
 * Method to set the rules
 * @param {String} rules The JSON string that includes the rules returned by the services
 */
export const setRules = (rules = null) => {
    let allRules = [];
    allRules = JSON.parse(rules);
    // Create the rules instance with all rule types, where
    // RULE_TYPES looks like this: { ASSIGNMENT: 'assignment', COMPARISON: 'comparison' }
    Object.keys(RULE_TYPES).forEach((ruleTypeProp) => {
        const ruleTypeName = RULE_TYPES[ruleTypeProp];
        rulesInstance[ruleTypeName] = [];
    }
    );
    // Add rules to the correct buckets
    if (allRules) {
        allRules.forEach((rule) => {
            const ruleTypeName = rule[RULE_PROPERTY.RULE_TYPE];
            // rules come in with two fields - assignmentOperator and comparisonOperator
            // this combines those into one operator field for easier use throughout the client
            rulesInstance[ruleTypeName].push(set(rule, RULE_PROPERTY.OPERATOR, rule[ruleTypeName + 'Operator'].value));
        });
    }
};

export const getRules = () => {
    return rulesInstance;
};

export const getRulesForElementType = (elementType) => {
    let rules;

    switch (elementType) {
        case ELEMENT_TYPE.ASSIGNMENT:
            rules = rulesInstance[RULE_TYPES.ASSIGNMENT];
            break;
        default:
            rules = [];
    }

    return rules;
};