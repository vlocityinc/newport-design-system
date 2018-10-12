import { createSelector } from "builder_platform_interaction/storeLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { getQueryableEntities, getCreateableEntities, getDeletableEntities, getUpdateableEntities }  from "builder_platform_interaction/sobjectLib";

const elementsSelector = (state) => state.elements;

const getFilteredElements = (filterFunction) => {
    return (elements) => {
        return Object.values(elements).filter(filterFunction);
    };
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
 * @param {RetrieveOptions} retrieveOptions way to retrieve the sObject or sObject collection variables
 * @returns {Object[]}  list of sobject/sobject collection variables
 */
export const getSObjectOrSObjectCollectionByEntityElements = (elements, retrieveOptions = {}) => {
    let allElements = getFilteredElements(element => element.dataType === FLOW_DATA_TYPE.SOBJECT.value)(elements);

    if (retrieveOptions) {
        if (!retrieveOptions.allSObjectsAndSObjectCollections) {
            // elements should either all be collections, or all not be collections, based on isCollection setting
            allElements = getFilteredElements(element => !!element.isCollection === !!retrieveOptions.isCollection)(allElements);
        }
        if (retrieveOptions.entityName) {
            allElements = allElements.filter(element => element.objectType === retrieveOptions.entityName);
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
    return createSelector([elementsSelector], (elements) => getSObjectOrSObjectCollectionByEntityElements(elements, retrieveOptions));
};

export const byTypeElementsSelector = (dataType) => {
    return createSelector([elementsSelector], getFilteredElements(element => element.dataType === dataType && !element.isCollection));
};

const choiceTypes = [ELEMENT_TYPE.CHOICE, ELEMENT_TYPE.DYNAMIC_CHOICE_SET, ELEMENT_TYPE.RECORD_CHOICE_SET, ELEMENT_TYPE.PICKLIST_CHOICE_SET];
export const choiceSelector = createSelector([elementsSelector], getFilteredElements(element => choiceTypes.includes(element.elementType)));

export const writableElementsSelector = createSelector([elementsSelector], getFilteredElements(element => element.elementType === ELEMENT_TYPE.VARIABLE));
export const readableElementsSelector = createSelector([elementsSelector], getFilteredElements(element => element.elementType !== ELEMENT_TYPE.START_ELEMENT));
export const collectionElementsSelector = createSelector([elementsSelector], getFilteredElements(element => element.isCollection));
