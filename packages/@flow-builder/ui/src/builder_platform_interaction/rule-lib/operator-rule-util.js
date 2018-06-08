import { shallowCopyArray, getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';
import { RULE_TYPES, RULE_PROPERTY, PARAM_PROPERTY, CONSTRAINT } from './rules';

const { ASSIGNMENT, COMPARISON } = RULE_TYPES;
const { RULE_TYPE, LEFT, OPERATOR, RHS_PARAMS, EXCLUDE_ELEMS } = RULE_PROPERTY;
const { DATA_TYPE, IS_COLLECTION, ELEMENT_TYPE, CAN_BE_ELEMENTS,
    MUST_BE_ELEMENTS, PARAM_TYPE_ELEMENT, PARAM_TYPE, SOBJECT_FIELD_REQUIREMENT } = PARAM_PROPERTY;
const { CAN_BE, CANNOT_BE, MUST_BE } = CONSTRAINT;
const IS_SOBJECT_FIELD = 'isSObjectField';

/**
 * A map from an elementType or dataType to an array of params relating to that elementType or dataType.
 * @typedef {Object.<string, param[]>} allowedParamMap
 */

/**
 * Helper to get the value inside of either data type or element type. This accounts for
 * the inner value inside of the rules returned by the FlowOperatorRuleUtil service
 * Hopefully we will not need this in the future
 * @param {param} param        the param we are extracting the value from
 * @returns {String}            the value at the given property
 */
const getDataTypeOrElementType = (param) => {
    return param[DATA_TYPE] ? param[DATA_TYPE] : param[ELEMENT_TYPE];
};

/**
 * Filters rules by rule type eg: assignment/comparison
 * @param {operatorRule[]} rules     list of rules to filter
 * @param {String} ruleType the rule type you want
 * @returns {Array}         filtered list of rules based on the given rule type
 */
const filterByRuleType = (rules, ruleType) => {
    if (ruleType !== ASSIGNMENT && ruleType !== COMPARISON) {
        throw new Error(`Rule type must be either ${ASSIGNMENT} or ${COMPARISON}`);
    }
    // filter the given rules by the desired rule type
    return rules.filter((rule) => {
        return rule[RULE_TYPE] === ruleType;
    });
};

/**
 * Converts a flow element (FER) into an object similar to the rule service param objects
 * This makes it easier to compare store elements and rule params
 * This does not use the object mutation library pick method because the new object must use
 * constants specific to the rule service since the properties do not match 1->1 with the store
 * Also, we may want to extend this in the future to include properties such as 'canBeField' which
 * are not present in the store elements
 * @param {Object} element          flow element (FER) from the store
 * @returns {Object}                the new param object representing the store element
 */
export const elementToParam = (element) => {
    if (!element || Object.keys(element).length === 0) {
        throw new Error(`Element must be non empty object but instead was ${element}`);
    }
    return {
        [DATA_TYPE]: getValueFromHydratedItem(element.dataType),
        [ELEMENT_TYPE]: element.elementType,
        // the param in the rules service has 'collection' but flow elements have 'isCollection'. In some scenarios,
        // an element goes through this function twice, and on the first pass it will have 'isCollection' but on the second
        // it has 'collection', so we have to account for both options
        [IS_COLLECTION]: element.hasOwnProperty('collection') ? element.collection : element.isCollection,
        [IS_SOBJECT_FIELD]: !!element.sobjectName,
    };
};

const elementTypeAllowed = (rule, element) => {
    return (rule[MUST_BE_ELEMENTS] && rule[MUST_BE_ELEMENTS].includes(element)) ||
        (rule[CAN_BE_ELEMENTS] && rule[CAN_BE_ELEMENTS].includes(element));
};

const sObjectFieldAllowed = (rule, element) => {
    return rule[SOBJECT_FIELD_REQUIREMENT] === CAN_BE ||
        (rule[SOBJECT_FIELD_REQUIREMENT] === MUST_BE && element[IS_SOBJECT_FIELD]) ||
        (rule[SOBJECT_FIELD_REQUIREMENT] === CANNOT_BE && !element[IS_SOBJECT_FIELD]);
};

const propertyMatches = (rule, element, property) => {
    return !rule[property] || element[property] === rule[property];
};

/**
 * Check if the given rule param matches the element
 * @param {param} ruleParam        the rule param we are inspecting
 * @param {Object} element          the element we are checking to see if it matches the given rule param. This is taken from the store
 * @returns {Boolean}               true if the param matches the element, false otherwise
 */
export const isMatch = (ruleParam, element) => {
    // sanity checks
    if (!ruleParam || Object.keys(ruleParam).length === 0) {
        throw new Error(`Rule param from service must be non empty object but instead was ${ruleParam}`);
    }

    // convert the given element into the rule service param shape
    const elementParam = elementToParam(element);
    let matches = ruleParam[PARAM_TYPE] === PARAM_TYPE_ELEMENT
        || elementTypeAllowed(ruleParam, elementParam)
        || sObjectFieldAllowed(ruleParam, elementParam);

    const propertiesToCompare = [DATA_TYPE, ELEMENT_TYPE, IS_COLLECTION];
    let i = 0;
    while (matches && i < propertiesToCompare.length) {
        matches = propertyMatches(ruleParam, elementParam, propertiesToCompare[i]);
        i++;
    }

    // TODO: need to add sysVar consideration
    return matches;
};

/**
 * Get the allowed left hand side types based on the rule type
 * @param {String} elementType      elementType where this rule is being used
 * @param {operatorRule[]} rules         list of rules we are checking for lhs types. These are taken from the FlowOperatorRuleUtil service
 * @param {String} ruleType     the rule type of the given rules eg: assignment/comparator
 * @returns {allowedParamMap}   map of data types & element types to allowed left hand side types
 */
export const getLHSTypes = (elementType, rules, ruleType) => {
    if (!Array.isArray(rules)) {
        throw new Error(`Rules must be an Array but instead was ${typeof rules}`);
    }
    let allowedRules = rules;
    // if the rule type was specified then we want to filter by rule type
    if (ruleType !== undefined) {
        allowedRules = filterByRuleType(rules, ruleType);
    }
    // create our dataType/elementType map. This helps sort allowed types by dataType/elementType
    const paramTypeMap = {};
    allowedRules.forEach((rule) => {
        if ((!rule[EXCLUDE_ELEMS] || !rule[EXCLUDE_ELEMS].includes(elementType))) {
            const type = getDataTypeOrElementType(rule[LEFT]);
            // given the type, check to see if we have the key already in our map
            if (!paramTypeMap.hasOwnProperty(type)) {
                paramTypeMap[type] = new Set();
            }
            // serialize the type and add to our set to help avoid duplicates
            const serializedValue = JSON.stringify(rule[LEFT]);
            paramTypeMap[type].add(serializedValue);
        }
    });
    // now iterate through the param type map and deserialize all the values and convert the sets to arrays
    Object.keys(paramTypeMap).forEach((key) => {
        paramTypeMap[key] = Array.from(paramTypeMap[key]).map((serializedValue) => {
            return JSON.parse(serializedValue);
        });
    });
    return paramTypeMap;
};

/**
 * Gets the allowed operators based on the given left hand side element and list of rules
 * @param {String} elementType      elementType where this rule is being used
 * @param {Object} lhsElement           the element representing our left hand side that we are checking against the given rules. This element is taken from the store
 * @param {operatorRule[]} rules                 list of rules we are checking for operator types. These are taken from the FlowOperatorRuleUtil service
 * @param {String} ruleType             the rule type of the given rules eg: assignment/comparator
 * @returns {Array}                     the allowed list of operators based on rules that matched the lhsElement
 */
export const getOperators = (elementType, lhsElement = {}, rules, ruleType) => {
    // sanity checks
    if (!lhsElement || Object.keys(lhsElement).length === 0) {
        return [];
    }
    if (!Array.isArray(rules)) {
        throw new Error(`Rule must be an Array but instead was ${typeof rules}`);
    }
    let allowedRules = rules;
    // if the rule type was specified then we want to filter by rule type
    if (ruleType !== undefined) {
        allowedRules = filterByRuleType(rules, ruleType);
    }
    const reducer = (operatorSet, rule) => {
        if ((!rule[EXCLUDE_ELEMS] || !rule[EXCLUDE_ELEMS].includes(elementType)) && isMatch(rule[LEFT], lhsElement)) {
            operatorSet.add(rule[OPERATOR]);
        }
        return operatorSet;
    };
    // this set will work as our accumulator, collecting all the allowed operators
    const allowedOperatorsSet = new Set();
    allowedRules.reduce(reducer, allowedOperatorsSet);
    return Array.from(allowedOperatorsSet);
};

/**
 * The operators that come from the rule service aren't quite
 * in the format that the lightning-combobox can use, so this
 * provides the operators in the correct format
 *
 * @param {String[]} operators    the list of operators as it comes from the rule service
 * @returns {Array}               operators in the shape the combobox expects
 */
export const transformOperatorsForCombobox = (operators) => {
    // TODO: labels! W-4813532
    const operatorsForCombobox = [];
    operators.forEach((operator) => {
        operatorsForCombobox.push({
            value: operator,
            label: operator
        });
    });
    return operatorsForCombobox;
};

/**
 * Gets the allowed right hand side types based on the given left hand side element, operator, and rules
 * @param {String} elementType      elementType where this rule is being used
 * @param {Object} lhsElement       the element that represents our left hand side that we are checking against the given rules. This element is taken from the store.
 * @param {String} operator         the value representing your operator eg: "ASSIGNMENT"
 * @param {operatorRule[]} rules             list of rules we are checking for right hand side types. These are taken from the FlowOperatorRuleUtil service
 * @param {String} ruleType         the rule type of the given rules eg: assignment/comparator
 * @returns {allowedParamMap}       map of data types, element types, and object types to allowed right hand side types
 */
export const getRHSTypes = (elementType, lhsElement, operator, rules, ruleType) => {
    // sanity checks
    if (!lhsElement || Object.keys(lhsElement).length === 0) {
        return [];
    }
    if (!Array.isArray(rules)) {
        throw new Error(`Rule must be an Array but instead was ${typeof rules}`);
    }
    let allowedRules = rules;
    // if the rule type was specified then we want to filter by rule type
    if (ruleType !== undefined) {
        allowedRules = filterByRuleType(rules, ruleType);
    }

    let allowedTypes = [];
    let foundMatchingRule = false;
    let rule;
    let index = 0;
    while (!foundMatchingRule && index < allowedRules.length) {
        rule = allowedRules[index];
        if (!rule[EXCLUDE_ELEMS] || !rule[EXCLUDE_ELEMS].includes(elementType)) {
            const ruleOperator = rule[OPERATOR];
            // first check if we have the correct operator and rule
            if (ruleOperator === operator && isMatch(rule[LEFT], lhsElement)) {
                foundMatchingRule = true;
                // extract the allowed types
                allowedTypes = shallowCopyArray(rule[RHS_PARAMS]);
            }
        }
        index++;
    }
    // create our dataType/elementType/objectType map. This helps sort allowed types by dataType/elementType/objectType
    const paramTypeMap = {};
    allowedTypes.forEach((rhsParam) => {
        let type = getDataTypeOrElementType(rhsParam);
        if (type === 'SObject') {
            // if element is an sObject, we want to track by object type because sObject type must match exactly
            type = lhsElement.objectType;
        }
        // to remain consistent with getLHSTypes we place the rhsParam in an array
        // TODO: find out if we only get either scalar or a collection of a type ex: number vs number collection. If so, we can remove this check and simply assign an array with rhsParam
        if (!paramTypeMap.hasOwnProperty(type)) {
            paramTypeMap[type] = [];
        }
        paramTypeMap[type].push(rhsParam);
    });
    return paramTypeMap;
};