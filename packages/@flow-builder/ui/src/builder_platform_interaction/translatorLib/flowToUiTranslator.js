import { ELEMENT_INFOS } from "./translationConfig";
import { swapDevNamesToUids } from "./uidSwapping";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { flowToUIFactory } from "./flowToUiFactory";
import { createStartElementWithConnectors } from "builder_platform_interaction/elementFactory";

/**
 * Translate flow tooling object into UI data model
 *
 * @param {Object} flow Flow tooling object
 * @returns {Object} UI representation of the Flow in a normalized shape
 */
export function translateFlowToUIModel(flow) {
    const storeElements = {};
    const storeConnectors = [];

    // Map of element dev names to guids
    const nameToGuid = {};

    // All canvas element ids
    const canvasElements = [];

    // Create start element
    const startElement  = createStartElementWithConnectors(flow.metadata.startElementReference);
    Object.assign(storeElements, startElement.elements);
    storeConnectors.push(...startElement.connectors);
    const startElementGuid = Object.keys(startElement.elements)[0];
    canvasElements.push(startElementGuid);

    // Convert each type of element ex: assignments, decisions, variables
    const elementTypes = Object.keys(ELEMENT_INFOS);
    for (let typeIndex = 0; typeIndex < elementTypes.length; typeIndex++) {
        const elementType = elementTypes[typeIndex];
        const elementInfo = ELEMENT_INFOS[elementType];
        let metadataElements = flow.metadata[elementInfo.metadataKey];
        if (metadataElements) {
            if (elementInfo.metadataFilter) {
                // several element types for the same metadataKey (for actionCalls : ACTION_CALL, APEX_CALL, EMAIL_ALERT ...)
                metadataElements = metadataElements.filter(
                    elementInfo.metadataFilter
                );
            }
            for (let i = 0; i < metadataElements.length; i++) {
                const metadataElement = metadataElements[i];
                const { elements, connectors } = flowToUIFactory(elementType, metadataElement);
                if (elements) {
                    const elementGuids = Object.keys(elements);
                    for (let j = 0; j < elementGuids.length; j++) {
                        const element = elements[elementGuids[j]];
                        nameToGuid[element.name] = element.guid;
                        // Generate master element map of guid to elements
                        storeElements[element.guid] = element;
                        // Construct arrays of all canvas element and variable guids
                        if (element.isCanvasElement) {
                            canvasElements.push(element.guid);
                        }
                    }
                }
                if (connectors && connectors.length > 0) {
                    storeConnectors.push(...connectors);
                }
            }
        }
    }

    // Swap out dev names for guids in all element references
    swapDevNamesToUids(nameToGuid, storeElements);
    swapDevNamesToUids(nameToGuid, storeConnectors);

    // Construct flow properties object
    const properties = flowToUIFactory(ELEMENT_TYPE.FLOW_PROPERTIES, flow);

    return {
        elements: storeElements,
        connectors: storeConnectors,
        canvasElements,
        properties
    };
}