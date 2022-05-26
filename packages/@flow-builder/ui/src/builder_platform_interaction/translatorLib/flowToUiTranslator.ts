// @ts-nocheck
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import {
    createFlowProperties,
    findStartYOffset,
    INCOMPLETE_ELEMENT
} from 'builder_platform_interaction/elementFactory';
import {
    forEachMetadataFlowElement,
    getStartElementFromMetadata,
    isSystemElement,
    METADATA_KEY
} from 'builder_platform_interaction/flowMetadata';
import { swapDevNamesToUids } from './uidSwapping';

const NODE_LENGTH = 48;
const START_LENGTH = 300;
const RELEASE_226_DATE = new Date('2021-02-15T01:17:24.000+0000');
let START_Y_OFFSET;

/**
 * Get the flow startElementReference property if any
 *
 * @param {Object} flow current flow
 * @returns {string} flow startElementReference property or undefined if none
 */
export const getFlowStartElementReference = (flow) =>
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
        getFlowStartElementReference(flow),
        properties
    );

    let { storeElements = {} } = storeDataAndConfig;

    const { storeConnectors = [] } = storeDataAndConfig;

    const { translateX } = storeDataAndConfig;

    const { nameToGuid, canvasElementGuids, updatedElements } = updateCanvasElementGuidsAndNameToGuidMap(
        storeElements,
        translateX
    );

    storeElements = updatedElements;

    // Swap out dev names for guids in all element references and template fields
    swapDevNamesToUids(nameToGuid, {
        storeElements,
        storeConnectors,
        properties
    });

    return {
        elements: storeElements,
        connectors: storeConnectors,
        canvasElements: canvasElementGuids,
        properties
    };
}

/**
 * Helper function to update the store elements
 *
 * @param {Object} storeElements element map with guid as key and element as value
 * @param {Object} newElements new element to be added in the store elements
 * @returns {Object} updated store elements map
 */
function updateStoreElements(storeElements = {}, newElements = {}) {
    return Object.assign({}, storeElements, newElements);
}

/**
 * Helper function to update the connectors
 *
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
 *
 * @param {Object} elements - element map with guid as key and element as value
 * @param {number} translateX - amount by which elements need to be moved in the x-direction
 * @returns {Object} Object containing nameToGuid map, CanvasElementGuids array and updatedElements
 */
