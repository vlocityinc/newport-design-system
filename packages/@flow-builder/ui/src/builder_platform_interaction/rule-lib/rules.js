/**
 * Library for using the flow operator rules
 *
 * @ScrumTeam Process UI Runtime
 * @author cnastasa
 * @since 214
 */
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { set } from 'builder_platform_interaction-data-mutation-lib';

/**
 * Describes a FlowOperatorParam coming from the Rules Service
 * @typedef {Object.<string, string>}  param
 * @param {String} paramType           either 'element' or 'data', only elementType or dataType is populated in any param
 * @param {String} elementType         flow element type
 * @param {String} dataType            flow data type
 * @param {boolean} isCollection       does this represent a collection variable
 *
 * the below properties are only used if the paramType is 'data'
 * @param {String[]} mustBeElements    this param can only be used to describe an element included in this list
 * @param {String[]} cannotBeElements  this param cannot be used to describe elements in this list
 * @param {String[]} canBeElements     this param can be used to describe elements in this list
 */

/**
 * An operator rule
 * @typedef {Object} operatorRule
 * @param {param} RULE_PROPERTY.LEFT           represents the lhs of this rule
 * @param {String} RULE_PROPERTY.OPERATOR      represents the operator of this rule
 * @param {param[]} RULE_PROPERTY.RHS_PARAMS   all rhs possible for this lhs & operator combination
 * @param {String[]} includeElems              this rule should ONLY be used in the elements listed here
 * @param {String[]} excludeElems              this rule should be used in all elements EXCEPT those listed here
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

const rulesInstance = {};
const outputRules = [];

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

// the properties in an operator param ( rule.left )
export const PARAM_PROPERTY = {
    PARAM_TYPE: 'paramType',
    PARAM_TYPE_ELEMENT: 'Element',
    PARAM_INDEX: 'paramIndex',
    DATA_TYPE: 'dataType',
    IS_COLLECTION: 'collection',
    CAN_BE_FIELD: 'canBeField',
    CAN_BE_SYS_VAR: 'canBeSysVar',
    ELEMENT_TYPE: 'elementType',
    CAN_BE_ELEMENTS: 'canBeElements',
    CANNOT_BE_ELEMENTS: 'cannotBeElements',
    MUST_BE_ELEMENTS: 'mustBeElements',
    SOBJECT_FIELD_REQUIREMENT: 'canBeSobjectField',
};

export const CONSTRAINT = {
    CAN_BE: 'CanBe',
    CANNOT_BE: 'CannotBe',
    MUST_BE: 'MustBe',
};

// operators in rule, will be added as needed
export const RULE_OPERATOR = {
    ASSIGN: 'Assign',
    EQUAL_TO: 'EqualTo',
    ADD: 'Add',
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
        const stringifiedoutputRules = {};
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

            // if it's an assignment rule, store it backwards to create output rules (rules for outputs from actions, etc)
            if (ruleWithSingleOperatorField[RULE_PROPERTY.OPERATOR] === RULE_OPERATOR.ASSIGN) {
                if (rule[RULE_PROPERTY.INCLUDE_ELEMS] || rule[RULE_PROPERTY.EXCLUDE_ELEMS]) {
                    // right now there are no cases where an assignment rule only applies sometimes so this function doesn't account for it
                    throw new Error('Rule processing does not handle Assignment rules which only apply to certain elements.');
                }

                // these describe what can be assigned into the LHS
                const RHSparams = rule[RULE_PROPERTY.RHS_PARAMS];

                // store the rules with one rhs pointing to multiple lhs params
                for (let k = 0; k < RHSparams.length; k++) {
                    const RHS = JSON.stringify(RHSparams[k]);
                    if (!stringifiedoutputRules[RHS]) {
                        stringifiedoutputRules[RHS] = new Set();
                    }
                    stringifiedoutputRules[RHS].add(rule[RULE_PROPERTY.LEFT]);
                }
            }
        }

        // parse the stringified params & build object in the same shape as the original rules, so that the same utility functions can be applied
        const allRHS = Object.keys(stringifiedoutputRules);
        for (let i = 0; i < allRHS.length; i++) {
            const assignFrom = JSON.parse(allRHS[i]);
            const assignTo = [];

            stringifiedoutputRules[allRHS[i]].forEach((param) => {
                assignTo.push(param);
            });

            const newRule = {};
            newRule[RULE_PROPERTY.LEFT] = assignFrom;
            // this can be hardcoded here because a rule would only be in this object if this were true
            newRule[RULE_PROPERTY.OPERATOR] = RULE_OPERATOR.ASSIGN;
            newRule[RULE_PROPERTY.RHS_PARAMS] = assignTo;
            outputRules.push(newRule);
        }
    }
};

export const getRules = () => {
    return rulesInstance;
};

export const getOutputRules = () => {
    return outputRules;
};

/**
 * The information needed to determine the appropriate set of rules for a given context
 * @typedef {Object} contextConfig
 * @property {String} elementType    the property editor for which the rules are being retrieved
 */

const getRulesForElementType = (ruleType, elementType) => {
    let rules = rulesInstance[ruleType];
    if (rulesInstance[elementType] && rulesInstance[elementType][ruleType]) {
        rules = rules.concat(rulesInstance[elementType][ruleType]);
    }
    return rules;
};

/**
 * @param {contextConfig} config      Context information - has the shape
 *
 * @returns {Object} the rules needed for the given context
 */
export const getRulesForContext = (config) => {
    let rules;
    switch (config.elementType) {
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.RECORD_LOOKUP:
            rules = getRulesForElementType(RULE_TYPES.COMPARISON, config.elementType);
            break;
        case ELEMENT_TYPE.ASSIGNMENT:
        case ELEMENT_TYPE.LOOP:
        case ELEMENT_TYPE.ACTION_CALL:
        case ELEMENT_TYPE.APEX_CALL:
        case ELEMENT_TYPE.EMAIL_ALERT:
        case ELEMENT_TYPE.APEX_PLUGIN_CALL:
        case ELEMENT_TYPE.SUBFLOW:
        case ELEMENT_TYPE.LOCAL_ACTION_CALL:
        case ELEMENT_TYPE.VARIABLE:
        case ELEMENT_TYPE.CONSTANT:
        case ELEMENT_TYPE.FORMULA:
        case ELEMENT_TYPE.SCREEN:
            rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, config.elementType);
            break;
        // TODO example for output/backwards rules
        // case ELEMENT_TYPE.ACTION_CALL: rules = outputRules;
        default:
            throw new Error(`Trying to get rules for unknown elementType: ${config.elementType}`);
    }

    return rules;
};