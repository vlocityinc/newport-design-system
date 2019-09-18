import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { describeExtension } from 'builder_platform_interaction/flowExtensionLib';
import { ResourceDetailsParametersConfig } from './resourceDetailsParametersConfig';

/**
 * Extension (ie: lightning component screenfield) output parameters fetching/mapping specifics
 */
class ResourceDetailsParametersExtensionConfig extends ResourceDetailsParametersConfig {
    fetch() {
        return (resourceGuid, callback) => {
            const resource = getElementByGuid(resourceGuid);
            if (!resource) {
                callback([], `No resource found for GUID: ${resourceGuid}`);
            } else {
                describeExtension(resource.extensionName)
                    .then(desc => {
                        callback(desc.outputParameters.map(super.map()));
                    })
                    .catch(error => callback([], error));
            }
        };
    }
}
export default new ResourceDetailsParametersExtensionConfig();
