import systemVariableCategory from '@salesforce/label/FlowBuilderSystemVariables.systemVariableCategory';

export const SYSTEM_VARIABLE_PREFIX = '$Flow';
export const SYSTEM_VARIABLE_CLIENT_PREFIX = '$Client';
const SYSTEM_VARIABLE_RECORD_CATEGORY = 'Record';
export const SYSTEM_VARIABLE_RECORD_PREFIX = '$' + SYSTEM_VARIABLE_RECORD_CATEGORY;

export const SYSTEM_VARIABLES = {
    CURRENT_DATE_TIME: SYSTEM_VARIABLE_PREFIX + '.CurrentDateTime'
};

let systemVariables = {};

/**
 * Converts serialized FlowSystemVariablesEnums to a form usable by menus.
 *
 * @param {Array}
 *            data raw variable data from the server
 */
const convertData = data =>
    data.reduce((acc, obj) => {
        const name = `$${obj.category}.${obj.devName}`;
        const variable = Object.assign(obj, {
            category: systemVariableCategory,
            apiName: obj.devName,
            dataType: obj.dataType,
            guid: name,
            label: obj.devName,
            name,
            readOnly: !obj.isAssignable,
            isSystemVariable: true,
            subtype: `${obj.category}`
        });
        delete variable.devName;

        acc[name] = variable;
        return acc;
    }, {});

/**
 * Sets the system variables. This should be done during app initialization.
 *
 * @param {Object}
 *            data the data returned by the service
 */
export const setSystemVariables = data => {
    const parsedVariables = JSON.parse(data);
    if (Array.isArray(parsedVariables)) {
        // Remove $Record var. In the current implementation $Record is treated as an alias to the start element.
        // The attributes communicated in $Record here are hard-coded in the start element factory.
        // With that the visibility of $Record communicated by the backend based on the process type is ignored in the Flow Builder.
        // If it is ever needed, it can be tracked with a dedicated local var here and surfaced in the app by
        // e.g. a function like isRecordSystemVariableEnabled().
        if (parsedVariables) {
            const index = parsedVariables.findIndex(variable => variable.category === SYSTEM_VARIABLE_RECORD_CATEGORY);
            if (index !== -1) {
                parsedVariables.splice(index, 1);
            }
        }
        systemVariables = convertData(parsedVariables);
    }
};

/**
 * Gets all available system variables. Should be used after
 * fetchAllSystemVariables completes.
 *
 * @returns {Object} system variables usable in menus
 */
export const getSystemVariables = category => {
    if (category) {
        const categoryVariables = {};
        Object.keys(systemVariables).forEach(key => {
            if (key.startsWith(category)) {
                categoryVariables[key] = systemVariables[key];
            }
        });
        return categoryVariables;
    }
    return systemVariables;
};

export function isSystemVariablesCategoryNotEmpty(category) {
    const vars = getSystemVariables(category);
    return Object.keys(vars).length > 0;
}
