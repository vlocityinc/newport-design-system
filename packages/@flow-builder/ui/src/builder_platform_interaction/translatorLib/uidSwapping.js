import { isPlainObject } from "builder_platform_interaction/storeLib";
import { TEMPLATE_FIELDS, REFERENCE_FIELDS, EXPRESSION_RE } from "builder_platform_interaction/flowMetadata";

// check to enable guid to devname swapping for referencefields. While opening property editor, only template fields guids need to be swapped with dev name.
let checkReferenceFields = true;

/**
 * Swaps a value that may contain 0 or more variables
 *
 * @param {Object} swapFunction  a function that will replace a single variable/guid/devName
 * @param {Object} fieldName     the name of the field
 * @param {String} value         the value containing ids for swapping
 *                               ex: 'hi', 'accountVar', 'accountVar.name', 'hi {!accountVar.name} '
 *
 * @returns {Object}             the value after swapping out guids or devNames
 */
export const swapValueFunction = (swapFunction, fieldName, value) => {
    if (TEMPLATE_FIELDS.has(fieldName)) {
        if (EXPRESSION_RE.test(value)) {
            const replacer = (fullMatch) => {
                // Strip '{!', '}'
                const expressionMatch = fullMatch.substr(2).replace('}', '');
                return '{!' + swapFunction(expressionMatch) + '}';
            };
            value = value.replace(EXPRESSION_RE, replacer);
        }
    } else if (checkReferenceFields && REFERENCE_FIELDS.has(fieldName)) {
        value = swapFunction(value);
    }

    return value;
};

/**
 * Traverse the flow tree ( or any tree ) and replace all devNames with Uids ( or the opposite )
 * All swapping is handled via the swap function which must accept only the field name and the
 * value
 *
 * @param {Object} object            the object in the flow tree to be converted
 * @param {Object} swapFunction      function to replace values
 */
export const recursiveSwap = (object, swapFunction) => {
    if (Array.isArray(object)) {
        object.forEach(element => {
            recursiveSwap(element, swapFunction);
        });
    } else if (isPlainObject(object)) {
        Object.keys(object).forEach(objectKey => {
            const value = object[objectKey];

            if (typeof (value) === 'string') {
                // swap out the value unless the value is null or undefined
                const newValue = value && swapFunction(objectKey, value);

                if (newValue !== value) {
                    object[objectKey] = newValue;
                }
            } else {
                recursiveSwap(value, swapFunction);
            }
        });
    }
};

/**
 * Swaps a single expression.
 * ex: If the full value is 'Hello {!userVar.name}' or 'userVar.name' this function
 * should only be passed 'userVar.name'
 *
 * @param {String} expression    the single expression to swap
 * @param {Object} mapping       the mapping of values to swap
 *
 * @returns {String}             the expression after swapping
 */
export const swapSingleExpression = (expression, mapping) => {
    const parts = expression.split('.');
    if (mapping[parts[0]]) {
        parts[0] = mapping[parts[0]];
        return parts.join('.');
    }

    if (mapping[expression]) {
        return mapping[expression];
    }
    return expression;
};

/**
 * Traverse the flow tree and replace all UIDs with dev names
 * Handles both references and some "template" strings ex: "Hello {!userVar.name}"
 *
 * @param {Object} elementUidMap    map of Uids to elementIds
 * @param {Object} flow             the flow
 * @param {Object} config   configuration to enable GUID to Devname swapping for reference fields
 */
export const swapUidsForDevNames = (elementUidMap, flow, config = {}) => {
    const {enableGuidToDevnameSwappingForReferenceFields = true} = config;
    checkReferenceFields = enableGuidToDevnameSwappingForReferenceFields;
    const mapping = {};
    Object.keys(elementUidMap).forEach(uid => {
        mapping[uid] = elementUidMap[uid].name;
    });

    // swap the uid with it's dev name if the uid is in the element map
    // leave it unchanged if it's not
    const swapSingleUidToDevName = (uid) => {
        return swapSingleExpression(uid, mapping);
    };

    // create a new function with the parameters embedded
    const swapUidForDevName = (fieldname, value) => {
        // return guidToDevName(elementUidMap, fieldname, value);
        return swapValueFunction(swapSingleUidToDevName, fieldname, value);
    };
    recursiveSwap(flow, swapUidForDevName);
};

/**
 * Traverse the flow tree and replace all devNames with Uids
 * Handles references and some "template" strings ex: "Hello {!userVar.name}"
 *
 * @param {Object} nameToUid        map of dev names to Uids
 * @param {Object} flow             flow
 * @param {Object} config configuration to enable Devname to guid swapping for reference fields
 */
export const swapDevNamesToUids = (nameToUid, flow, config = {}) => {
    const {enableDevnameToGuidSwappingForReferenceFields = true} = config;
    checkReferenceFields = enableDevnameToGuidSwappingForReferenceFields;
    // swap the uid with it's dev name if the uid is in the element map
    // leave it unchanged if it's not
    const swapSingleDevNameToUid = (devName) => {
        return swapSingleExpression(devName, nameToUid);
    };

    // create a new function with the parameters embedded
    const swapDevNameToUid = (fieldname, value) => {
        return swapValueFunction(swapSingleDevNameToUid, fieldname, value);
    };
    recursiveSwap(flow, swapDevNameToUid);
};

/**
 * Traverse the flow tree and replace all devNames with Uids
 * Handles references and some "template" strings ex: "Hello {!userVar.name}"
 *
 * @param {Object} elementUidMap    map of Uids to elementIds
 * @param {Object} flow             the flow
 */
export const swapDevNamesToGuids = (elementUidMap, flow) => {
    const elementGuids = Object.keys(elementUidMap);
    const nameToUid = {};
    for (let i = 0; i < elementGuids.length; i++) {
        const element = elementUidMap[elementGuids[i]];
        nameToUid[element.name] = element.guid;
    }
    swapDevNamesToUids(nameToUid, flow);
};
