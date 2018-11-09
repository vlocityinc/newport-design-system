/**
 * Library for using the flow operator rules
 *
 * @ScrumTeam Process UI Runtime
 * @author cnastasa
 * @since 214
 */

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
 * @param {param} RULE_PROPERTY.LEFT           represents the lhs of this rule (In the assignment rules, this is what something can be assigned into.)
 * @param {String} RULE_PROPERTY.OPERATOR      represents the operator of this rule
 * @param {param[]} RULE_PROPERTY.RHS_PARAMS   all rhs possible for this lhs & operator combination (In the assignment rules, this is a list of what can be assigned into the LHS.)
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
 *
 *  Example:
 *  {
 *      assignment: [rules],
 *      comparison: [rules],
 *      recordCreate: { // these are rules that had recordCreate in their includeElems list
 *          assignment: [rules],
 *          comparison: [rules],
 *      },
 *      ...
 *  }
 */

let rulesInstance = {};
let outputRules = [];

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
    SYSTEM_VARIABLE_REQUIREMENT: 'canBeSystemVariable',
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
 * See how includeElems are handled in the example of rulesInstance structure under rulesInstance typedef
 *
 * @param rule {operatorRule}   a rule with the INCLUDE_ELEMS property populated
 */
const storeRulesForIncludeElems = (rule) => {
    const ruleTypeName = rule[RULE_PROPERTY.RULE_TYPE];
    // for each element in this rule's includeElems...
    rule[RULE_PROPERTY.INCLUDE_ELEMS].forEach((elementType) => {
        // if this element doesn't have any specific rules yet, create an entry in rulesInstance
        if (!rulesInstance[elementType]) {
            rulesInstance[elementType] = {};
        }
        if (!rulesInstance[elementType][ruleTypeName]) {
            // separate the element-specific rules by ruleType
            rulesInstance[elementType][ruleTypeName] = [];
        }
        rulesInstance[elementType][ruleTypeName].push(rule);
    });
};

/**
 * Build map in the opposite way the original assignment rules are structured.
 * Meaning, the LHS will now be what is being assigned and the RHS is now a list of the places the LHS can be assigned into.
 *
 * @param rule {operatorRule}  An assignment rule that should be added to the list of output rules.
 * @param stringifiedInputsToOutputs {Object.map<param, param[]>}  Map that has been built thus far & can be added to
 * @param assignmentRulesWithExclusions {operatorRule[]} List of rules with excludeElems populated
 */
const addToStringifiedOutputRuleMap = (rule, stringifiedInputsToOutputs, assignmentRulesWithExclusions) => {
    if (rule[RULE_PROPERTY.INCLUDE_ELEMS]) {
        // this function only accounts for the EXCLUDE_ELEMS property. We don't have any instances of using INCLUDE_ELEMS yet
        throw new Error('Output rules do not handle Assignment rules which only apply to certain elements.');
    }

    if (!rule[RULE_PROPERTY.EXCLUDE_ELEMS]) {
        rule[RULE_PROPERTY.RHS_PARAMS].forEach((rhsParam) => {
            const rhs = JSON.stringify(rhsParam);
            if (!stringifiedInputsToOutputs[rhs]) {
                stringifiedInputsToOutputs[rhs] = new Set();
            }
            stringifiedInputsToOutputs[rhs].add(JSON.stringify(rule[RULE_PROPERTY.LEFT]));
        });
    } else {
        // rules that don't always apply will be treated differently
        assignmentRulesWithExclusions.push(rule);
    }
};

/**
 * @param stringifiedInputsToOutputs {Object.map<param, param[]>}  Map from a param to the list of params that can be assigned into it
 * @param assignmentRulesWithExclusions {operatorRule[]} List of rules with excludeElems populated
 */
