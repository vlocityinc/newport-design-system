import { set, getValueFromHydratedItem, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { mergeInputOutputParameters } from './calloutEditorLib';

export const MERGE_WITH_PARAMETERS = 'MERGE_WITH_PARAMETERS';
export const REMOVE_UNSET_PARAMETERS = 'REMOVE_UNSET_PARAMETERS';

/**
 * update parameter item
 * @param {Object} node the original node
 * @param {Object} param the parameter that we want to update (see UpdateParameterItemEvent.detail)
 * @return {Object} the updated node
 */
export const updateParameterItem = (node, param) => {
    const {isInput, rowIndex, value, valueDataType, error} = param;
    const propertyName = isInput ? 'inputParameters' : 'outputParameters';
    const paramIndex = node[propertyName].findIndex(parameter => getValueFromHydratedItem(parameter.rowIndex) === rowIndex);
    const updatedParam = updateProperties(node[propertyName][paramIndex], {value: {value, error}, valueDataType});
    const path = [[propertyName], paramIndex];
    node = set(node, path, updatedParam);
    return node;
};

/**
 * merge the input/output parameters in original node with all of the action/apex plugin input/output parameters
 * @param {Object} node the original node
 * @param {ActionOrApexPluginInputOutputParameter[]} inputOutputParameters all of the action/apex plugin input/output parameters
 * @return {Object} the updated node
 */
export const mergeWithInputOutputParameters = (node, inputOutputParameters) => {
    const { inputs, outputs } = mergeInputOutputParameters(inputOutputParameters, node.inputParameters, node.outputParameters);
    node = updateProperties(node, {inputParameters: inputs, outputParameters : outputs});
    return node;
};

/**
 * remove the unset parameters
 * @param {Object} node the original node
 * @return {Object} the updated node
 */
export const removeUnsetParameters = (node) => {
    const inputParameters = node.inputParameters.filter(inputParameter => !isUndefinedOrNull(getValueFromHydratedItem(inputParameter.value)));
    const outputParameters = node.outputParameters.filter(outputParameter => !isUndefinedOrNull(getValueFromHydratedItem(outputParameter.value)));
    node = updateProperties(node, {inputParameters, outputParameters });
    return node;
};