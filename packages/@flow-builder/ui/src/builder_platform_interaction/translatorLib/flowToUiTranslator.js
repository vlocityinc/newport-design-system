// @ts-nocheck
import { swapDevNamesToUids } from './uidSwapping';
import {
    ELEMENT_TYPE,
    METADATA_KEY,
    isSystemElement,
    forEachMetadataFlowElement
} from 'builder_platform_interaction/flowMetadata';
import { createFlowProperties, INCOMPLETE_ELEMENT } from 'builder_platform_interaction/elementFactory';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { useFixedLayoutCanvas, setUseFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';
import { convertToFlc, isFixedLayoutCanvas } from 'builder_platform_interaction/flcConversionUtils';

/**
 * Get the flow startElementReference property if any
 * @param {Object} flow current flow
 * @returns {string} flow startElementReference property or undefined if none
 */
export const getFlowStartElementReference = flow =>
    flow.startElementReference || (flow.metadata && flow.metadata.startElementReference) || undefined;

/**
 * Translate flow tooling object into UI data model
 *
 * @param {Object} flow Flow tooling object or Metadata flow object
 * @returns {Object} UI representation of the Flow in a normalized shape
 */
export function translateFlowToUIModel(flow) {
    // Construct flow properties object
    const properties = createFlowProperties(flow);

    // Create elements, connectors and location translation config from flow Metadata
    const storeDataAndConfig = createElementsUsingFlowMetadata(
        flow.metadata || flow,
        getFlowStartElementReference(flow)
    );

    let { storeElements = {} } = storeDataAndConfig;

    // TODO: FLC TEMP CODE
    const startElement = Object.values(storeElements).find(ele => ele.elementType === ELEMENT_TYPE.START_ELEMENT);

    if (startElement) {
        setUseFixedLayoutCanvas(isFixedLayoutCanvas(startElement));
    }

    const { storeConnectors = [] } = storeDataAndConfig;

    const { translateX } = storeDataAndConfig;

    const { nameToGuid, canvasElementGuids, updatedElements } = updateCanvasElementGuidsAndNameToGuidMap(
        storeElements,
        translateX,
        properties
    );

    storeElements = updatedElements;

    // Swap out dev names for guids in all element references and template fields
    swapDevNamesToUids(nameToGuid, {
        storeElements,
        storeConnectors,
        properties
    });

    if (useFixedLayoutCanvas()) {
        convertToFlc({ connectors: storeConnectors, elements: storeElements, canvasElements: canvasElementGuids });
    }

    return {
        elements: storeElements,
        connectors: storeConnectors,
        canvasElements: canvasElementGuids,
        properties
    };
}

/**
 * Helper function to update the store elements
 * @param {Object} storeElements element map with guid as key and element as value
 * @param {Object} newElements new element to be added in the store elements
 * @returns {Object} updated store elements map
 */
function updateStoreElements(storeElements = {}, newElements = {}) {
    return Object.assign({}, storeElements, newElements);
}

/**
 * Helper function to update the connectors
 * @param {Array} storeConnectors array of connectors
 * @param {Array} newConnectors array of new connectors to be added
 * @returns {Array} new array of updated connectors
 */
function updateStoreConnectors(storeConnectors = [], newConnectors = []) {
    return [...storeConnectors, ...newConnectors];
}

/**
 * Helper function to loop over storeElements and create devnameToGuid map and canvasElementsGuids array.
 * Also updates the location of the canvas elements if needed.
 * @param {Object} elements element map with guid as key and element as value
 * @param {Number} translateX amount by which elements need to be moved in the x-direction
 * @param {Object} properties flowProperties of a given flow
 * @return {Object} Object containing nameToGuid map, CanvasElementGuids array and updatedElements
 */
function updateCanvasElementGuidsAndNameToGuidMap(elements = {}, translateX = 0, properties = {}) {
    const elementGuids = Object.keys(elements),
        nameToGuid = {};
    let updatedElements = elements;
    let canvasElementGuids = [];
    for (let j = 0; j < elementGuids.length; j++) {
        const element = elements[elementGuids[j]];

        if (!isSystemElement(element.elementType)) {
            const devname = element.name.toLowerCase();
            nameToGuid[devname] = element.guid;
        }

        // Construct arrays of all canvas element guids
        if (element.isCanvasElement) {
            canvasElementGuids = [...canvasElementGuids, element.guid];

            const updatedElement = updateOverlappingCFDFlowLocation(element, translateX, properties);
            updatedElements = updateStoreElements(updatedElements, {
                [updatedElement.guid]: updatedElement
            });
        }
    }

    return {
        nameToGuid,
        canvasElementGuids,
        updatedElements
    };
}

/**
 * Updates the location of the canvas element if any element is overlapping with the start element. The location is only
 * updated if the flow originally came from CFD and has never been saved in Flow Builder
 * @param {Object} element canvas element
 * @param {Number} translateX amount by which elements need to be moved in the x-direction
 * @param {Object} properties flowProperties of a given flow
 * @return {Object} Returns the updated/original element
 */
function updateOverlappingCFDFlowLocation(element = {}, translateX = 0, properties = {}) {
    if (isElementOverlappingStartElement(element, translateX, properties)) {
        return updateCanvasElementLocation(element, translateX);
    }
    return element;
}

/**
 * Checks if the element is overlapping with the start element or not
 * @param {Object} element canvas element
 * @param {Number} translateX amount by which elements need to be moved in the x-direction
 * @param {Object} properties flowProperties of a given flow
 * @return {Boolean} Returns boolean value telling if the element overlaps with the start element or not
 */
function isElementOverlappingStartElement(element = {}, translateX = 0, properties = {}) {
    return (
        translateX > 0 &&
        properties &&
        !properties.isLightningFlowBuilder &&
        element &&
        element.elementType &&
        !isSystemElement(element.elementType)
    );
}

/**
 * Updates the location of a given canvas element
 * @param {Object} element canvas element
 * @param {Number} translateX amount by which elements need to be moved in the x-direction
 * @return {Object} Returns a new element with the updated location
 */
function updateCanvasElementLocation(element = {}, translateX = 0) {
    if (element && element.hasOwnProperty('locationX')) {
        const newLocationX = element.locationX + translateX;

        return Object.assign({}, element, {
            locationX: newLocationX
        });
    }
    return element;
}

function getTranslateX(metadata) {
    const EXTRA_SPACING = 180;
    let minX = EXTRA_SPACING;
    forEachMetadataFlowElement(metadata, metadataElement => {
        if (metadataElement && metadataElement.locationX < minX && metadataElement.locationY < EXTRA_SPACING) {
            minX = metadataElement.locationX;
        }
    });
    const translateX = EXTRA_SPACING - minX;
    return translateX;
}

/**
 * Helper function to loop over all the flow metadata elements and convert them to client side shape
 * @param {Object} metadata flow metadata
 * @returns {Object} Object containing updated storeConnectors, storeElements and translateX
 */
function createElementsUsingFlowMetadata(metadata, startElementReference) {
    let storeElements = {};
    let storeConnectors = [];
    const metadataKeyToFlowToUiFunctionMap = getMetadataKeyToFlowToUiFunctionMap();
    const metadataKeyList = Object.values(METADATA_KEY);

    if (!metadataKeyList) {
        throw new Error('Metadata does not have corresponding element array');
    }
    const areElementsIncomplete = elements => Object.values(elements).some(element => !!element[INCOMPLETE_ELEMENT]);
    // We need 2 passes because some element factory (ex : Loop) need to access another element
    const map = new Map();
    for (let pass = 0; pass < 2; pass++) {
        const previousPhaseElements = storeElements;
        const previousPhaseConnectors = storeConnectors;
        storeElements = {};
        storeConnectors = [];
        // eslint-disable-next-line no-loop-func
        forEachMetadataFlowElement(metadata, (metadataElement, metadataKey) => {
            let elementsAndConnectors = map.get(metadataElement);
            if (!elementsAndConnectors || areElementsIncomplete(elementsAndConnectors.elements)) {
                const elementFactoryFunction = metadataKeyToFlowToUiFunctionMap[metadataKey];
                elementsAndConnectors =
                    metadataKey === METADATA_KEY.START
                        ? elementFactoryFunction(metadataElement, startElementReference)
                        : elementFactoryFunction(metadataElement, {
                              elements: previousPhaseElements,
                              connectors: previousPhaseConnectors
                          });
                map.set(metadataElement, elementsAndConnectors);
            }
            const { elements, connectors } = elementsAndConnectors;
            if (elements) {
                storeElements = updateStoreElements(storeElements, elements);
            }
            storeConnectors = updateStoreConnectors(storeConnectors, connectors);
        });
    }

    const translateX = getTranslateX(metadata);

    return {
        storeConnectors,
        storeElements,
        translateX
    };
}

/**
 * Helper function to create a map with key as metadataKey and value as flowToUi function
 * and ignore element type with metadataKey. Eg: flow properties, start etc
 * @returns {Object} map containing key as metadataKey and value as flowToUi function
 */
function getMetadataKeyToFlowToUiFunctionMap() {
    return Object.keys(elementTypeToConfigMap).reduce((acc, elementTypeKey) => {
        const { metadataKey, factory } = elementTypeToConfigMap[elementTypeKey];
        if (!metadataKey || !factory) {
            return acc;
        }
        const { flowToUi } = factory;
        return Object.assign(acc, {
            [metadataKey]: flowToUi
        });
    }, {});
}