function updateCanvasElementGuidsAndNameToGuidMap(elements = {}, translateX = 0) {
    const elementGuids = Object.keys(elements),
        nameToGuid = {};
    let updatedElements = elements;
    let canvasElementGuids = [];
    for (let j = 0; j < elementGuids.length; j++) {
        const element = elements[elementGuids[j]];

        if (element.name && !isSystemElement(element.elementType)) {
            const devname = element.name.toLowerCase();
            nameToGuid[devname] = element.guid;
        }

        // Construct arrays of all canvas element guids
        if (element.isCanvasElement) {
            canvasElementGuids = [...canvasElementGuids, element.guid];

            const updatedElement = updateOverlappingFlowLocation(element, translateX);
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
 * updated if the flow originally had the start element metadata and was last modified before RELEASE_226_DATE
 *
 * @param {Object} element canvas element
 * @param {number} translateX amount by which elements need to be moved in the x-direction
 * @returns {Object} Returns the updated/original element
 */
function updateOverlappingFlowLocation(element = {}, translateX = 0) {
    if (isElementOverlappingStartElement(element, translateX)) {
        return updateCanvasElementLocation(element, translateX);
    }
    return element;
}

/**
 * Checks if the element is overlapping with the start element or not
 *
 * @param {Object} element canvas element
 * @param {number} translateX amount by which elements need to be moved in the x-direction
 * @returns {boolean} Returns boolean value telling if the element overlaps with the start element or not
 */
function isElementOverlappingStartElement(element = {}, translateX = 0) {
    return translateX > 0 && element && element.elementType && !isSystemElement(element.elementType);
}

/**
 * Updates the location of a given canvas element
 *
 * @param {Object} element canvas element
 * @param {number} translateX amount by which elements need to be moved in the x-direction
 * @returns {Object} Returns a new element with the updated location
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

/**
 * Helper function to return the top left and bottom right location of the start element box.
 *
 * @param locationX X location of start element
 * @param locationY Y location of start element
 * @param startElement Start element metadata
 */
const _getStartboxPoints = (locationX: number, locationY: number, startElement: object): object => {
    START_Y_OFFSET = findStartYOffset(startElement);
    const startFirstPoint = [locationX, locationY];
    const startEndPoint = [locationX + START_LENGTH, locationY + START_Y_OFFSET];
    return { startFirstPoint, startEndPoint };
};

/**
 * Helper function to return the top left and bottom right location of the element box.
 *
 * @param locationX X location of element
 * @param locationY Y location of element
 */
const _getElementboxPoints = (locationX: number, locationY: number): object => {
    const elementFirstPoint = [locationX, locationY];
    const elementEndPoint = [locationX + NODE_LENGTH, locationY + NODE_LENGTH];
    return { elementFirstPoint, elementEndPoint };
};

/**
 * Helper function to return the top middle and right middle location of the element box.
 *
 * @param locationX X location of element
 * @param locationY Y location of element
 * @returns the element box mid points
 */
const _getElementboxMidPoints = (locationX: number, locationY: number): object => {
    const elementMidTop = [locationX + NODE_LENGTH / 2, locationY];
    const elementMidRight = [locationX + NODE_LENGTH, locationY + NODE_LENGTH / 2];
    return { elementMidTop, elementMidRight };
};

/**
 * Helper function to return the left middle and bottom middle location of the start element box.
 *
 * @param locationX X location of start element
 * @param locationY Y location of start element
 */
const _getStartBoxMidPoints = (locationX: number, locationY: number): object => {
    const startMidLeft = [locationX, locationY + START_Y_OFFSET / 2];
    const startMidBottom = [locationX + START_LENGTH / 2, locationY + START_Y_OFFSET];
    return { startMidLeft, startMidBottom };
};

const _checkIfStartOverlapsCanvasElement = (
    canvasElementStartPoint: object,
    canvasElementEndPoint: object,
    startBoxFirstPoint: object,
    startBoxEndPoint: object
): boolean => {
    return !(
        canvasElementEndPoint[0] < startBoxFirstPoint[0] || // Canvas element is on the left of the box
        canvasElementStartPoint[0] > startBoxEndPoint[0] || // Canvas element is on the right of the box
        canvasElementEndPoint[1] < startBoxFirstPoint[1] || // Canvas element is on the top of the box
        canvasElementStartPoint[1] > startBoxEndPoint[1]
    ); // Canvas element is on the bottom of the box
};

/**
 * Helper function to loop over all the flow metadata elements and convert them to client side shape
 *
 * @param metadata flow metadata
 * @param startElementReference
 * @param properties flow properties
 * @returns Object containing updated storeConnectors, storeElements and translateX
 */
function createElementsUsingFlowMetadata(metadata: object, startElementReference: object, properties: object): object {
    const EXTRA_SPACING = 40;
    let lastModifiedDate;
    let startFirstPoint, startEndPoint;
    let targetReference = null;
    let targetReferenceLocation;
    let translateX = 0;

    if (properties && properties.lastModifiedDate) {
        lastModifiedDate = new Date(properties.lastModifiedDate);
    }
    let storeElements = {};
    let storeConnectors = [];
    const metadataKeyToFlowToUiFunctionMap = getMetadataKeyToFlowToUiFunctionMap();
    const metadataKeyList = Object.values(METADATA_KEY);

    if (!metadataKeyList) {
        throw new Error('Metadata does not have corresponding element array');
    }
    const areElementsIncomplete = (elements) =>
        Object.values(elements).some((element) => !!element[INCOMPLETE_ELEMENT]);
    // We need at least 2 passes because some element factory (ex : Loop) need to access another element
    // We need to wait until all nested elements finish the translation. (for example: loop on filter node, filter on filter node ....)
    const map = new Map();
    let incompleteElementsCount = 0,
        prevIncompleteElementsCount;
    do {
        prevIncompleteElementsCount = incompleteElementsCount;
        const previousPhaseElements = storeElements;
        const previousPhaseConnectors = storeConnectors;
        storeElements = {};
        storeConnectors = [];
        incompleteElementsCount = 0;
        // eslint-disable-next-line no-loop-func
        forEachMetadataFlowElement(metadata, startElementReference, (metadataElement, metadataKey) => {
            let elementsAndConnectors = map.get(metadataElement);
            if (!elementsAndConnectors || areElementsIncomplete(elementsAndConnectors.elements)) {
                // here
                if (lastModifiedDate < RELEASE_226_DATE && metadataElement) {
                    // Start element should always be first in loop
                    if (metadataKey === METADATA_KEY.START) {
                        ({ startFirstPoint, startEndPoint } = _getStartboxPoints(
                            metadataElement.locationX,
                            metadataElement.locationY,
                            metadataElement
                        ));
                        targetReference = metadataElement.connector && metadataElement.connector.targetReference;
                    } else {
                        // Getting the top left and bottom right points of canvas element
                        const { elementFirstPoint, elementEndPoint } = _getElementboxPoints(
                            metadataElement.locationX,
                            metadataElement.locationY
                        );
                        // Grabbing the location of start's target reference
                        if (targetReference && metadataElement.name && targetReference === metadataElement.name) {
                            targetReferenceLocation = elementFirstPoint;
                        }
                        // Checking for overlap on the start node
                        if (
                            startFirstPoint &&
                            _checkIfStartOverlapsCanvasElement(
                                elementFirstPoint,
                                elementEndPoint,
                                startFirstPoint,
                                startEndPoint
                            )
                        ) {
                            const xDifference = Math.abs(startEndPoint[0] - metadataElement.locationX) + EXTRA_SPACING;
                            if (xDifference > translateX) {
                                translateX = xDifference;
                            }
                        }
                    }
                }
                // end
                const elementFactoryFunction = metadataKeyToFlowToUiFunctionMap[metadataKey];
                if (metadataKey === METADATA_KEY.START) {
                    elementsAndConnectors = elementFactoryFunction(
                        metadataElement,
                        startElementReference,
                        metadata.processType
                    );
                } else {
                    elementsAndConnectors = elementFactoryFunction(metadataElement, {
                        elements: previousPhaseElements,
                        connectors: previousPhaseConnectors,
                        startElement: getStartElementFromMetadata(metadata, startElementReference)
                    });
                }
                map.set(metadataElement, elementsAndConnectors);
            }
            const { elements, connectors } = elementsAndConnectors;
            if (elements) {
                storeElements = updateStoreElements(storeElements, elements);
                // check if elements still incomplete
                if (areElementsIncomplete(elements)) {
                    incompleteElementsCount++;
                }
            }
            storeConnectors = updateStoreConnectors(storeConnectors, connectors);
        });
    } while (incompleteElementsCount > 0 && incompleteElementsCount !== prevIncompleteElementsCount);
    // If no overlap and there is a node connected to the start element
    if (translateX === 0 && targetReferenceLocation && startFirstPoint && lastModifiedDate < RELEASE_226_DATE) {
        translateX = bottomLeftOfStartXTranslate(targetReferenceLocation, startFirstPoint, startEndPoint);
    }

    return {
        storeConnectors,
        storeElements,
        translateX
    };
}

/**
 * Helper function that determines if the connected element to the start node is underneath with a left emitting connector
 * If underneath and left connector then translate in the X direction so that it is directly underneath the start.
 *
 * @param targetReferenceLocation Location of the connected element
 * @param startFirstPoint Top left position of the start element
 * @param startEndPoint Bottom right possition of the start element
 */
function bottomLeftOfStartXTranslate(
    targetReferenceLocation: object,
    startFirstPoint: object,
    startEndPoint: object
): number {
    const { elementMidTop, elementMidRight } = _getElementboxMidPoints(
        targetReferenceLocation[0],
        targetReferenceLocation[1]
    );
    const { startMidLeft, startMidBottom } = _getStartBoxMidPoints(startFirstPoint[0], startFirstPoint[1]);
    if (
        targetReferenceLocation[1] > startEndPoint[1] &&
        Math.abs(targetReferenceLocation[0] - startFirstPoint[0]) < NODE_LENGTH &&
        Math.abs(targetReferenceLocation[1] - startEndPoint[1]) < NODE_LENGTH &&
        !isAlreadyBottomConnected(elementMidTop, elementMidRight, startMidLeft, startMidBottom)
    ) {
        return startFirstPoint[0] - targetReferenceLocation[0] + START_LENGTH / 2 - NODE_LENGTH / 2;
    }
    return 0;
}
/**
 * Helper function that determines if the connected element to the start node is bottom connected.
 * Assumed that the element is always underneath and to the left of the start node.
 *
 * @param elementMidTop Top middle point of the element connect to the start node
 * @param elementMidRight Middle right point of the element connect to the start node
 * @param startMidLeft Start node's middle left point
 * @param startMidBottom Start node's middle bottom point
 */
function isAlreadyBottomConnected(
    elementMidTop: object,
    elementMidRight: object,
    startMidLeft: object,
    startMidBottom: object
): boolean {
    // start left to element top
    const a = elementMidTop[0] - startMidLeft[0];
    const b = elementMidTop[1] - startMidLeft[1];
    const distance = Math.hypot(a, b);
    // start bottom to element top
    const a2 = elementMidTop[0] - startMidBottom[0];
    const b2 = elementMidTop[1] - startMidBottom[1];
    const distance2 = Math.hypot(a2, b2);
    // start bottom to element right
    const a3 = elementMidRight[0] - startMidBottom[0];
    const b3 = elementMidRight[1] - startMidBottom[1];
    const distance3 = Math.hypot(a3, b3);
    // start left to element right
    const a4 = elementMidRight[0] - startMidLeft[0];
    const b4 = elementMidRight[1] - startMidLeft[1];
    const distance4 = Math.hypot(a4, b4);

    return (distance2 < distance && distance2 < distance4) || (distance3 < distance && distance2 < distance4);
}

/**
 * Helper function to create a map with key as metadataKey and value as flowToUi function
 * and ignore element type with metadataKey. Eg: flow properties, start etc
 *
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
