import { createSelector } from 'builder_platform_interaction-store-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

const elementsSelector = (state) => state.elements;
const resourcesSelector = (state) => state.resources;
const canvasElementsSelector = (state) => state.canvasElements;
let dataTypeSelector;

const getElements = (elements, guids) => guids.reduce((acc, guid) => {
    acc.push(elements[guid]);
    return acc;
}, []);

const getWritableElements = (elements, resources) => {
    const writableElementGuids = resources.filter(guid => elements[guid].elementType === ELEMENT_TYPE.VARIABLE);
    return getElements(elements, writableElementGuids);
};

const getReadableElements = (elements, resources, canvasElements) => {
    const readableElementGuids = [...resources, ...canvasElements];
    return getElements(elements, readableElementGuids);
};

const getCollectionElements = (elements, resources) => {
    const collectionElementGuids = resources.filter(guid => elements[guid].isCollection);
    return getElements(elements, collectionElementGuids);
};

const getNonCollectionElementsByType = (elements, resources) => {
    const filteredElementGuids = resources.filter(guid =>
        (elements[guid].dataType === dataTypeSelector) && (!elements[guid].isCollection)
    );
    return getElements(elements, filteredElementGuids);
};

export const byTypeElementsSelector = (dataType) => {
    dataTypeSelector = dataType;
    return createSelector([elementsSelector, resourcesSelector], getNonCollectionElementsByType);
};

export const writableElementsSelector = createSelector([elementsSelector, resourcesSelector], getWritableElements);
export const readableElementsSelector = createSelector([elementsSelector, resourcesSelector, canvasElementsSelector], getReadableElements);
export const collectionElementsSelector = createSelector([elementsSelector, resourcesSelector], getCollectionElements);