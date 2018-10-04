import { generateGuid } from "builder_platform_interaction/storeLib";
import { getFlowDataType } from "builder_platform_interaction/dataTypeLib";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
/**
 * @typedef {ActionOrApexPluginInputOutputParameter} action call or apex plugin input/output parameter
 * @property {String} name parameter's name
 * @property {String} label parameter's label
 * @property {boolean} isInput true if parameter is input
 * @property {boolean} isOutput true if parameter is output
 * @property {boolean} isRequired true if parameter is required
 * @property {Number} maxOccurs the maximum occurances
 * @property {String} dataType the parameter's data type (this isn't a flow data type, but a SOAP type). See https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/field_types.htm and https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/primitive_data_types.htm
 * @property {String} description the parameter's description
 */

/**
* @typedef {Object} RowIndexed
* @property {String} rowIndex
*
* @typedef {ParameterItem & RowIndex} IndexedParameterItem
*/

/**
 * @typedef {InputOutputParameterItems} input and output parameter items
 * @property {ParameterItem[]} inputs the input parameter items (value must be hydrated)
 * @property {ParameterItem[]} outputs the output parameter items (value must be hydrated)
 */

/**
* @param {ActionOrApexPluginInputOutputParameter[]} inputOrOutputParameters - all input parameters or all output parameters
* @param {CalloutInputParameter[]|CalloutOutputParameter[]} nodeParameters - node's input parameters or node's output parameters
* @return {IndexedParameterItem[]} an array of IndexedParameterItem
*/
function mergeParameters(inputOrOutputParameters, nodeParameters) {
    const finalArray = [];
    // TODO: handle warning scenarios, for example, if deleting the parameter in apex plugin, but this parameter is already set in apex node.
    inputOrOutputParameters.forEach(paramInfo => {
        const {name, isInput, isRequired, maxOccurs, dataType, label} = paramInfo;
        const parameterItem = {name, isInput, isRequired, maxOccurs, label, dataType: getFlowDataType(dataType)};
        // find paramInfo that has the same name as nodeParam
        const nodeParamsFound = nodeParameters.filter(nodeParam => getValueFromHydratedItem(nodeParam.name) === paramInfo.name);
        // node output parameters can be duplicated, so nodeParamsFound can be > 1
        if (nodeParamsFound.length > 0) {
            nodeParamsFound.forEach(nodeParamFound => {
                finalArray.push(Object.assign({}, nodeParamFound, parameterItem));
            });
        } else {
            finalArray.push(Object.assign({rowIndex: generateGuid()}, parameterItem));
        }
    });
    return finalArray;
}

/**
 * Merge all the action call/apex plugin input/output parameters with the values from the input/output parameters of action call/apex plugin node
 *
 * @param {ActionOrApexPluginInputOutputParameter[]} allParameters all the action call/apex plugin input/output parameters
 * @param {CalloutInputParameter[]} nodeInputParameters the current node's input parameters, hydrated
 * @param {CalloutOutputParameter[]} nodeOutputParameters the current node's output parameters, hydrated
 * @return {InputOutputParameterItems} the input and output parameter items
 */
export function mergeInputOutputParameters(allParameters, nodeInputParameters, nodeOutputParameters) {
    const newParameters = {};
    newParameters.inputs = allParameters.filter(parameter => parameter.isInput === true);
    newParameters.outputs = allParameters.filter(parameter => parameter.isInput === false);
    if (nodeInputParameters) {
       newParameters.inputs = mergeParameters(newParameters.inputs, nodeInputParameters);
    }
    if (nodeOutputParameters) {
       newParameters.outputs = mergeParameters(newParameters.outputs, nodeOutputParameters);
    }
   return newParameters;
}