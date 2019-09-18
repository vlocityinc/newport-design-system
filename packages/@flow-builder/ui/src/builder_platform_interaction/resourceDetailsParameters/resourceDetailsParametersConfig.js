import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';

/**
 * Base class for fetch/map specifics in order to deal with automatic output parameters retrieval and formating (ie: mapping)
 */
export class ResourceDetailsParametersConfig {
    /**
     * @returns {Function} - Fetch function to retrieve parameters
     */
    fetch() {}
    /**
     * @returns {Function} - Map function for any fetched parameter
     */
    map() {
        return rawParameter => {
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
    }
}
