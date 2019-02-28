import { generateGuid } from "builder_platform_interaction/storeLib";
import { getFlowDataType } from "builder_platform_interaction/dataTypeLib";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { MERGE_WARNING_TYPE } from './mergeWarningType';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

/**
 * Get as a map. Key is the variable name, value has properties parameter,
 * paramAssigments
 */
function getAsMap(actionParameters, nodeParameters) {
    const map = {};
    actionParameters.forEach(parameter => {
        map[parameter.name] = map[parameter.name] || {};
        map[parameter.name].parameter = parameter;
        map[parameter.name].paramAssigments = [];
    });
    nodeParameters.forEach(nodeParameter => {
        // there can be several assignments for a given parameter
        const nodeParameterName = getValueFromHydratedItem(nodeParameter.name);
        map[nodeParameterName] = map[nodeParameterName] || {};
        map[nodeParameterName].paramAssigments = map[nodeParameterName].paramAssigments || [];
        map[nodeParameterName].paramAssigments.push(nodeParameter);
    });
    return map;
}

/**
* @typedef {Object} WithWarnings
* @property {MERGE_WARNING_TYPE[]} warnings
*
* @typedef {ParameterItem & WithWarnings} ParameterItemWithWarnings
*/

/**
 * @typedef {ActionOrApexPluginInputOutputParameter} action call or apex plugin input/output parameter
 * @property {String} name parameter's name
 * @property {String} label parameter's label
 * @property {boolean} isInput true if parameter is input
 * @property {boolean} isOutput true if parameter is output
 * @property {boolean} isRequired true if parameter is required
 * @property {String} objectType the api name of sobject
 * @property {Number} maxOccurs the maximum occurances
 * @property {String} dataType the parameter's data type (this isn't a flow data type, but a SOAP type). See https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/field_types.htm and https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/primitive_data_types.htm
 * @property {String} description the parameter's description
 */

/**
 * @typedef {InputOutputParameterItems} input and output parameter items
 * @property {ParameterItemWithWarnings[]} inputs the input parameter items (value must be hydrated)
 * @property {ParameterItemWithWarnings[]} outputs the output parameter items (value must be hydrated)
 */

/**
* @param {ActionOrApexPluginInputOutputParameter[]} inputOrOutputParameters - all input parameters or all output parameters
* @param {CalloutInputParameter[]|CalloutOutputParameter[]} nodeParameters - node's input parameters or node's output parameters
* @return {ParameterItemWithWarnings[]} an array of ParameterItemWithWarnings
*/
function mergeParameters(inputOrOutputParameters, nodeParameters) {
    const finalArray = [];
    const allParameters = getAsMap(inputOrOutputParameters, nodeParameters);
    for (const [name, { parameter, paramAssigments }] of Object.entries(allParameters)) {
        let parameterItem = {name};
        if (parameter) {
            const {isRequired, maxOccurs, dataType, label, sobjectType, apexClass} = parameter;
            parameterItem = {name, isRequired, maxOccurs, label, dataType: dataType ? getFlowDataType(dataType) : FLOW_DATA_TYPE.APEX.value, subtype: sobjectType || apexClass};
        }
        if (paramAssigments.length > 0) {
            paramAssigments.forEach(nodeParameter => {
                const parameterItemWithWarning = Object.assign({}, nodeParameter, parameterItem);
                const warnings = getMergeWarnings(parameter, paramAssigments);
                if (warnings.length > 0) {
                    parameterItemWithWarning.warnings = warnings;
                }
                finalArray.push(parameterItemWithWarning);
            });
        } else {
            // assign the null value to the required parameters, so that validate.validateAll will throw an error if the required input parameter isn't set in new mode
            finalArray.push(Object.assign({rowIndex: generateGuid()}, parameterItem.isRequired ? {value: {value: null, error: null}} : {}, parameterItem));
        }
    }
    return finalArray;
}

function getMergeWarnings(parameter, paramAssigments) {
    const warnings = paramAssigments.length === 1 ? [] : [MERGE_WARNING_TYPE.DUPLICATE];
    if (!parameter) {
        warnings.push(MERGE_WARNING_TYPE.NOT_AVAILABLE);
    }
    return warnings;
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
    const inputParameters = allParameters.filter(parameter => parameter.isInput === true);
    const outputParameters = allParameters.filter(parameter => parameter.isInput === false);
    newParameters.inputs = mergeParameters(inputParameters, nodeInputParameters);
    newParameters.outputs = mergeParameters(outputParameters, nodeOutputParameters);
    return newParameters;
}