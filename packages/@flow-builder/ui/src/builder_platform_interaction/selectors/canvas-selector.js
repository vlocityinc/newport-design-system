import { createSelector } from 'builder_platform_interaction-store-lib';

const elementsSelector = (state) => state.elements;

const canvasElementsSelector = (state) => state.canvasElements;

/**
 * Transform canvas elements guids to shape canvas expects
 * @param {Object} elements list of all the elements
 * @param {Object} canvasElements list of guids of canvas elements
 * @return {Array} collection of canvas elements
 */
const getCanvasElements = (elements, canvasElements) => canvasElements.reduce((acc, guid) => {
    const element = elements[guid];
    const newElement = {};
    newElement.guid = element.guid;
    newElement.elementType = element.elementType;
    newElement.description = element.description;
    newElement.label = element.label;
    newElement.locationX = element.locationX;
    newElement.locationY = element.locationY;
    acc.push(newElement);
    return acc;
}, []);

export const canvasSelector = createSelector([elementsSelector, canvasElementsSelector], getCanvasElements);