import { getValueFromHydratedItem, getErrorFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
/**
 * @typedef {FlowInputOutputVariablesVersion} input/output variables for active and/or latest version,
 * as returned by the GET_FLOW_INPUT_OUTPUT_VARIABLES service
 * @property {FlowInputOutputVariables} variables the input/output variables
 * @property {boolean} isLatestVersion true if it is the latest version of the flow
 * @property {boolean} isActiveVersion true if it is the active version of the flow
 */

/**
 * @typedef {InputOutputParameterItems} input and output parameter items
 * @property {ParameterItem[]} inputs the input parameter items (value must be hydrated)
 * @property {ParameterItem[]} outputs the output parameter items (value must be hydrated)
 */

/**
 * Merge the subflow input and output assignments with the subflow input and output variables
 *
 * @param {InputParameter[]} nodeInputAssignments the input parameters, possibly hydrated
 * @param {OutputParameter[]} nodeOutputAssignments the output parameters, possibly hydrated
 * @param {FlowInputOutputVariablesVersion[]} inputOutputVariablesVersions input/output variables for active and/or latest version
 * @return {InputOutputParameterItems} the input and output parameter items
 */
export function mergeSubflowAssignmentsWithInputOutputVariables(nodeInputAssignments, nodeOutputAssignments, inputOutputVariablesVersions) {
    const activeInputVariables = getVariables(inputOutputVariablesVersions, version => version.isActiveVersion === true, variable => variable.isInput === true);
    const latestInputVariables = getVariables(inputOutputVariablesVersions, version => version.isLatestVersion === true, variable => variable.isInput === true);

    const activeOutputVariables = getVariables(inputOutputVariablesVersions, version => version.isActiveVersion === true, variable => variable.isOutput === true);
    const latestOutputVariables = getVariables(inputOutputVariablesVersions, version => version.isLatestVersion === true, variable => variable.isOutput === true);

    return {
        inputs : mergeSubflowAssignmentsWithVariables(nodeInputAssignments, true, activeInputVariables, latestInputVariables),
        outputs : mergeSubflowAssignmentsWithVariables(nodeOutputAssignments, false, activeOutputVariables, latestOutputVariables)
    };
}

/**
 * Get the variables matching the given filters
 */
function getVariables(inputOutputVariablesVersions, versionFilter, variableFilter) {
    const version = inputOutputVariablesVersions.find(versionFilter);
    if (!version) {
        return [];
    }
    return version.variables.filter(variableFilter);
}

/**
 * Get as a map. Key is the variable name, value has properties activeVariable,
 * latestVariable and nodeAssignments
 */
function getAsMap(activeVariables, latestVariables, nodeAssignments) {
    const map = {};
    activeVariables.forEach(variable => {
        map[variable.name] = map[variable.name] || {};
        map[variable.name].activeVariable = variable;
        map[variable.name].nodeAssignments = [];
    });
    latestVariables.forEach(variable => {
        map[variable.name] = map[variable.name] || {};
        map[variable.name].latestVariable = variable;
        map[variable.name].nodeAssignments = [];
    });
    nodeAssignments.forEach(nodeAssignment => {
        // there can be several assignments for a given variable (when flow has been edited using CFD)
        const nodeAssignmentName = getValueFromHydratedItem(nodeAssignment.name);
        map[nodeAssignmentName] = map[nodeAssignmentName] || {};
        map[nodeAssignmentName].nodeAssignments = map[nodeAssignmentName].nodeAssignments || [];
        map[nodeAssignmentName].nodeAssignments.push(nodeAssignment);
    });
    return map;
}

/**
 * Merge either input or output subflow assignments with input or output subflow active and latest variables
 */
function mergeSubflowAssignmentsWithVariables(nodeAssignments, isInput, activeVariables, latestVariables) {
    const allParameters = getAsMap(activeVariables, latestVariables, nodeAssignments);
    const parameterItems = [];
    for (const [name, { activeVariable, latestVariable, nodeAssignments : nodeAssignmentsForVariable }] of Object.entries(allParameters)) {
        if (nodeAssignmentsForVariable.length > 0) {
            if (isInput) {
                // When using CFD, there is a warning when a variable has multiple input assignments.
                // At runtime, the last input assignment win
                const parameterItem = merge(name, nodeAssignmentsForVariable[nodeAssignmentsForVariable.length - 1], isInput, activeVariable, latestVariable);
                parameterItems.push(parameterItem);
            } else {
                // When using CFD, you can add multiple output assignments for the same subflow variable
                nodeAssignmentsForVariable.forEach(nodeAssignment => {
                    const parameterItem = merge(name, nodeAssignment, isInput, activeVariable, latestVariable);
                    parameterItems.push(parameterItem);
                });
            }
        } else {
            const parameterItem = merge(name, undefined, isInput, activeVariable, latestVariable);
            parameterItems.push(parameterItem);
        }
    }
    return parameterItems;
}

function merge(name, nodeAssignment, isInput, activeVariable, latestVariable) {
    const variable = activeVariable || latestVariable;
    let parameterItem = {name, isInput, isRequired : false};
    if (nodeAssignment) {
        // only value needs to be hydrated. Copy it to avoid side effects
        const value = { value : getValueFromHydratedItem(nodeAssignment.value), error : getErrorFromHydratedItem(nodeAssignment.value) };
        const { valueDataType } = nodeAssignment;
        parameterItem = Object.assign(parameterItem, { value, valueDataType});
    }
    if (variable) {
        parameterItem = Object.assign(parameterItem, {
            label : name,
            dataType : variable.dataType
        });
        if (variable.isCollection) {
            parameterItem = Object.assign(parameterItem, { maxOccurs : Number.MAX_SAFE_INTEGER });
        }
    } else {
        // we don't know the type, assume it is 'String' (dataType is mandatory)
        parameterItem = Object.assign(parameterItem, {
            label : name,
            dataType : FLOW_DATA_TYPE.STRING.value
        });
    }
    return parameterItem;
}