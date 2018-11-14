import { getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { isUndefinedOrNull, isUndefined } from "builder_platform_interaction/commonUtils";
import { RULE_TYPES, RULE_PROPERTY, PARAM_PROPERTY, CONSTRAINT } from './rules';
import { ruleElementTypeToUIElementType } from "builder_platform_interaction/flowMetadata";
import systemVariableCategory from '@salesforce/label/FlowBuilderSystemVariables.systemVariableCategory';

const { ASSIGNMENT, COMPARISON } = RULE_TYPES;
const { RULE_TYPE, LEFT, OPERATOR, RHS_PARAMS, EXCLUDE_ELEMS } = RULE_PROPERTY;
const { DATA_TYPE, IS_COLLECTION, ELEMENT_TYPE, CANNOT_BE_ELEMENTS,
    MUST_BE_ELEMENTS, PARAM_TYPE_ELEMENT, PARAM_TYPE, SOBJECT_FIELD_REQUIREMENT, SYSTEM_VARIABLE_REQUIREMENT } = PARAM_PROPERTY;
const { CAN_BE, CANNOT_BE, MUST_BE } = CONSTRAINT;

const IS_SOBJECT_FIELD = 'isSObjectField';
const IS_SYSTEM_VARIABLE = 'isSystemVariable';

let operatorsInstance = {};

export const OBJECT_TYPE = 'objectType';

/**
 * A map from an elementType or dataType to an array of params relating to that elementType or dataType.
 * AND this map has two extra keys - isSObjectField and isSystemVariable which are short cuts to see if those special types are allowed
 * @typedef {Object.<string, param[]>} allowedParamMap
 */

 /**
 * Determines if a collection is required based on the paramTypes and dataType
 * @param {allowedParamMap} paramTypes the allowed param types
 * @param {String} dataType the data type of the field
 */
export const isCollectionRequired = (paramTypes, dataType) => {
    let collectionRequired = false;

    if (dataType && paramTypes && paramTypes[dataType]) {
        const dataTypeParams = paramTypes[dataType];
        // find the first param that does not have to be a collection (can be literal)
        const paramLiteralAllowed = dataTypeParams.find((param) => {
            return !param[IS_COLLECTION];
        });
        // if we could not find a param that can be a literal, then collection is required
        collectionRequired = isUndefined(paramLiteralAllowed);
    }
    return collectionRequired;
};

/**
 * Some screen fields do not have data type and we need to get them from the type object
 * @param {Object} element  an element from the store
 * @return {dataTypeLib/FLOW_DATA_TYPE} flow data type
 */
export const getDataType = (element) => {
    return getValueFromHydratedItem(element[DATA_TYPE]) || (element.type && element.type.type);
};

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
 * Sets all the possible operators available in the builder
 * @param {Object} allOperators map of operator value to label
 */
export const setOperators = (allOperators = {}) => {
    operatorsInstance = allOperators;
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
    // if it has sobjectName set, it's a field. Or, if this element has already been param-ified, we can just check how this field was initially set
    const isSobjectField = !!element[IS_SOBJECT_FIELD] || !!element.sobjectName;

    return {
        [OBJECT_TYPE]: element.objectType ? element.objectType : undefined,
        [DATA_TYPE]: getDataType(element),


        [IS_SOBJECT_FIELD]: isSobjectField,
        // if it's a field, it doesn't have an elementType
        [ELEMENT_TYPE]: isSobjectField ? undefined : getValueFromHydratedItem(element.elementType),

        // the param in the rules service has 'collection' but flow elements have 'isCollection'. In some scenarios,
        // an element goes through this function twice, and on the first pass it will have 'isCollection' but on the second
        // it has 'collection', so we have to account for both options
        [IS_COLLECTION]: !!element[IS_COLLECTION] || !!element.isCollection,
        [IS_SYSTEM_VARIABLE]: element[IS_SYSTEM_VARIABLE] || element.category === systemVariableCategory,

    };
};

const elementTypeNotAllowedForDataParam = (rule, element) => {
    return (rule[MUST_BE_ELEMENTS] && rule[MUST_BE_ELEMENTS].length > 0 && !rule[MUST_BE_ELEMENTS].includes(element))
        || (rule[CANNOT_BE_ELEMENTS] && rule[CANNOT_BE_ELEMENTS].includes(element));
};

const propertyAllowed = (rule, property, status) => {
    return rule[property] === CAN_BE ||
        (rule[property] === MUST_BE && status) ||
        (rule[property] === CANNOT_BE && !status);
};

const propertyMatches = (rule, element, property) => {
    return isUndefinedOrNull(rule[property]) // if the rule doesn't have a property defined, disregard that property
        || element[property] === rule[property] // if the element and rule both have a property defined, the values should match
        || (!rule[property] && !element[property]); // in the case rule[property] is false (not falsy), that property can be either undefined or false on the element
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

    /* if the rule param's paramType is element, skip to comparing properties directly
       if the rule param's paramType is data, and the element has an elementType, make sure the element type is allowed
       if all of the above is ok, make sure that the rule param's sObjectField requirement is respected */
    let matches = ruleParam[PARAM_TYPE] === PARAM_TYPE_ELEMENT
        || ((elementParam[ELEMENT_TYPE] ? !elementTypeNotAllowedForDataParam(ruleParam, ruleElementTypeToUIElementType[elementParam[ELEMENT_TYPE]]) : true)
        && propertyAllowed(ruleParam, SOBJECT_FIELD_REQUIREMENT, elementParam[IS_SOBJECT_FIELD]) && propertyAllowed(ruleParam, SYSTEM_VARIABLE_REQUIREMENT, elementParam[IS_SYSTEM_VARIABLE]));

    const propertiesToCompare = [DATA_TYPE, ELEMENT_TYPE, IS_COLLECTION];
    let i = 0;
    while (matches && i < propertiesToCompare.length) {
        matches = propertyMatches(ruleParam, elementParam, propertiesToCompare[i]);
        i++;
    }
    return matches;
};

/**
 * Operator rules have flags which can be set to CANNOT_BE, CAN_BE, or MUST_BE.
 * @param {rules/param} param   an operatorRuleParam to be checked
 * @param {String} flag         canBeSobjectField, canBeSystemVariable, etc
 * @returns {Boolean}           true if this flag is allowed, but not necessarily required, by this param, false otherwise
 */
const specialCaseAllowed = (param, flag) => {
    return [CAN_BE, MUST_BE].indexOf(param[flag]) >= 0;
};

/**
 * Checks if rule can be used in property editor for element type
 * @param {operatorRule} rule
 * @param {String} elementType
 * @param {Boolean} true if rule is allowed, false if not
 */
const ruleAllowedInElementEditor = (rule, elementType) => {
    return !rule[EXCLUDE_ELEMS] || !rule[EXCLUDE_ELEMS].includes(elementType);
};

/**
 * Adds param to map under type
 * @param {Object.map<String, Object.set<param>>} map   dataType/elementType/objectType to parameters relating to that type
 * @param {param} param   Param to be stringified and added to the map
 * @param {String} type   dataTypeLib.FLOW_DATA_TYPE, flowMetadata.ELEMENT_TYPE, or sObject api name
 */
const addParamToTypeMap = (map, param, type) => {
    if (!type) {
        type = getDataTypeOrElementType(param);
    }
    if (!map.hasOwnProperty(type)) {
        map[type] = new Set();
    }
    map[type].add(JSON.stringify(param));
};

/**
 * Turns the passed in map into an allowedParamMap (see above typedef)
 * @param {Object.map<String, Object.set<param>>} map   dataType/elementType/objectType to parameters relating to that type
 */
const convertToAllowedParamMap = (stringifiedParamTypeMap) => {
    let canBeSystemVariable = false;
    let canBeSObjectField = false;
    Object.keys(stringifiedParamTypeMap).forEach((key) => {
        stringifiedParamTypeMap[key] = Array.from(stringifiedParamTypeMap[key]).map((serializedValue) => {
            const param = JSON.parse(serializedValue);
            canBeSObjectField = canBeSObjectField || specialCaseAllowed(param, SOBJECT_FIELD_REQUIREMENT);
            canBeSystemVariable = canBeSystemVariable || specialCaseAllowed(param, SYSTEM_VARIABLE_REQUIREMENT);
            return param;
        });
    });
    stringifiedParamTypeMap[SOBJECT_FIELD_REQUIREMENT] = canBeSObjectField;
    stringifiedParamTypeMap[SYSTEM_VARIABLE_REQUIREMENT] = canBeSystemVariable;
};

/**
 * Get the allowed left hand side types based on the rule type
 * @param {String} elementType      elementType where this rule is being used
 * @param {operatorRule[]} rules    list of rules we are checking for lhs types. These are taken from the FlowOperatorRuleUtil service
 * @param {String} ruleType     the rule type of the given rules eg: assignment/comparator
 * @returns {allowedParamMap}   map of data types & element types to allowed left hand side types
 */
export const getLHSTypes = (elementType, rules, ruleType) => {
    if (!Array.isArray(rules)) {
        throw new Error(`Rules must be an Array but instead was ${typeof rules}`);
    }
    // if the rule type was specified then we want to filter by rule type
    const allowedRules = ruleType !== undefined ? filterByRuleType(rules, ruleType) : rules;

    const paramTypeMap = {};
    allowedRules.forEach((rule) => {
        if (ruleAllowedInElementEditor(rule, elementType)) {
            addParamToTypeMap(paramTypeMap, rule[LEFT]);
        }
    });

    convertToAllowedParamMap(paramTypeMap);
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
        throw new Error(`Rules must be an Array but instead was ${typeof rules}`);
    }
    // if the rule type was specified then we want to filter by rule type
    const allowedRules = ruleType !== undefined ? filterByRuleType(rules, ruleType) : rules;

    const reducer = (operatorSet, rule) => {
        if (ruleAllowedInElementEditor(rule, elementType) && isMatch(rule[LEFT], lhsElement)) {
            operatorSet.add(rule[OPERATOR]);
        }
        return operatorSet;
    };

    return Array.from(allowedRules.reduce(reducer, new Set()));
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
    const mapOperatorToMenuItem = (operator) => {
        return {
            value: operator,
            label: operatorsInstance[operator],
        };
    };
    return operators.map(mapOperatorToMenuItem);
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
    // if the rule type was specified then we want to filter by rule type
    const allowedRules = ruleType !== undefined ? filterByRuleType(rules, ruleType) : rules;

    const paramTypeMap = {};
    allowedRules.forEach((rule) => {
        if (ruleAllowedInElementEditor(rule, elementType) &&
        (operator === rule[OPERATOR] && isMatch(rule[LEFT], lhsElement))) {
            rule[RHS_PARAMS].forEach((rhsParam) => {
                let type = getDataTypeOrElementType(rhsParam);
                if (type === 'SObject') {
                    // if element is an sObject, we want to track by object type because sObject type must match exactly
                    type = lhsElement.objectType;
                }
                addParamToTypeMap(paramTypeMap, rhsParam, type);
            });
        }
    });
    convertToAllowedParamMap(paramTypeMap);
    return paramTypeMap;
};