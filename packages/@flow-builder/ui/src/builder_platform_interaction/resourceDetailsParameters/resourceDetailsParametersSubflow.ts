// @ts-nocheck
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { labelComparator } from 'builder_platform_interaction/sortLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { fetchActiveOrLatestFlowOutputVariables } from 'builder_platform_interaction/subflowsLib';
import { ResourceDetailsParametersConfig } from './resourceDetailsParametersConfig';

/**
 * Subflow output parameters fetching/mapping specifics
 */
class ResourceDetailsParametersSubflowConfig extends ResourceDetailsParametersConfig {
    map() {
        return (rawParameter) => {
            if (!rawParameter) {
                return {};
            }
            return {
                apiName: rawParameter.apiName,
                label: rawParameter.apiName,
                description: rawParameter.description,
                typeIconName: getDataTypeIcons(rawParameter.dataType, 'utility')
            };
        };
    }
    fetch() {
        return (resourceGuid, callback) => {
            const resource = getElementByGuid(resourceGuid);
            if (!resource) {
                callback([], `No resource found for GUID: ${resourceGuid}`);
            } else {
                fetchActiveOrLatestFlowOutputVariables(resource.flowName)
                    .then((outputVariables) => {
                        callback(outputVariables.map(this.map()).sort(labelComparator));
                    })
                    .catch((error) => callback([], error));
            }
        };
    }
}
export default new ResourceDetailsParametersSubflowConfig();
