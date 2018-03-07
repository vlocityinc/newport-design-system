import { REFERENCE_FIELDS, ELEMENT_INFOS, ELEMENT_INFO_ARRAY, FLOW_PROPERTIES } from "./translation-config";
import { omit, pick, updateProperties } from "builder_platform_interaction-data-mutation-lib";
import { deepCopy, isPlainObject } from "builder_platform_interaction-store-lib";

/**
 * Recursively replace GUIDs in references/templates with the dev name
 *
 * @param {Object} elementGUIDMap       map of dev names to GUIDs
 * @param {Object} object               the object in the flow tree to be converted
 */
export const swapGUIDsForDevNames = (elementGUIDMap, object) => {
    if (Array.isArray(object)) {
        object.forEach(element => {
            swapGUIDsForDevNames(elementGUIDMap, element);
        });
    } else if (isPlainObject(object)) {
        Object.keys(object).forEach(key => {
            const value = object[key];
            if (REFERENCE_FIELDS.has(key)) {
                // TODO Update this logic to account for constants, sobject fields, and mergeable flow fields
                // Part of a separate story...
                if (elementGUIDMap[value]) {
                    object[key] = elementGUIDMap[value].name;
                } else {
                    // Default don't replace - needed until we handle the ENTIRE flow
                    object[key] = value;
                }
            }
            swapGUIDsForDevNames(elementGUIDMap, value);
        });
    }
};

/**
 * Translate UI data model to Flow tooling object
 * @param {Object} uiModel UI data model representation of the Flow
 * @returns {Object} Flow object that can be deserialized into the Flow tooling object
 */
export function translateUIModelToFlow(uiModel) {
    const elements = deepCopy(Object.values(uiModel.elements));
    // Swap out guids for dev names in all element references
    swapGUIDsForDevNames(uiModel.elements, elements);

    // Construct Flow metadata object
    let metadata = {
    };

    // create empty collections for each element type
    ELEMENT_INFO_ARRAY.forEach(elementInfo => {
        metadata[elementInfo.metadataKey] = [];
    });

    Object.keys(elements).forEach(key => {
        let element = elements[key];
        const elementInfo = ELEMENT_INFOS[element.elementType];

        if (!elementInfo) {
            throw new Error('Unknown element type ' + element.elementType);
        }

        // remove transient fields to avoid breaking deserialization
        element = omit(element, ['guid', 'elementType', 'isCanvasElement', 'config']);
        if (element.connector) {
            element.connector = omit(element.connector, ['config']);
        }

        metadata[elementInfo.metadataKey].push(element);
    });

    metadata = updateProperties(metadata, pick(uiModel.properties, FLOW_PROPERTIES));

    if (uiModel.startElement !== null &&
         uiModel.elements[uiModel.startElement]) {
        metadata.startElementReference = uiModel.elements[uiModel.startElement].name;
    }

    return {
        metadata,
        fullName: uiModel.properties.fullName
    };
}
