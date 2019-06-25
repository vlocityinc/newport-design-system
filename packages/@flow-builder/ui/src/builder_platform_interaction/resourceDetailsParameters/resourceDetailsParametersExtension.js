import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { describeExtension } from 'builder_platform_interaction/screenEditorUtils';

/**
 * Parameters adapter used to meet the following expected shape:
 *      {apiName, label, description, typeIconName}
 *
 * @param {Object} rawParameter parameter as returned by the server call
 * @returns shaped parameter
 */
const mapperExtensionOutputParameter = rawParameter => {
    if (!rawParameter) {
        return {};
    }
    return {
        apiName: rawParameter.apiName,
        label: rawParameter.label,
        description: rawParameter.description,
        typeIconName: getDataTypeIcons(rawParameter.dataType, 'utility')
    };
};

/**
 * Fetch extension (ie: Lightning component) output parameters parameters
 * @param {String} resourceGuid - resource GUID (used in the current store)
 * @param {Function} callback - The callback to execute to notify, fn(data, error)
 */
const fetchExtensionOutputParameters = (resourceGuid, callback) => {
    const resource = getElementByGuid(resourceGuid);
    if (!resource) {
        callback([], `No resource found for GUID: ${resourceGuid}`);
    } else {
        describeExtension(resource.extensionName)
            .then(desc => {
                callback(
                    desc.outputParameters.map(parameter => ({
                        apiName: parameter.apiName,
                        label: parameter.label,
                        description: parameter.description,
                        dataType: parameter.dataType
                    }))
                );
            })
            .catch(error => callback([], error));
    }
};

/**
 * Extension (ie: Lightning component) screenfield parameters fetching configuration
 */
export const LIGHTNING_COMPONENT_PARAMETERS_RETRIEVAL_CONFIGURATION = {
    [ELEMENT_TYPE.SCREEN_FIELD]: {
        fetch: fetchExtensionOutputParameters,
        mapper: mapperExtensionOutputParameter
    }
};
