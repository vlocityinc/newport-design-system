import { deepCopy, generateGuid, isPlainObject } from "builder_platform_interaction-store-lib";
import { REFERENCE_FIELDS, ELEMENT_INFO_ARRAY, FLOW_PROPERTIES } from "./translation-config";
import { pick } from "builder_platform_interaction-data-mutation-lib";

/**
 * Decorate the element with ui specific data
 * and data corresponding to it's element type )
 *
 * @param {Array} element            array of the elements
 * @param {String} elementType       type of element ex: assignment,
 * @param {boolean} isCanvasElement  indicator if the element shows on the canvas
 *
 * @returns {Object}                 decorated element
 */
export function convertElement(element, elementType, isCanvasElement) {
    // include transient fields
    element.elementType = elementType;
    element.isCanvasElement = isCanvasElement;

    if (element.isCanvasElement) {
        element.config = {isSelected:false};

        const connector = element.connector;

        if (connector) {
            connector.config = {isSelected: false};
            connector.jsPlumbConnector = {};
        }
    }
    return element;
}

/**
 * Generates a GUID and updates the GUID map
 * Add the given set of elements to the primary element map
 *
 * Decorates the element with it's element type, canvas status
 *
 * @param {Object} nameToGuid        map of dev names to GUIDs
 * @param {Array} elements           array of the elements
 * @param {String} elementType       type of element ex: assignment,
 * @param {boolean} isCanvasElement  indicator if the element shows on the canvas
 *
 * @returns {Object}                 map of guid -> elements
 */
export function convertElements(nameToGuid, elements, elementType, isCanvasElement) {
    const elementMap = {};

    elements.map(element => {
        return convertElement(element, elementType, isCanvasElement);
    }).forEach(element => {
        element.guid = generateGuid(elementType); // generates an id like assignment_00012
        nameToGuid[element.name] = element.guid;
        elementMap[element.guid] = element;
    });

    return elementMap;
}

/**
 * Traverse the flow tree and replace all devNames with GUIDs
 * Handles references and some "template" strings ex: "Hello {!userVar.name}"
 *
 * @param {Object} nameToGuid        map of dev names to GUIDs
 * @param {Object} object            the object in the flow tree to be converted
 */
export const swapDevNamesToGuids = (nameToGuid, object) => {
    if (Array.isArray(object)) {
        object.forEach(element => {
            swapDevNamesToGuids(nameToGuid, element);
        });
    } else if (isPlainObject(object)) {
        Object.keys(object).forEach(objectKey => {
            const value = object[objectKey];
            if (REFERENCE_FIELDS.has(objectKey)) {
                // TODO Update this logic to account for constants, sobject fields, and mergeable flow fields
                // TBD in another story
                if (value && nameToGuid[value]) {
                    object[objectKey] = nameToGuid[value];
                } else {
                    // Don't swap out missing keys, needed until we translate the entire flow
                    object[objectKey] = value;
                }
            }
            swapDevNamesToGuids(nameToGuid, value);
        });
    }
};


/**
 * Translate flow tooling object into UI data model
 * @param {Object} flow Flow tooling object
 * @returns {Object} UI representation of the Flow in a normalized shape
 */
export function translateFlowToUIModel(flow) {
    // All variable ids
    const variables = [];

    // All canvas element ids
    const canvasElements = [];

    const elements = {};

    let properties = {};
    const nameToGuid = {};

    flow = deepCopy(flow);

    // convert each type of element
    // ex: assignments, decision, variables
    ELEMENT_INFO_ARRAY.forEach(elementInfo => {
        const convertedElements = convertElements(nameToGuid,
            flow.metadata[elementInfo.metadataKey],
            elementInfo.elementType,
            elementInfo.canvasElement
        );
        Object.assign(elements, convertedElements);
    });

    // Construct arrays of all canvas element GUIDs and all variables GUIDs
    Object.values(elements).forEach(element => {
        if (element.isCanvasElement) {
            canvasElements.push(element.guid);
        } else {
            variables.push(element.guid);
        }
    });

    // Swap out dev names for guids in all element references
    swapDevNamesToGuids(nameToGuid, elements);

    // Construct flow properties object
    properties = pick(flow.metadata, FLOW_PROPERTIES);
    properties.fullName = flow.fullName;

    let startElement;
    if (flow.metadata.startElementReference !== null) {
        startElement = nameToGuid[flow.metadata.startElementReference];
    }

    return {
        elements,
        variables,
        canvasElements,
        properties,
        startElement
    };
}
