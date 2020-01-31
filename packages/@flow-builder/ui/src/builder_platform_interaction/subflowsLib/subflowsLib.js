import { getMergedInputOutputVariables } from './subflowVariablesMerger';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { LABELS } from './subflowsLibLabels';
import { MERGE_VARIABLES_WARNING_TYPE } from './subflowVariablesWarnings';
import { format } from 'builder_platform_interaction/commonUtils';

export { MERGE_VARIABLES_WARNING_TYPE } from './subflowVariablesWarnings';
export { getMergedInputOutputVariables } from './subflowVariablesMerger';

let subflows = [];
let cachedInputOutputVariables = {};
let cachedMergedInputOutputVariables = {};

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
 * Fetch input variables and returns merged latest/active input variables
 * @param {String} flowName the flow name
 * @returns {Promise<MergedFlowVariable[]>}
 */
export function fetchMergedFlowInputVariables(
    flowName,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    return fetchFlowInputOutputVariables(flowName, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(() => getMergedFlowInputVariables(flowName));
}

/**
 * @typedef {MergedFlowVariable}
 * @property {string} apiName
 * @property {string} dataType
 * @property {boolean} isCollection
 * @property {number} scale
 * @property {string} subtype
 * @property {MERGE_VARIABLES_WARNING_TYPE} mergeWarning
 */

/**
 * Fetch output variables and returns merged latest/active output variables
 * @param {String} flowName the flow name
 * @returns {Promise<MergedFlowVariable[]>}
 */
export function fetchMergedFlowOutputVariables(
    flowName,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    return fetchFlowInputOutputVariables(flowName, {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(() => getMergedFlowOutputVariables(flowName));
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
 * Get the merged flow input variables
 * @param {String} flowName the flow name
 * @returns {MergedFlowVariable[] | undefined} the merged flow input variables or undefined if not yet retrieved or unknown flow name
 */
export function getMergedFlowInputVariables(flowName) {
    if (cachedMergedInputOutputVariables[flowName]) {
        return cachedMergedInputOutputVariables[flowName].inputVariables;
    }
    const flowInputOutputVariables = getFlowInputOutputVariables(flowName);
    if (!flowInputOutputVariables) {
        return undefined;
    }
    cachedMergedInputOutputVariables[flowName] = getMergedInputOutputVariables(flowInputOutputVariables);
    return cachedMergedInputOutputVariables[flowName].inputVariables;
}

/**
 * Get the merged flow output variables
 * @param {String} flowName the flow name
 * @returns {MergedFlowVariable[] | undefined} the merged flow output variables or undefined if not yet retrieved or unknown flow name
 */
export function getMergedFlowOutputVariables(flowName) {
    if (cachedMergedInputOutputVariables[flowName]) {
        return cachedMergedInputOutputVariables[flowName].outputVariables;
    }
    const flowInputOutputVariables = getFlowInputOutputVariables(flowName);
    if (!flowInputOutputVariables) {
        return undefined;
    }
    cachedMergedInputOutputVariables[flowName] = getMergedInputOutputVariables(flowInputOutputVariables);
    return cachedMergedInputOutputVariables[flowName].outputVariables;
}

/**
 * Get label for a flow variable (with warning if any)
 * @param {MergedFlowVariable} variable
 * @returns {string} the label
 */
export function getSubflowVariableLabelWithWarning(variable) {
    if (variable.mergeWarning) {
        switch (variable.mergeWarning) {
            case MERGE_VARIABLES_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST:
                return format(LABELS.variableInLatestVersionOnly, variable.apiName);
            case MERGE_VARIABLES_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE:
            case MERGE_VARIABLES_WARNING_TYPE.DATA_TYPE_CHANGED:
                return format(LABELS.variableInActiveVersionOnly, variable.apiName);
            default:
                return variable.apiName;
        }
    }
    return variable.apiName;
}

export function clearFlowCachedInputOutputVariables() {
    cachedInputOutputVariables = {};
    cachedMergedInputOutputVariables = {};
}
