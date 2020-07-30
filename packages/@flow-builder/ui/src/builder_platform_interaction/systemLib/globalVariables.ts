import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';

// @ts-nocheck
let globalVariableTypes;
let globalVariables;

export const resetGlobalVariables = () => {
    globalVariables = {};
};

/**
 * Creates a mapping of serialized GlobalVariableTypes.
 *
 * @param {Array}
 *            data raw type data from the server
 */
const convertTypeData = data =>
    data.reduce((acc, obj) => {
        const type = {
            durableId: obj.durableId,
            label: obj.label,
            name: obj.name
        };

        acc[obj.name] = type;
        return acc;
    }, {});

/**
 * Converts serialized GlobalVariables to a form usable by menus.
 *
 * @param {Array}
 *            data raw variable data from the server
 */
const convertData = (data, types) =>
    data.reduce((acc, obj) => {
        const type = types[obj.type.name];
        const name = `${type.name}.${obj.name}`;
        const variable = {
            guid: name,
            // TODO can we use the label instead of dev name here? Is there always a label returned from the service?
            label: obj.name,
            name,
            dataType: obj.datatype,
            apiName: obj.name
        };
        if (!acc[type.name]) {
            acc[type.name] = {};
        }

        acc[type.name][name] = variable;

        return acc;
    }, {});

/**
 * Sets the global variable types and variables. This should be done during app
 * initialization.
 *
 * @param {Object}
 *            data the data returned by the service
 */
export const setGlobalVariables = data => {
    let allTypes;
    if (Array.isArray(data.globalVariableTypes)) {
        allTypes = convertTypeData(data.globalVariableTypes);
    }
    if (Array.isArray(data.globalVariables)) {
        globalVariables = convertData(data.globalVariables, allTypes);
    }
    globalVariableTypes = {};
    Object.keys(allTypes).forEach(type => {
        if (globalVariables[type]) {
            globalVariableTypes[type] = allTypes[type];
        }
    });
};

/**
 * Gets all available global variable types. Should be used after
 * fetchAllGlobalVariables completes.
 *
 * @returns {Object} global variables types
 */
export const getGlobalVariableTypes = () => {
    return globalVariableTypes;
};

/**
 * Gets all available global variables for the given type. Should be used after
 * fetchAllGlobalVariables completes.
 *
 * @param {String}
 *            typeName name of the global variable type to get variables for
 * @param {boolean} showMultiPicklistGlobalVariables whether we allow global variables of type multipicklist
 * @returns {Object} global variables usable in menus
 */
export const getGlobalVariables = (typeName, showMultiPicklistGlobalVariables = false) => {
    let filteredGlobalVariables;
    const globalVariableFields = globalVariables && globalVariables[typeName];
    if (showMultiPicklistGlobalVariables) {
        return globalVariableFields;
    } else if (globalVariableFields) {
        Object.keys(globalVariableFields).forEach(key => {
            // TODO W-7837206 Remove this once backend support for Multipicklist is added
            if (globalVariableFields[key].dataType !== 'Multipicklist') {
                if (!filteredGlobalVariables) {
                    filteredGlobalVariables = {};
                }
                filteredGlobalVariables[key] = globalVariableFields[key];
            }
        });
    }
    return filteredGlobalVariables;
};

/**
 * Information about a single global variable
 *
 * @param {String} id      points to a global variable
 * @returns {Object|null}  object representing the global variable if this id is valid
 */
export const getGlobalVariable = id => {
    const reference = removeCurlyBraces(id);
    if (reference) {
        const refParts = reference.split('.');
        if (globalVariables && globalVariables[refParts[0]]) {
            return globalVariables[refParts[0]][reference];
        }
    }
    return null;
};
