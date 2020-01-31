import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';

/**
 * @typedef {DynamicTypeMapping} Store representation of the dynamic type mapping.
 * @property {string|HydratedValue} typeName Generic type name.
 * @property {string|HydratedValue} typeValue Concrete type name.
 * @property {string} rowIndex Row index for the combobox
 *
 * @typedef {DynamicTypeMappingMetadataObject}
 * @property {string} typeName Generic type name
 * @property {string} typeValue Concrete type name
 */

/**
 * Makes a copy of the dynamic type mapping.
 * @param {DynamicTypeMapping|DynamicTypeMappingMetadataObject} dynamicTypeMapping Dynamic type mapping to clone.
 * @returns {DynamicTypeMapping}
 */
function createDynamicTypeMapping(dynamicTypeMapping) {
    const { typeName, typeValue, rowIndex } = dynamicTypeMapping;

    return {
        typeName,
        typeValue,
        rowIndex: rowIndex || generateGuid()
    };
}

export const createDynamicTypeMappings = dynamicTypeMappings =>
    dynamicTypeMappings ? dynamicTypeMappings.map(createDynamicTypeMapping) : undefined;

/**
 * Creates a dynamic type mapping metadata object from an internal representation
 * of the dynamic type mapping.
 * @param {DynamicTypeMapping[]} [dynamicTypeMappings]
 * @returns {DynamicTypeMappingMetadataObject|undefined}
 */
export const createDataTypeMappingsMetadataObject = dynamicTypeMappings =>
    dynamicTypeMappings && dynamicTypeMappings.length > 0
        ? dynamicTypeMappings.map(dynamicTypeMapping => ({
              typeName: getValueFromHydratedItem(dynamicTypeMapping.typeName),
              typeValue: getValueFromHydratedItem(dynamicTypeMapping.typeValue)
          }))
        : undefined;
