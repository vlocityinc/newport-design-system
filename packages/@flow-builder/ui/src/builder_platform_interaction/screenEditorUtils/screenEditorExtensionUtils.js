import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import {
    getAllCachedExtensionTypes,
    describeExtensions,
    getCachedExtensions,
    COMPONENT_INSTANCE,
    EXTENSION_TYPE_SOURCE
} from 'builder_platform_interaction/flowExtensionLib';

const DEFAULT_ATTRIBUTE_TYPE_ICON = 'utility:all';

/**
 * Replaces all local (temporary) extension field types with their server versions (if available) in every field in the provided screen
 * @param {object} screen - the screen
 * @returns {object} the processed screen
 */
export function processScreenExtensionTypes(screen) {
    for (const field of screen.fields) {
        if (
            field.fieldType === COMPONENT_INSTANCE &&
            field.type.source === EXTENSION_TYPE_SOURCE.LOCAL
        ) {
            const extensionTypes = getAllCachedExtensionTypes();
            for (const type of extensionTypes) {
                if (type.name === field.type.name) {
                    field.type = type;
                    break;
                }
            }
        }
    }

    return screen;
}

/**
 * Adds all required and not present input parameters to all extension fields in the screen. If a callback is provided it will
 * go to the server to retrieve the descriptions in case they are not in the cache
 *
 * @param {Screen} screen - The screen
 * @param {Function} callback - The callback to execute when done (can be null)
 */
export function processRequiredParamsForExtensionsInScreen(screen, callback) {
    // Get all extension fields
    const extensionFields = screen.fields.filter(
        f => f.fieldType === COMPONENT_INSTANCE
    );

    // Get the extension names
    const extensions = extensionFields.map(f => f.extensionName.value);

    const processFn = descriptions => {
        // Create a map field.name = field
        const fieldsMap = extensionFields.reduce((map, field) => {
            map[field.extensionName.value] = field;
            return map;
        }, {});

        // For each descriptor add all required attributes not present to the field
        for (const description of descriptions) {
            // Add all required attributes not present in input params
            const field = fieldsMap[description.name];
            addRequiredInputParameters(field, description);
        }
    };

    if (callback) {
        // Async, go to server if necessary
        // Get the descriptions
        describeExtensions(extensions)
            .then(descs => {
                processFn(descs);
                callback({ screen });
            })
            .catch(error => callback({ error: error.message }));
    } else {
        // Use cached descriptors
        const descs = getCachedExtensions(extensions);
        if (descs.length !== extensions.length) {
            throw new Error(
                'Can not find all required extension descriptions in the cache'
            );
        } else {
            processFn(descs);
        }
    }
}

/**
 * Injects all required input parameters that are not present in the field.
 *
 * @param {screenfield} field - The extension screen field
 * @param {ExtensionDescription} description - The descriptor of the extension
 */
export function addRequiredInputParameters(field, description) {
    for (const param of description.inputParameters) {
        if (param.isRequired && !param.hasDefaultValue) {
            if (
                field.inputParameters.filter(
                    p => p.name.value === param.apiName
                ).length === 0
            ) {
                // Param is not present
                field.inputParameters.push({
                    name: { value: param.apiName, error: null },
                    value: { value: null, error: null },
                    processMetadataValues: {}
                });
            }
        }
    }
}

/**
 * Returns the icon for the type of the specified parameter.
 *
 * @param {Object} type - The parameter type
 * @returns {String} - The icon name
 */
export function getIconForParameter(type) {
    return getDataTypeIcons(type, 'utility') || DEFAULT_ATTRIBUTE_TYPE_ICON;
}
