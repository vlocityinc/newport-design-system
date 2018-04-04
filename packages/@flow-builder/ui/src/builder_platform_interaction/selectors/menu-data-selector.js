import { createSelector } from 'builder_platform_interaction-store-lib';

const elementsSelector = (state) => state.elements;
const variablesSelector = (state) => state.variables;
const canvasElementsSelector = (state) => state.canvasElements;

const getElements = (elements, guids) => guids.reduce((acc, guid) => {
    acc.push(elements[guid]);
    return acc;
}, []);

const getWritableElements = (elements, variables) => {
    const writableElementGuids = [...variables];
    return getElements(elements, writableElementGuids);
};

const getReadableElements = (elements, variables, canvasElements) => {
    const readableElementGuids = [...variables, ...canvasElements];
    return getElements(elements, readableElementGuids);
};

export const writableElementsSelector = createSelector([elementsSelector, variablesSelector], getWritableElements);
export const readableElementsSelector = createSelector([elementsSelector, variablesSelector, canvasElementsSelector], getReadableElements);