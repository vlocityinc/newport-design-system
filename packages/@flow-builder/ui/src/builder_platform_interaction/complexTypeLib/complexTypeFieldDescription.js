import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';
import { getParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { getFlowDataTypeByName } from 'builder_platform_interaction/screenEditorUtils';
import { getFlowDataType } from 'builder_platform_interaction/dataTypeLib';

/**
 * Get the extension parameter description as a complex type field description
 *
 * @param {object} extensionParamDescription - the extension parameter description as returned by describeExtensions
 * @returns {object} - the extension parameter description as a complex type field description (as expected by menudata or merge field validation)
 */
export function getExtensionParamDescriptionAsComplexTypeFieldDescription(
    extensionParamDescription
) {
    return {
        ...extensionParamDescription,
        dataType: getFlowDataTypeByName(extensionParamDescription.dataType),
        isCollection: extensionParamDescription.maxOccurs > 1
    };
}

/**
 * Get the invocable action parameter description as a complex type field description
 *
 * @param {object} invocableActionParamDescription - the invocable action parameter description as returned by getParametersForInvocableAction
 * @returns {object} - the invocable action parameter description as a complex type field description (as expected by menudata or merge field validation)
 */
export function getInvocableActionParamDescriptionAsComplexTypeFieldDescription(
    invocableActionParamDescription
) {
    return {
        ...invocableActionParamDescription,
        apiName: invocableActionParamDescription.name,
        dataType: getFlowDataType(invocableActionParamDescription.dataType),
        isCollection: invocableActionParamDescription.maxOccurs > 1,
        subtype:
            invocableActionParamDescription.sobjectType ||
            invocableActionParamDescription.apexClass
    };
}

/**
 * Get the automatic output parameters of the given resource (be an LC or an Action) if any
 * @param {Object} flowResource a flow resource
 * @returns {Array} raw parameters, some information might be missing (if apiName, dataType, isCollection or subtype are needed you might want to call getInvocableActionParamDescriptionAsComplexTypeFieldDescription on the returned parameters)
 */
export function getAutomaticOutputParameters(flowResource) {
    let automaticOutputParameters;
    if (flowResource.storeOutputAutomatically) {
        if (
            flowResource.dataType ===
            FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value
        ) {
            const extension = getCachedExtension(flowResource.extensionName, flowResource.dynamicTypeMappings);
            if (extension === undefined) {
                return undefined;
            }
            automaticOutputParameters = extension.outputParameters;
        } else if (
            flowResource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value
        ) {
            const parameters = getParametersForInvocableAction(flowResource);
            if (parameters === undefined) {
                return undefined;
            }
            automaticOutputParameters = parameters.filter(
                parameter => parameter.isOutput
            );
        }
    }
    return automaticOutputParameters;
}

/**
 * Returns true if flowResource is an element using automatic output handling without children
 *
 * @param {Object} flowResource the resource
 * @returns {boolean|undefined} true if it has no children, false if it has children or undefined if we don't know (fields not yet loaded)
 */
export function isAutomaticOutputElementWithoutChildren(flowResource) {
    if (!flowResource.storeOutputAutomatically) {
        return false;
    }
    const automaticOutputParameters = getAutomaticOutputParameters(
        flowResource
    );
    return automaticOutputParameters === undefined
        ? undefined
        : automaticOutputParameters.length === 0;
}

/**
 * Returns the fields for given complex resource (dataType SObject, apex, lightning component output or action output)
 *
 * @param {Object} flowResource the resource
 * @returns {Object} the fields descriptions as a complex type field descriptions (as expected by menudata or merge field validation). Undefined if it's not a complex type (e.g. primitive)
 */
export function retrieveResourceComplexTypeFields(flowResource) {
    let fields;
    if (flowResource.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        fields = sobjectLib.getFieldsForEntity(flowResource.subtype);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.APEX.value) {
        fields = apexTypeLib.getPropertiesForClass(flowResource.subtype);
    } else if (
        flowResource.dataType ===
        FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value
    ) {
        fields = getExtensionComplexTypeOutputFields(flowResource);
    } else if (flowResource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
        fields = getInvocableActionComplexTypeOutputFields(flowResource);
    }
    return fields;
}

function getExtensionComplexTypeOutputFields(flowResource) {
    const extensionName = flowResource.extensionName;
    const extension = getCachedExtension(
        extensionName.value || extensionName,
        flowResource.dynamicTypeMappings
    );
    const fields =
        extension &&
        extension.outputParameters.reduce((acc, parameter) => {
            acc[
                parameter.apiName
            ] = getExtensionParamDescriptionAsComplexTypeFieldDescription(
                parameter
            );
            return acc;
        }, {});
    return fields;
}

const isSingleAnonymousOutput = parameter => {
    return parameter.isSystemGeneratedOutput && parameter.maxOccurs === 1;
};

function getInvocableActionComplexTypeOutputFields({
    actionName,
    actionType,
    dataTypeMappings
}) {
    const parameters = getParametersForInvocableAction({
        actionName,
        actionType,
        dataTypeMappings
    });
    const fields =
        parameters &&
        parameters
            .filter(parameter => parameter.isOutput)
            .reduce((acc, parameter) => {
                if (isSingleAnonymousOutput(parameter)) {
                    acc =
                        parameter.dataType === 'sobject'
                            ? sobjectLib.getFieldsForEntity(
                                  parameter.sobjectType
                              )
                            : undefined;
                } else {
                    acc[
                        parameter.name
                    ] = getInvocableActionParamDescriptionAsComplexTypeFieldDescription(
                        parameter
                    );
                }
                return acc;
            }, {});
    return fields;
}
