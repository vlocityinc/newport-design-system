import { createSelector } from 'builder_platform_interaction-store-lib';
import { pick } from 'builder_platform_interaction-data-mutation-lib';

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
    const newElement = pick(element, ['guid', 'elementType', 'description', 'label', 'locationX', 'locationY']);
    // TODO: pick doesn't support deep copy, so relying on object.assign. Need to fix it after pick support deepcopy
    newElement.connector = Object.assign({}, element.connector);
    acc.push(newElement);
    return acc;
}, []);

export const canvasSelector = createSelector([elementsSelector, canvasElementsSelector], getCanvasElements);