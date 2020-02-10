import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    getSubflowVariableLabelWithWarning,
    fetchMergedFlowOutputVariables
} from 'builder_platform_interaction/subflowsLib';
import { ResourceDetailsParametersConfig } from './resourceDetailsParametersConfig';
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { labelComparator } from 'builder_platform_interaction/sortLib';

/**
 * Subflow output parameters fetching/mapping specifics
 */
class ResourceDetailsParametersSubflowConfig extends ResourceDetailsParametersConfig {
    map() {
        return rawParameter => {
            if (!rawParameter) {
                return {};
            }
            return {
                apiName: rawParameter.apiName,
                label: getSubflowVariableLabelWithWarning(rawParameter),
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
                fetchMergedFlowOutputVariables(resource.flowName)
                    .then(outputVariables => {
                        callback(outputVariables.map(this.map()).sort(labelComparator));
                    })
                    .catch(error => callback([], error));
            }
        };
    }
}
export default new ResourceDetailsParametersSubflowConfig();
