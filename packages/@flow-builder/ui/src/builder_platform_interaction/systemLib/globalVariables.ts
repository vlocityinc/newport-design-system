import { removeCurlyBraces } from 'builder_platform_interaction/commonUtils';

type GlobalVariableType = {
    durableId: string;
    label: string;
    name: string;
};

type GlobalVariable = any;

type GlobalVariableData = {
    globalVariables: GlobalVariable[];
    globalVariableTypes: GlobalVariableType[];
};

type NameToGlobalVariable = { [name: string]: GlobalVariable };
type GlobalVariables = { [type: string]: NameToGlobalVariable };
type GlobalVariableTypes = { [key: string]: GlobalVariableType };

let globalVariableTypes: GlobalVariableTypes;
let globalVariables: GlobalVariables;

export const resetGlobalVariables = () => {
    globalVariables = {};
};

/**
 * Creates a mapping of serialized GlobalVariableTypes.
 *
 * @param data -The raw type data from the server
 * @returns The type map
 */
const convertTypeData = (data) =>
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
 * @param globalVariables - raw variable data from the server
 * @param types - The global variable type map
 * @returns A type to global variables object map
 */
const convertData = (globalVariables: GlobalVariable[], types: GlobalVariableTypes): GlobalVariables =>
    globalVariables.reduce((acc, obj) => {
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
 * @param data - The data returned by the service
 */
export const setGlobalVariables = (data: GlobalVariableData) => {
    let allTypes;
    if (Array.isArray(data.globalVariableTypes)) {
        allTypes = convertTypeData(data.globalVariableTypes);
    }
    if (Array.isArray(data.globalVariables)) {
        globalVariables = convertData(data.globalVariables, allTypes);
    }
    globalVariableTypes = {};
    Object.keys(allTypes).forEach((type) => {
        if (globalVariables[type]) {
            globalVariableTypes[type] = allTypes[type];
        }
    });
};

/**
 * Adds the global label variables
 *
 * @param data - The data returned by the service
 */
export function addLabelVariables(data: GlobalVariableData) {
    const allTypes = convertTypeData(data.globalVariableTypes);
    globalVariableTypes.$Label = allTypes.$Label;

    const { $Label } = convertData(data.globalVariables, allTypes);
    globalVariables.$Label = $Label;
}

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
 * @param {string} typeName name of the global variable type to get variables for
 * @param {boolean} showMultiPicklistGlobalVariables whether we allow global variables of type multipicklist
 * @returns {Object} global variables usable in menus
 */
export const getGlobalVariables = (typeName, showMultiPicklistGlobalVariables = false) => {
    let filteredGlobalVariables;
    const globalVariableFields = globalVariables && globalVariables[typeName];
    if (showMultiPicklistGlobalVariables) {
        return globalVariableFields;
    } else if (globalVariableFields) {
        Object.keys(globalVariableFields).forEach((key) => {
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
 * @param {string} id      points to a global variable
 * @returns {Object|null}  object representing the global variable if this id is valid
 */
export const getGlobalVariable = (id) => {
    const reference = removeCurlyBraces(id);
    if (reference) {
        const refParts = reference.split('.');
        if (globalVariables && globalVariables[refParts[0]]) {
            return globalVariables[refParts[0]][reference];
        }
    }
    return null;
};
