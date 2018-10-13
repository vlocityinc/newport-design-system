let globalVariableTypes;
let globalVariables;

/**
 * Creates a mapping of serialized GlobalVariableTypes.
 *
 * @param {Array}
 *            data raw type data from the server
 */
const convertTypeData = (data) => data.reduce((acc, obj) => {
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
const convertData = (data) => data.reduce((acc, obj) => {
    const type = globalVariableTypes[obj.type.name];
    const name = `${type.name}.${obj.name}`;
    // TODO: Need to figure out dataType for the icon, it's not coming back from
    // the service.
    const variable = {
        category: type.label,
        guid: name,
        label: obj.name,
        name
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
export const setGlobalVariables = (data) => {
    const parsedTypes = JSON.parse(data.globalVariableTypes);
    if (Array.isArray(parsedTypes)) {
        globalVariableTypes = convertTypeData(parsedTypes);
    }

    const parsedVariables = JSON.parse(data.globalVariables);
    if (Array.isArray(parsedVariables)) {
        globalVariables = convertData(parsedVariables);
    }
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
 * @returns {Object} global variables usable in menus
 */
export const getGlobalVariables = (typeName) => {
    return globalVariables[typeName];
};