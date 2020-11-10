// @ts-nocheck
import {
    set,
    getValueFromHydratedItem,
    updateProperties,
    deleteItem
} from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { swapDevNamesToGuids } from 'builder_platform_interaction/translatorLib';
import { mergeSubflowAssignmentsWithInputOutputVariables } from './subflowParametersMerger';
import { mergeInputOutputParameters } from './actionCallOrApexPluginParametersMerger';
import { MERGE_WARNING_TYPE } from 'builder_platform_interaction/elementFactory';

export const MERGE_WITH_PARAMETERS = 'MERGE_WITH_PARAMETERS';
export const REMOVE_UNSET_PARAMETERS = 'REMOVE_UNSET_PARAMETERS';

const getNodeInputsPropertyName = (elementType) => {
    if (elementType === ELEMENT_TYPE.SUBFLOW) {
        return 'inputAssignments';
    }
    return 'inputParameters';
};

const getNodeOutputsPropertyName = (elementType) => {
    if (elementType === ELEMENT_TYPE.SUBFLOW) {
        return 'outputAssignments';
    }
    return 'outputParameters';
};

/**
 * update parameter item
 * @param {Object} state the original node
 * @param {Object} param the parameter that we want to update (see UpdateParameterItemEvent.detail)
 * @return {Object} the updated node
 */
export const updateParameterItem = (state, param) => {
    const { isInput, rowIndex, valueDataType, error } = param;
    let { value } = param;
    const propertyName = isInput
        ? getNodeInputsPropertyName(state.elementType)
        : getNodeOutputsPropertyName(state.elementType);
    const paramIndex = state[propertyName].findIndex(
        (parameter) => getValueFromHydratedItem(parameter.rowIndex) === rowIndex
    );
    // consider no output variable assignment if value is ''
    if (!isInput && value === '') {
        value = null;
    }
    const updatedParam = updateProperties(state[propertyName][paramIndex], {
        value: { value, error },
        valueDataType
    });
    const path = [[propertyName], paramIndex];
    state = set(state, path, updatedParam);
    return state;
};

export const updateInputParameterItemConfigurationEditor = (
    state,
    { name: propertyName, newValueDataType: valueDataType, newValue: value },
    elements
) => {
    if (!propertyName) {
        throw new Error('property name is not defined');
    }

    const { rowIndex } = state.inputParameters.find(({ name }) => name === propertyName) || {};
    if (!rowIndex) {
        throw new Error(`'${propertyName}' parameter does not exist in the input parameter list`);
    }

    const obj = {
        isInput: true,
        valueDataType,
        value,
        rowIndex,
        error: null
    };
    swapDevNamesToGuids(elements, obj);
    return updateParameterItem(state, obj);
};

/**
 * merge the input/output parameters in original node with all of the action/apex plugin input/output parameters
 * @param {Object} state the original node
 * @param {ActionOrApexPluginInputOutputParameter[]} inputOutputParameters all of the action/apex plugin input/output parameters
 * @return {Object} the updated node
 */
export const mergeWithInputOutputParameters = (state, inputOutputParameters) => {
    const { inputs, outputs } = mergeInputOutputParameters(
        inputOutputParameters,
        state.inputParameters,
        state.outputParameters
    );
    state = updateProperties(state, {
        inputParameters: inputs,
        outputParameters: outputs
    });

    if (state.storeOutputAutomatically && outputs.length === 0) {
        state = updateProperties(state, { storeOutputAutomatically: false });
    }

    return state;
};

/**
 * merge the input/output assignments in original node with all of the input/output variables.
 * If the subflow has no outputs then the property storeOutputAutomatically is set to false.
 * @param {Object} state the original node
 * @param {FlowInputOutputVariablesVersion[]} inputOutputVariables the input/output variables
 * @return {Object} the updated node
 */
export const mergeWithInputOutputVariables = (state, inputOutputVariables) => {
    const { inputs, outputs } = mergeSubflowAssignmentsWithInputOutputVariables(
        state.inputAssignments,
        state.outputAssignments,
        inputOutputVariables
    );
    state = updateProperties(state, {
        inputAssignments: inputs,
        outputAssignments: outputs
    });

    if (state.storeOutputAutomatically && outputs.length === 0) {
        state = updateProperties(state, { storeOutputAutomatically: false });
    }

    return state;
};

/**
 * remove the unset parameters
 * @param {Object} state the original node
 * @return {Object} the updated node
 */
export const removeUnsetParameters = (state) => {
    const inputPropertyName = getNodeInputsPropertyName(state.elementType);
    const outputPropertyName = getNodeOutputsPropertyName(state.elementType);
    const inputs = state[inputPropertyName].filter(
        (input) => !isUndefinedOrNull(getValueFromHydratedItem(input.value))
    );
    const outputs = state[outputPropertyName].filter(
        (output) => !isUndefinedOrNull(getValueFromHydratedItem(output.value))
    );
    state = updateProperties(state, {
        [inputPropertyName]: inputs,
        [outputPropertyName]: outputs
    });
    return state;
};

const getAllIndexes = (arr, callback) => {
    const indexes = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i])) {
            indexes.push(i);
        }
    }
    return indexes;
};

const removeDuplicateWarningIfOnlyOneWithName = (state, isInput, name) => {
    const propertyName = isInput
        ? getNodeInputsPropertyName(state.elementType)
        : getNodeOutputsPropertyName(state.elementType);
    const indexesWithSameName = getAllIndexes(
        state[propertyName],
        (parameter) => getValueFromHydratedItem(parameter.name) === name
    );
    if (indexesWithSameName.length !== 1) {
        return state;
    }
    const paramIndex = indexesWithSameName[0];
    if (state[propertyName][paramIndex].warnings === undefined) {
        return state;
    }
    const warningIndex = state[propertyName][paramIndex].warnings.findIndex(
        (warning) => warning === MERGE_WARNING_TYPE.DUPLICATE
    );
    if (warningIndex === -1) {
        return state;
    }
    const updatedWarnings = deleteItem(state[propertyName][paramIndex].warnings, warningIndex);
    const updatedParam = updateProperties(state[propertyName][paramIndex], {
        warnings: updatedWarnings
    });
    const path = [[propertyName], paramIndex];
    state = set(state, path, updatedParam);
    return state;
};

/**
 * delete parameter item
 * @param {Object} state the original node
 * @param {Object} param the parameter that we want to update (see DeleteParameterItemEvent.detail)
 * @return {Object} the updated node
 */
export const deleteParameterItem = (state, param) => {
    const { rowIndex, isInput, name } = param;
    const propertyName = isInput
        ? getNodeInputsPropertyName(state.elementType)
        : getNodeOutputsPropertyName(state.elementType);
    const paramIndex = state[propertyName].findIndex(
        (parameter) => getValueFromHydratedItem(parameter.rowIndex) === rowIndex
    );
    const updatedParameters = deleteItem(state[propertyName], paramIndex);
    const path = [[propertyName]];
    state = set(state, path, updatedParameters);
    state = removeDuplicateWarningIfOnlyOneWithName(state, isInput, name);
    return state;
};

const removeOutputErrors = (state) => {
    const propertyName = getNodeOutputsPropertyName(state.elementType);
    const outputs = state[propertyName];
    outputs.forEach((output) => delete output.value);
    return state;
};

export const updateUseAdvancedOptionSelection = (state, { useAdvancedOptions }) => {
    state = removeOutputErrors(state);
    return updateProperties(state, {
        storeOutputAutomatically: !useAdvancedOptions
    });
};
