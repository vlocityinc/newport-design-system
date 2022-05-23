// @ts-nocheck
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import {
    deleteItem,
    getValueFromHydratedItem,
    set,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import { MERGE_WARNING_TYPE } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { swapDevNamesToGuids } from 'builder_platform_interaction/translatorLib';
import { mergeInputOutputParameters } from './actionCallOrApexPluginParametersMerger';
import { mergeSubflowAssignmentsWithInputOutputVariables } from './subflowParametersMerger';

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
 *
 * @param {Object} state - the original node
 * @param {Object} param - the parameter that we want to update (see UpdateParameterItemEvent.detail)
 * @param {string} propertyName - the property name for the parameters field
 * @returns {Object} the updated node
 */
export const updateParameterItemByProperty = (state, param, propertyName) => {
    const { isInput, rowIndex, valueDataType, error } = param;
    let { value } = param;
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

/**
 * update parameter item
 *
 * @param {Object} state the original node
 * @param {Object} param the parameter that we want to update (see UpdateParameterItemEvent.detail)
 * @returns {Object} the updated node
 */
export const updateParameterItem = (state, param) => {
    const { isInput } = param;
    const propertyName = isInput
        ? getNodeInputsPropertyName(state.elementType)
        : getNodeOutputsPropertyName(state.elementType);
    return updateParameterItemByProperty(state, param, propertyName);
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
 *
 * @param {Object} state the original node
 * @param {ActionOrApexPluginInputOutputParameter[]} inputOutputParameters all of the action/apex plugin input/output parameters
 * @returns {Object} the updated node
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
 *
 * @param {Object} state the original node
 * @param {FlowInputOutputVariablesVersion[]} inputOutputVariables the input/output variables
 * @returns {Object} the updated node
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

export const removeUnsetParametersByProperty = (state, propertyName) => {
    const params = state[propertyName].filter((param) => !isUndefinedOrNull(getValueFromHydratedItem(param.value)));
    return updateProperties(state, {
        [propertyName]: params
    });
};

/**
 * remove the unset parameters
 *
 * @param {Object} state the original node
 * @returns {Object} the updated node
 */
export const removeUnsetParameters = (state) => {
    const inputPropertyName = getNodeInputsPropertyName(state.elementType);
    const outputPropertyName = getNodeOutputsPropertyName(state.elementType);
    // calls removeUnsetParametersByProperty() once to update the inputProperty and once to update the outputProperty
    const updatedInputsState = removeUnsetParametersByProperty(state, inputPropertyName);
    return removeUnsetParametersByProperty(updatedInputsState, outputPropertyName);
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

const removeDuplicateWarningIfOnlyOneWithName = (state, name, propertyName) => {
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
 *
 * @param state the original node
 * @param param the parameter that we want to delete (see DeleteParameterItemEvent.detail)
 * @param propertyName the property name for the parameters field
 * @returns the updated node
 */
export const deleteParameterItemByProperty = <T extends Object>(state: T, param, propertyName: String): T => {
    const { rowIndex, name } = param;
    const paramIndex = state[propertyName].findIndex(
        (parameter) => getValueFromHydratedItem(parameter.rowIndex) === rowIndex
    );
    const updatedParameters = deleteItem(state[propertyName], paramIndex);
    const path = [[propertyName]];
    state = set(state, path, updatedParameters);
    state = removeDuplicateWarningIfOnlyOneWithName(state, name, propertyName);
    return state;
};

/**
 * delete parameter item
 *
 * @param state the original node
 * @param param the parameter that we want to delete (see DeleteParameterItemEvent.detail)
 * @returns the updated node
 */
export const deleteParameterItem = <T extends Object>(state: T, param): T => {
    const propertyName = param?.isInput
        ? getNodeInputsPropertyName(state.elementType)
        : getNodeOutputsPropertyName(state.elementType);
    return deleteParameterItemByProperty(state, param, propertyName);
};

const removeOutputErrors = (state) => {
    const propertyName = getNodeOutputsPropertyName(state.elementType);
    const outputs = state[propertyName];
    outputs.forEach((output) => delete output.value);
    return state;
};

export const updateManuallyAssignVariables = (state, { useAdvancedOptions }) => {
    state = removeOutputErrors(state);
    return updateProperties(state, {
        storeOutputAutomatically: !useAdvancedOptions
    });
};