const buildRulesInstanceForOutputRules = (stringifiedInputsToOutputs, assignmentRulesWithExclusions) => {
    // parse the stringified params & build object in the same shape as the original rules, so that the same utility functions can be applied
    Object.keys(stringifiedInputsToOutputs).forEach((assignToParam) => {
        outputRules.push({
            [RULE_PROPERTY.LEFT]: JSON.parse(assignToParam),
            [RULE_PROPERTY.OPERATOR]: RULE_OPERATOR.ASSIGN, // this can be hardcoded here because a rule would only be in this object if this were true
            [RULE_PROPERTY.RHS_PARAMS]: Array.from(stringifiedInputsToOutputs[assignToParam]).map((param) => JSON.parse(param)),
        });
    });

    assignmentRulesWithExclusions.forEach((rule) => {
        rule[RULE_PROPERTY.RHS_PARAMS].forEach((rhsParam) => {
            // create an output ("backwards") rule, that excludes the same element types as the original rule
            outputRules.push({
                [RULE_PROPERTY.LEFT]: rhsParam,
                [RULE_PROPERTY.OPERATOR]: RULE_OPERATOR.ASSIGN,
                [RULE_PROPERTY.RHS_PARAMS]: [rule[RULE_PROPERTY.LEFT]],
                [RULE_PROPERTY.EXCLUDE_ELEMS]: rule[RULE_PROPERTY.EXCLUDE_ELEMS],
            });
        });
    });
};

/**
 * Method to set the rules
 * @param {String} rules The JSON string that includes the rules returned by the services
 */
export const setRules = (rules = null) => {
    // rules are not expected to accumulate, if we're setting them we should start from scratch
    rulesInstance = {};
    outputRules = [];
    let allRules = [];
    allRules = JSON.parse(rules);
    // Create the rules instance with all rule types, where
    // RULE_TYPES looks like this: { ASSIGNMENT: 'assignment', COMPARISON: 'comparison' }
    Object.values(RULE_TYPES).forEach((ruleTypeName) => {
        rulesInstance[ruleTypeName] = [];
    });
    // Add rules to the correct buckets
    if (allRules) {
        const stringifiedInputsToOutputs = {};
        const assignmentRulesWithExclusions = [];
        allRules.forEach((rule) => {
            const ruleTypeName = rule[RULE_PROPERTY.RULE_TYPE];
            // rules come in with two fields - assignmentOperator and comparisonOperator
            // this combines those into one operator field for easier use throughout the client
            rule[RULE_PROPERTY.OPERATOR] = rule[ruleTypeName + 'Operator'].value;

            if (!rule[RULE_PROPERTY.INCLUDE_ELEMS]) {
                // add rules with no includeElems list to the main rule array for their type
                rulesInstance[ruleTypeName].push(rule);
            } else {
                storeRulesForIncludeElems(rule);
            }

            // if it's an assignment rule, store it backwards to create output rules (rules for outputs from actions, etc)
            if (rule[RULE_PROPERTY.OPERATOR] === RULE_OPERATOR.ASSIGN) {
                addToStringifiedOutputRuleMap(rule, stringifiedInputsToOutputs, assignmentRulesWithExclusions);
            }
        });
        buildRulesInstanceForOutputRules(stringifiedInputsToOutputs, assignmentRulesWithExclusions);
    }
};

/**
 * @return {rulesInstance}
 */
export const getRules = () => {
    return rulesInstance;
};

/**
 * Rules that should be used for determining where outputs from actions, subflows, etc, can be stored
 * @return {operatorRule[]}
 */
export const getOutputRules = () => {
    return outputRules;
};

/**
 * The information needed to determine the appropriate set of rules for a given context
 * @typedef {Object} contextConfig
 * @property {String} elementType    the property editor for which the rules are being retrieved
 */

export const getRulesForElementType = (ruleType, elementType) => {
    let rules = rulesInstance[ruleType];
    if (rulesInstance[elementType] && rulesInstance[elementType][ruleType]) {
        rules = rules.concat(rulesInstance[elementType][ruleType]);
    }
    return rules;
};
