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
 * Describes a FlowOperatorParam coming from the Rules Service
 * @typedef {Object.<string, string>} param
 * @param {String} elementType    flow element type
 * @param {String} dataType       flow data type
 * @param {boolean} isCollection  does this represent a collection variable
 */

/**
 * An operator rule
 * @typedef {Object} operatorRule
 * @param {param} RULE_PROPERTY.LEFT           represents the lhs of this rule
 * @param {String} RULE_PROPERTY.OPERATOR      represents the operator of this rule
 * @param {param[]} RULE_PROPERTY.RHS_PARAMS   all rhs possible for this lhs & operator combination
 */

/**
 * @typedef {Object} rulesInstance
 * @property {operatorRule[]} assignment                               assignment rules that can be used in any element
 * @property {operatorRule[]} comparison                               comparison rules that can be used in any element
 * @property {Object.map<ruleType, operatorRule[]>} exampleElement     Any element which appears in the includeElems list
 *                                                                     of a rule has an entry in rulesInstance with two arrays -
 *                                                                     the list of assignment rules specific to this element and
 *                                                                     the list of decision rules specific to this element.
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
    INCLUDE_ELEMS: 'includeElems',
    EXCLUDE_ELEMS: 'excludeElems',
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

// operators in rule, will be added as needed
export const RULE_OPERATOR = {
    ASSIGN: 'Assign',
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
        let rule;
        for (let i = 0; i < allRules.length; i++) {
            rule = allRules[i];
            const ruleTypeName = rule[RULE_PROPERTY.RULE_TYPE];
            // rules come in with two fields - assignmentOperator and comparisonOperator
            // this combines those into one operator field for easier use throughout the client
            const ruleWithSingleOperatorField = set(rule, RULE_PROPERTY.OPERATOR, rule[ruleTypeName + 'Operator'].value);

            const includedElems = ruleWithSingleOperatorField[RULE_PROPERTY.INCLUDE_ELEMS];
            // if a rule is specific to certain elements, don't add to the main list of rules
            if (includedElems && includedElems.length > 0) {
                // for each element in this rule's includeElems...
                let elementType;
                for (let j = 0; j < includedElems.length; j++) {
                    elementType = includedElems[j];
                    // if this element doesn't have any specific rules yet, create an entry in rulesInstance
                    if (!rulesInstance[elementType]) {
                        rulesInstance[elementType] = {};
                        rulesInstance[elementType][ruleTypeName] = []; // separate the element-specific rules by ruleType
                    } else if (!rulesInstance[elementType][ruleTypeName]) {
                        rulesInstance[elementType][ruleTypeName] = [];
                    }
                    rulesInstance[elementType][ruleTypeName].push(ruleWithSingleOperatorField);
                }
            } else {
                // add rules with no includeElems list to the main rule array for their type
                rulesInstance[ruleTypeName].push(ruleWithSingleOperatorField);
            }
        }
    }
};

export const getRules = () => {
    return rulesInstance;
};

/**
 * The information needed to determine the appropriate set of rules for a given context
 * @typedef {Object} contextConfig
 * @property {String} elementType    the property editor for which the rules are being retrieved
 */

/**
 * @param {contextConfig} config      Context information - has the shape
 *
 * @returns {Object} the rules needed for the given context
 */
export const getRulesForContext = (config) => {
    let ruleType;
    let rules;
    switch (config.elementType) {
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.RECORD_LOOKUP:
            ruleType = RULE_TYPES.COMPARISON;
            break;
        case ELEMENT_TYPE.ASSIGNMENT:
        case ELEMENT_TYPE.ACTION_CALL:
        case ELEMENT_TYPE.APEX_CALL:
        case ELEMENT_TYPE.EMAIL_ALERT:
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.LOCAL_ACTION_CALL:
        case ELEMENT_TYPE.VARIABLE:
            ruleType = RULE_TYPES.ASSIGNMENT;
            break;
        default:
            throw new Error(`Trying to get rules for unknown elementType: ${config.elementType}`);
    }
    rules = rulesInstance[ruleType];
    if (rulesInstance[config.elementType] && rulesInstance[config.elementType][ruleType]) {
        // if this element has specific rules, retrieve them here
        rules = rules.concat(rulesInstance[config.elementType][ruleType]);
    }

    return rules;
};