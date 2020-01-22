import { getMergeWarning } from './subflowVariablesWarnings';

/**
 * Get as a map. Key is the variable name, value has properties activeVariable,
 * latestVariable
 */
function getAsMap(activeVariables, latestVariables) {
    const map = {};
    if (activeVariables) {
        activeVariables.forEach(variable => {
            map[variable.name] = map[variable.name] || {};
            map[variable.name].activeVariable = variable;
        });
    }
    latestVariables.forEach(variable => {
        map[variable.name] = map[variable.name] || {};
        map[variable.name].latestVariable = variable;
    });
    return map;
}

/**
 * Merge either input or output subflow active and latest variables
 */
function mergeSubflowVariables(activeVariables, latestVariables) {
    const flowHasActiveVersion = activeVariables !== undefined;
    const variablesMap = getAsMap(activeVariables, latestVariables);
    const mergedVariables = [];
    for (const { activeVariable, latestVariable } of Object.values(
        variablesMap
    )) {
        const variable = activeVariable || latestVariable;
        const mergeWarning = flowHasActiveVersion
            ? getMergeWarning(activeVariable, latestVariable)
            : undefined;
        if (mergeWarning) {
            mergedVariables.push(Object.assign({}, variable, { mergeWarning }));
        } else {
            mergedVariables.push(variable);
        }
    }
    return mergedVariables;
}

function getLatestInputOutputVariables(inputOutputVariablesVersions) {
    const latestInputOutput = inputOutputVariablesVersions.find(
        version => version.isLatestVersion === true
    );
    return latestInputOutput ? latestInputOutput.variables : [];
}

function getActiveInputOutputVariables(inputOutputVariablesVersions) {
    const activeInputOutput = inputOutputVariablesVersions.find(
        version => version.isActiveVersion === true
    );
    return activeInputOutput ? activeInputOutput.variables : [];
}

function getVariableAsComplexTypeFieldDescription(variable) {
    const complexTypeFieldDesc = {
        ...variable,
        apiName: variable.name
    };
    delete complexTypeFieldDesc.processMetadataValues;
    if (complexTypeFieldDesc.objectType != null) {
        complexTypeFieldDesc.subtype = variable.objectType;
    }
    return complexTypeFieldDesc;
}

export function getMergedInputOutputVariables(inputOutputVariablesVersions) {
    const flowHasActiveVersion =
        inputOutputVariablesVersions.find(
            version => version.isActiveVersion
        ) !== undefined;
    const latestInputOutputVariables = getLatestInputOutputVariables(
        inputOutputVariablesVersions
    );
    const activeInputOutputVariables = getActiveInputOutputVariables(
        inputOutputVariablesVersions
    );
    const latestInputVariables = latestInputOutputVariables.filter(
        variable => variable.isInput === true
    );
    const latestOutputVariables = latestInputOutputVariables.filter(
        variable => variable.isOutput === true
    );
    const activeInputVariables =
        flowHasActiveVersion &&
        activeInputOutputVariables.filter(
            variable => variable.isInput === true
        );
    const activeOutputVariables =
        flowHasActiveVersion &&
        activeInputOutputVariables.filter(
            variable => variable.isOutput === true
        );

    const mergedInputVariables = mergeSubflowVariables(
        activeInputVariables,
        latestInputVariables
    );
    const mergedOutputVariables = mergeSubflowVariables(
        activeOutputVariables,
        latestOutputVariables
    );

    // a variable can be both in inputVariables and outputVariables (with a different warning)
    return {
        inputVariables: mergedInputVariables.map(variable =>
            getVariableAsComplexTypeFieldDescription(variable)
        ),
        outputVariables: mergedOutputVariables.map(variable =>
            getVariableAsComplexTypeFieldDescription(variable)
        )
    };
}
