/**
 * Library for using the flow operator rules
 *
 * @ScrumTeam Process UI Runtime
 * @author cnastasa
 * @since 214
 */
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { set } from 'builder_platform_interaction-data-mutation-lib';

/**
 * contains an instance of the rules
 */
const rulesInstance = [];

export const RULE_TYPES = {
    ASSIGNMENT: 'assignment',
    COMPARISON: 'comparison',
};

// the top level properties in a rule
export const RULE_PROPERTY = {
    RULE_TYPE: 'ruleType',
    LEFT: 'left',
    OPERATOR: 'operator',
    RHS_PARAMS: 'rhsParams',
};

// the inner properties in a rule ( rule.left )
export const RULE_PROPERTY_INFO = {
    PARAM_TYPE: 'paramType',
    PARAM_INDEX: 'paramIndex',
    DATA_TYPE: 'dataType',
    IS_COLLECTION: 'collection',
    CAN_BE_FIELD: 'canBeField',
    CAN_BE_SYS_VAR: 'canBeSysVar',
    ELEMENT_TYPE: 'elementType',
};

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
        case ELEMENT_TYPE.DECISION:
            rules = rulesInstance[RULE_TYPES.COMPARISON];
            break;
        case ELEMENT_TYPE.ASSIGNMENT:
        case ELEMENT_TYPE.ACTION_CALL:
        case ELEMENT_TYPE.APEX_CALL:
        case ELEMENT_TYPE.EMAIL_ALERT:
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
            rules = rulesInstance[RULE_TYPES.ASSIGNMENT];
            break;
        default:
            throw new Error(`Trying to get rules for unknown elementType: ${elementType}`);
    }

    return rules;
};