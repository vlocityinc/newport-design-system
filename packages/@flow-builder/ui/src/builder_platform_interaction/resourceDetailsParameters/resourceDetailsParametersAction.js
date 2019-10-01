import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { fetchParametersForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { labelComparator } from 'builder_platform_interaction/sortLib';
import { ResourceDetailsParametersConfig } from './resourceDetailsParametersConfig';

/**
 * Action output parameters fetching/mapping specifics (apex actions, core actions)
 */
class ResourceDetailsParametersActionConfig extends ResourceDetailsParametersConfig {
    map() {
        return rawParameter => {
            if (!rawParameter) {
                return {};
            }
            return {
                apiName: rawParameter.name,
                label: rawParameter.label || rawParameter.name,
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
                fetchParametersForInvocableAction(resource, {
                    disableErrorModal: true,
                    background: true
                })
                    .then((params = []) => {
                        callback(
                            params
                                .filter(parameter => parameter.isOutput)
                                .map(this.map())
                                .sort(labelComparator)
                        );
                    })
                    .catch(error => callback([], error));
            }
        };
    }
}
export default new ResourceDetailsParametersActionConfig();
