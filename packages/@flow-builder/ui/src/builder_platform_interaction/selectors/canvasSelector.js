import { createSelector } from 'builder_platform_interaction/storeLib';

const elementsSelector = state => state.elements;

const canvasElementsSelector = state => state.canvasElements;

/**
 * Transform canvas elements GUIDs to shape canvas expects
 * @param {Object} elements list of all the elements
 * @param {Object} canvasElements list of GUIDs of canvas elements
 * @return {Array} collection of canvas elements
 */
const getCanvasElements = (elements, canvasElements) =>
    canvasElements.reduce((acc, guid) => {
        const element = elements[guid];
        acc.push(element);
        return acc;
    }, []);

export const canvasSelector = createSelector(
    [elementsSelector, canvasElementsSelector],
    getCanvasElements
);
