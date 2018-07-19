import { createSelector } from 'builder_platform_interaction-store-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { GLOBAL_CONSTANT_OBJECTS, GLOBAL_CONSTANTS as GC} from 'builder_platform_interaction-system-lib';
import { getQueryableEntities, getCreateableEntities, getDeletableEntities, getUpdateableEntities }  from 'builder_platform_interaction-sobject-lib';

const elementsSelector = (state) => state.elements;
const resourcesSelector = (state) => state.resources;
const canvasElementsSelector = (state) => state.canvasElements;

const getResources = (elements, guids) => guids.reduce((acc, guid) => {
    acc.push(elements[guid]);
    return acc;
}, []);

const getWritableElements = (elements, resources) => {
    const writableElementGuids = resources.filter(guid => elements[guid].elementType === ELEMENT_TYPE.VARIABLE);
    return getResources(elements, writableElementGuids);
};

const getReadableElements = (elements, resources, canvasElements) => {
    // the start element will never be needed for menu data
    const editableCanvasElements = canvasElements.filter(guid => elements[guid].elementType !== ELEMENT_TYPE.START_ELEMENT);
    const readableElementGuids = [...resources, ...editableCanvasElements];
    const readableElements = getResources(elements, readableElementGuids);
    const globalConstants = getResources(GLOBAL_CONSTANT_OBJECTS, [GC.BOOLEAN_FALSE, GC.BOOLEAN_TRUE, GC.EMPTY_STRING]);
    return [...readableElements, ...globalConstants];
};

const getCollectionElements = (elements, resources) => {
    const collectionElementGuids = resources.filter(guid => elements[guid].isCollection);
    return getResources(elements, collectionElementGuids);
};

const getNonCollectionElementsByType = (elements, resources, dataType) => {
    const filteredElementGuids = resources.filter(guid =>
        (elements[guid].dataType === dataType) && (!elements[guid].isCollection)
    );
    return getResources(elements, filteredElementGuids);
};

const isQueryableSObject = (objectType) => {
    return getQueryableEntities().some(entity => entity.apiName === objectType);
};

const isCreateableSObject = (objectType) => {
    return getCreateableEntities().some(entity => entity.apiName === objectType);
};

const isUpdateableSObject = (objectType) => {
    return getUpdateableEntities().some(entity => entity.apiName === objectType);
};

const isDeleteableSObject = (objectType) => {
    return getDeletableEntities().some(entity => entity.apiName === objectType);
};

/**
 * Filter the sobject or sobject collection variables by entity name.
 * @param {Object[]} elements elements from store
 * @param {String[]} resources resources from store
 * @param {RetrieveOptions} retrieveOptions way to retrieve the sObject or sObject collection variables
 * @returns {Object[]}  list of sobject/sobject collection variables
 */
const getSObjectOrSObjectCollectionByEntityElements = (elements, resources, retrieveOptions) => {
    let allElements = [];
    const dataType = FLOW_DATA_TYPE.SOBJECT.value;
    if (retrieveOptions) {
        if (retrieveOptions.allSObjectsAndSObjectCollections) {
            allElements.push(...getCollectionElements(elements, resources).filter(element => element.dataType === dataType));
            allElements.push(...getNonCollectionElementsByType(elements, resources, dataType));
        } else if (retrieveOptions.isCollection) {
            allElements.push(...getCollectionElements(elements, resources).filter(element => element.dataType === dataType));
        } else {
            allElements.push(...getNonCollectionElementsByType(elements, resources, dataType));
        }
        if (retrieveOptions.entityName) {
            allElements.filter(element => element.objectType === retrieveOptions.entityName);
        }
        if (retrieveOptions.queryable) {
            allElements = allElements.filter(element => isQueryableSObject(element.objectType));
        }
        if (retrieveOptions.createable) {
            allElements = allElements.filter(element => isCreateableSObject(element.objectType));
        }
        if (retrieveOptions.updateable) {
            allElements = allElements.filter(element => isUpdateableSObject(element.objectType));
        }
        if (retrieveOptions.deleteable) {
            allElements = allElements.filter(element => isDeleteableSObject(element.objectType));
        }
    }
    return allElements;
};

/**
 * @typedef {Object} RetrieveOptions
 *
 * @property {Boolean} allSObjectsAndSObjectCollections - true to retrieve both sObject and sObject collection variables.
 * @property {Boolean} isCollection - true to retrieve only sObject collection variables. It's ignored if there is allSObjectsAndSObjectCollections property.
 * @property {String} entityName - filter by entity name.
 * @property {Boolean} queryable - true to retrieve only queryable sObject
 * @property {Boolean} createable - true to retrieve only createable sObject
 * @property {Boolean} updateable - true to retrieve only updateable sObject
 * @property {Boolean} deleteable - true to retrieve only deleteable sObject
 */

/**
 * Filter the sobject or sobject collection variables by entity name.
 * @param {RetrieveOptions} retrieveOptions way to retrieve the sObject or sObject collection variables.
 * @returns {Object} selector
 */

export const sObjectOrSObjectCollectionByEntitySelector = (retrieveOptions) => {
    return createSelector([elementsSelector, resourcesSelector], (elements, resources) => getSObjectOrSObjectCollectionByEntityElements(elements, resources, retrieveOptions));
};

export const byTypeElementsSelector = (dataType) => {
    return createSelector([elementsSelector, resourcesSelector], (elements, resources) => getNonCollectionElementsByType(elements, resources, dataType));
};

export const writableElementsSelector = createSelector([elementsSelector, resourcesSelector], getWritableElements);
export const readableElementsSelector = createSelector([elementsSelector, resourcesSelector, canvasElementsSelector], getReadableElements);
export const collectionElementsSelector = createSelector([elementsSelector, resourcesSelector], getCollectionElements);