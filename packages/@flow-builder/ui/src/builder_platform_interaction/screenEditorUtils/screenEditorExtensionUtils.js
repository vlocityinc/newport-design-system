// @ts-nocheck
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';
import {
    describeExtensions,
    getCachedExtensions,
    EXTENSION_TYPE_SOURCE,
    getCachedExtensionType
} from 'builder_platform_interaction/flowExtensionLib';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { isExtensionField } from './screenEditorFieldTypeUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const DEFAULT_ATTRIBUTE_TYPE_ICON = 'utility:all';

/**
 * Makes sure
 * a) there is a data type mapping for each generic type
 * b) there are no other data type mappings
 * c) each data type mappings has a row index (for validation)
 * @param {DynamicTypeMappings} [dynamicTypeMappings]
 * @param {GenericType} [genericTypes]
 * @returns {DynamicTypeMapping}
 */
function setDynamicTypeMappings(genericTypes = [], dynamicTypeMappings = []) {
    if (!genericTypes || genericTypes.length === 0) {
        return undefined;
    }

    return genericTypes.map(genericType => {
        let dynamicTypeMapping;
        if (dynamicTypeMappings) {
            dynamicTypeMapping = dynamicTypeMappings.find(
                item => getValueFromHydratedItem(item.typeName) === genericType.name
            );
        }
        if (!dynamicTypeMapping) {
            dynamicTypeMapping = {
                typeName: {
                    value: genericType.name,
                    error: null
                },
                typeValue: {
                    value: '',
                    error: null
                },
                rowIndex: generateGuid()
            };
        } else if (!dynamicTypeMapping.rowIndex) {
            dynamicTypeMapping.rowIndex = generateGuid();
        }
        return dynamicTypeMapping;
    });
}

export function extendFlowExtensionScreenField(field) {
    if (!isExtensionField(field)) {
        throw new Error('Invalid screen flow extension field');
    }

    // Create/delete data type mappings based on generic types
    const dynamicTypeMappings = setDynamicTypeMappings(field.type.genericTypes, field.dynamicTypeMappings);
    if (dynamicTypeMappings && dynamicTypeMappings.length > 0) {
        field.dynamicTypeMappings = dynamicTypeMappings;
    } else if (field.dynamicTypeMappings) {
        delete field.dynamicTypeMappings;
    }

    return field;
}

/**
 * Replaces all local (temporary) extension field types with their server versions (if available) in every field in the provided screen.
 * Update dynamic type mappings to match generic types.
 * @param {object} screen - the screen
 * @returns {object} the processed screen
 */
export function processScreenExtensionTypes(screen) {
    const extensionFields = getAllChildExtensionFields(screen);
    for (const field of extensionFields) {
        if (field.type.source === EXTENSION_TYPE_SOURCE.LOCAL) {
            field.type = getCachedExtensionType(field.type.name);
            extendFlowExtensionScreenField(field);
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
    const extensionFields = getAllChildExtensionFields(screen);

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
            throw new Error('Can not find all required extension descriptions in the cache');
        } else {
            processFn(descs);
        }
    }
}

/**
 * returns all children of the provided parent that are of type extension
 *
 * @param {Object} parent - The object with child extension fields
 * @return {Array} extensionFields - Array of child fields
 */
function getAllChildExtensionFields(parent) {
    let extensionFields = [];
    parent.fields.forEach(field => {
        if (isExtensionField(field)) {
            extensionFields.push(field);
        } else if (field.fields && field.fields.length > 0) {
            extensionFields = [...extensionFields, ...getAllChildExtensionFields(field)];
        }
    });
    return extensionFields;
}

/**
 * Injects all required input parameters that are not present in the field.
 *
 * @param {screenfield} field - The extension screen field
 * @param {ExtensionDescription} description - The descriptor of the extension
 */
function addRequiredInputParameters(field, description) {
    for (const param of description.inputParameters) {
        if (param.isRequired && !param.hasDefaultValue) {
            if (!field.inputParameters.find(p => p.name.value === param.apiName)) {
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
