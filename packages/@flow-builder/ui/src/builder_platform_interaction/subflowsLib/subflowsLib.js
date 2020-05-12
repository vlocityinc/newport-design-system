// @ts-nocheck
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';

let subflows = [];
let cachedInputOutputVariables = {};
let cachedActiveOrLatestInputOutputVariables = {};

export function setSubflows(data) {
    subflows = data;
}

export function getSubflows() {
    return subflows;
}

/**
 * Fetch raw input and output variables for given flow name
 * @param {String} flowName the flow name
 * @returns {Promise<FlowInputOutputVariablesVersion[]>} promise to raw input output variables, as returned by the GET_FLOW_INPUT_OUTPUT_VARIABLES service
 */
export function fetchFlowInputOutputVariables(
    flowName,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    if (cachedInputOutputVariables[flowName]) {
        return Promise.resolve(cachedInputOutputVariables[flowName]);
    }
    const serverActionParams = { flowName };
    return fetchOnce(SERVER_ACTION_TYPE.GET_FLOW_INPUT_OUTPUT_VARIABLES, serverActionParams, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(inputOutputVariables => {
        cachedInputOutputVariables[flowName] = inputOutputVariables;
        return inputOutputVariables;
    });
}

/**
 * Fetch input variables and returns active input variables (or latest if there is no active version)
 * @param {String} flowName the flow name
 * @returns {Promise<ActiveOrLatestFlowVariable[]>}
 */
export function fetchActiveOrLatestFlowInputVariables(
    flowName,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    return fetchFlowInputOutputVariables(flowName, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(() => getActiveOrLatestFlowInputVariables(flowName));
}

/**
 * @typedef {ActiveOrLatestFlowVariable}
 * @property {string} apiName
 * @property {string} dataType
 * @property {boolean} isCollection
 * @property {number} scale
 * @property {string} subtype
 */

/**
 * Fetch output variables and returns active output variables (or latest output variables if there is no active version)
 * @param {String} flowName the flow name
 * @returns {Promise<ActiveOrLatestFlowVariable[]>}
 */
export function fetchActiveOrLatestFlowOutputVariables(
    flowName,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    return fetchFlowInputOutputVariables(flowName, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(() => getActiveOrLatestFlowOutputVariables(flowName));
}

/**
 * Get the raw input output variables
 * @param {String} flowName the flow name
 * @returns {FlowInputOutputVariablesVersion[] | undefined} raw input output variables or undefined if not yet retrieved
 */
export function getFlowInputOutputVariables(flowName) {
    return cachedInputOutputVariables[flowName];
}

/**
 * Get the active input variables for the flow (or latest input variables if there is no active version)
 * @param {String} flowName the flow name
 * @returns {ActiveOrLatestFlowVariable[] | undefined} the flow input variables or undefined if not yet retrieved or unknown flow name
 */
export function getActiveOrLatestFlowInputVariables(flowName) {
    if (cachedActiveOrLatestInputOutputVariables[flowName]) {
        return cachedActiveOrLatestInputOutputVariables[flowName].inputVariables;
    }
    const flowInputOutputVariables = getFlowInputOutputVariables(flowName);
    if (!flowInputOutputVariables) {
        return undefined;
    }
    cachedActiveOrLatestInputOutputVariables[flowName] = getActiveOrLatestInputOutputVariables(
        flowInputOutputVariables
    );
    return cachedActiveOrLatestInputOutputVariables[flowName].inputVariables;
}

/**
 * Get the active output variables for the flow (or latest output variables if there is no active version)
 * @param {String} flowName the flow name
 * @returns {ActiveOrLatestFlowVariable[] | undefined} the flow output variables or undefined if not yet retrieved or unknown flow name
 */
export function getActiveOrLatestFlowOutputVariables(flowName) {
    if (cachedActiveOrLatestInputOutputVariables[flowName]) {
        return cachedActiveOrLatestInputOutputVariables[flowName].outputVariables;
    }
    const flowInputOutputVariables = getFlowInputOutputVariables(flowName);
    if (!flowInputOutputVariables) {
        return undefined;
    }
    cachedActiveOrLatestInputOutputVariables[flowName] = getActiveOrLatestInputOutputVariables(
        flowInputOutputVariables
    );
    return cachedActiveOrLatestInputOutputVariables[flowName].outputVariables;
}

export function clearFlowCachedInputOutputVariables() {
    cachedInputOutputVariables = {};
    cachedActiveOrLatestInputOutputVariables = {};
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

function getLatestInputOutputVariables(inputOutputVariablesVersions) {
    const latestInputOutput = inputOutputVariablesVersions.find(version => version.isLatestVersion === true);
    return latestInputOutput && latestInputOutput.variables;
}

function getActiveInputOutputVariables(inputOutputVariablesVersions) {
    const activeInputOutput = inputOutputVariablesVersions.find(version => version.isActiveVersion === true);
    return activeInputOutput && activeInputOutput.variables;
}

export function getActiveOrLatestInputOutputVariables(inputOutputVariablesVersions) {
    let inputOutputVariables = getActiveInputOutputVariables(inputOutputVariablesVersions);
    if (!inputOutputVariables) {
        inputOutputVariables = getLatestInputOutputVariables(inputOutputVariablesVersions);
    }
    if (!inputOutputVariables) {
        inputOutputVariables = [];
    }
    const inputVariables = inputOutputVariables.filter(variable => variable.isInput === true);
    const outputVariables = inputOutputVariables.filter(variable => variable.isOutput === true);

    // a variable can be both in inputVariables and outputVariables (with a different warning)
    return {
        inputVariables: inputVariables.map(variable => getVariableAsComplexTypeFieldDescription(variable)),
        outputVariables: outputVariables.map(variable => getVariableAsComplexTypeFieldDescription(variable))
    };
}
