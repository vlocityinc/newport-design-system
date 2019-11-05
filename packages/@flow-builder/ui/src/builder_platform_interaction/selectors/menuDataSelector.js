import { createSelector } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    FLOW_DATA_TYPE,
    getFlowDataType
} from 'builder_platform_interaction/dataTypeLib';
import {
    getQueryableEntities,
    getCreateableEntities,
    getDeletableEntities,
    getUpdateableEntities
} from 'builder_platform_interaction/sobjectLib';
import { COMPONENT_INSTANCE } from 'builder_platform_interaction/flowExtensionLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';

import { getAutomaticOutputParameters } from 'builder_platform_interaction/complexTypeLib';

const elementsSelector = state => state.elements;

const getFilteredElements = filterFunction => {
    return elements => {
        return Object.values(elements).filter(filterFunction);
    };
};

const isQueryableSObject = objectType => {
    return getQueryableEntities().some(entity => entity.apiName === objectType);
};

const isCreateableSObject = objectType => {
    return getCreateableEntities().some(
        entity => entity.apiName === objectType
    );
};

const isUpdateableSObject = objectType => {
    return getUpdateableEntities().some(
        entity => entity.apiName === objectType
    );
};

const isDeleteableSObject = objectType => {
    return getDeletableEntities().some(entity => entity.apiName === objectType);
};

const filterByRetrieveOptions = (elements, retrieveOptions) => {
    let filteredElements = Object.values(elements);
    if (!retrieveOptions.allSObjectsAndSObjectCollections) {
        // elements should either all be collections, or all not be collections, based on isCollection setting
        filteredElements = filteredElements.filter(
            element => !!element.isCollection === !!retrieveOptions.isCollection
        );
    }
    if (retrieveOptions.entityName) {
        filteredElements = filteredElements.filter(
            element =>
                element.sobjectType === retrieveOptions.entityName ||
                element.subtype === retrieveOptions.entityName
        );
    }
    if (retrieveOptions.queryable) {
        filteredElements = filteredElements.filter(
            element =>
                isQueryableSObject(element.subtype) ||
                isQueryableSObject(element.sobjectType)
        );
    }
    if (retrieveOptions.createable) {
        filteredElements = filteredElements.filter(
            element =>
                isCreateableSObject(element.subtype) ||
                isCreateableSObject(element.sobjectType)
        );
    }
    if (retrieveOptions.updateable) {
        filteredElements = filteredElements.filter(
            element =>
                isUpdateableSObject(element.subtype) ||
                isUpdateableSObject(element.sobjectType)
        );
    }
    if (retrieveOptions.deleteable) {
        filteredElements = filteredElements.filter(
            element =>
                isDeleteableSObject(element.subtype) ||
                isDeleteableSObject(element.sobjectType)
        );
    }
    return filteredElements;
};

/**
 * Filter the sobject or sobject collection variables by entity name.
 * @param {Object[]} elements elements from store
 * @param {RetrieveOptions} retrieveOptions way to retrieve the sObject or sObject collection variables
 * @returns {Object[]}  list of sobject/sobject collection variables
 */
export const getSObjectOrSObjectCollectionByEntityElements = (
    elements,
    retrieveOptions = {}
) => {
    let allElements = getFilteredElements(
        element => element.dataType === FLOW_DATA_TYPE.SOBJECT.value
    )(elements);

    if (retrieveOptions && allElements) {
        allElements = filterByRetrieveOptions(allElements, retrieveOptions);
    }
    return allElements;
};

/**
 * Returns elements that match one of the following: SObject, SObject collection, output contains SObject, apex variable which has SObject field
 * @param {Object[]} elements elements we want to filter
 * @param {RetrieveOptions} retrieveOptions options such as whether we want only deletable/queryable etc... SObject
 * @returns {Object[]} elements that match one of the following: SObject, SObject collection, output contains SObject, apex variable which has SObject field
 */
export const getCanContainsSObjectElements = (elements, retrieveOptions) => {
    const filteredElements = getSObjectOrSObjectCollectionByEntityElements(
        elements,
        retrieveOptions
    );
    const sobjectAllElements = getFilteredElements(element =>
        isFlowResourceWithSObjectField(element, retrieveOptions)
    )(elements);

    if (sobjectAllElements && sobjectAllElements.length > 0) {
        filteredElements.push(...sobjectAllElements);
    }
    return filteredElements;
};

/**
 * Selects: SObject, SObject collection, elements which outputs contain SObject, apex variable with SObject field
 * @param {RetrieveOptions} retrieveOptions options such as whether we want only deletable/queryable etc... SObject
 */
export const isOrCanContainsObjectOrSObjectCollectionSelector = retrieveOptions => {
    return createSelector(
        [elementsSelector],
        elements => getCanContainsSObjectElements(elements, retrieveOptions)
    );
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

export const sObjectOrSObjectCollectionByEntitySelector = retrieveOptions => {
    return createSelector(
        [elementsSelector],
        elements =>
            getSObjectOrSObjectCollectionByEntityElements(
                elements,
                retrieveOptions
            )
    );
};

export const byTypeWritableElementsSelector = dataType => {
    return createSelector(
        [elementsSelector],
        getFilteredElements(
            element =>
                element.dataType === dataType &&
                !element.isCollection &&
                element.elementType === ELEMENT_TYPE.VARIABLE
        )
    );
};

const choiceTypes = [
    ELEMENT_TYPE.CHOICE,
    ELEMENT_TYPE.RECORD_CHOICE_SET,
    ELEMENT_TYPE.PICKLIST_CHOICE_SET
];
const textCompatibleTypes = [
    FLOW_DATA_TYPE.PICKLIST.value,
    FLOW_DATA_TYPE.MULTI_PICKLIST.value
];
export const choiceSelector = dataType => {
    // element must be a choice
    // if a dataType is specified for the choice field, this choice must have a compatible dataType
    return createSelector(
        [elementsSelector],
        getFilteredElements(element => {
            return (
                choiceTypes.includes(element.elementType) &&
                (!dataType ||
                    dataType === element.dataType ||
                    (dataType === FLOW_DATA_TYPE.STRING.value &&
                        textCompatibleTypes.includes(element.dataType)))
            );
        })
    );
};

// Only variables and automatic output from GetRecord/Actions/Create elements are writable.
// Lightning components screen fields in automatic handling mode and Actions in automatic handling mode have writable fields.
export const writableElementsSelector = createSelector(
    [elementsSelector],
    getFilteredElements(
        ({ elementType, dataType, object, isSystemGeneratedOutput }) =>
            elementType === ELEMENT_TYPE.VARIABLE ||
            (elementType === ELEMENT_TYPE.START_ELEMENT && !!object) ||
            dataType === FLOW_DATA_TYPE.SOBJECT.value ||
            dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value ||
            dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value ||
            (elementType === ELEMENT_TYPE.RECORD_CREATE &&
                dataType === FLOW_DATA_TYPE.STRING.value) ||
            isSystemGeneratedOutput === true
    )
);
export const readableElementsSelector = createSelector(
    [elementsSelector],
    getFilteredElements(
        element =>
            element.elementType !== ELEMENT_TYPE.START_ELEMENT ||
            !!element.object
    )
);
export const collectionElementsSelector = createSelector(
    [elementsSelector],
    getFilteredElements(element => element.isCollection)
);
export const apexScalarVariablesSelector = createSelector(
    [elementsSelector],
    getFilteredElements(
        element =>
            element.elementType === ELEMENT_TYPE.VARIABLE &&
            element.dataType === FLOW_DATA_TYPE.APEX.value &&
            !element.isCollection
    )
);

export const componentInstanceScreenFieldsSelector = createSelector(
    [elementsSelector],
    getFilteredElements(
        element =>
            element.elementType === ELEMENT_TYPE.SCREEN_FIELD &&
            element.fieldType === COMPONENT_INSTANCE
    )
);

export const byElementTypeElementsSelector = (...elementType) =>
    createSelector(
        [elementsSelector],
        getFilteredElements(element =>
            elementType.includes(element.elementType)
        )
    );

const getSObjectParameters = parameters => {
    return parameters
        ? Object.values(parameters).filter(
              parameter =>
                  parameter &&
                  getFlowDataType(parameter.dataType) ===
                      FLOW_DATA_TYPE.SOBJECT.value
          )
        : [];
};

function isFlowResourceWithSObjectField(flowResource, retrieveOptions = {}) {
    const automaticOutputParametersOrApexClassProperties =
        flowResource.dataType === FLOW_DATA_TYPE.APEX.value
            ? apexTypeLib.getPropertiesForClass(flowResource.subtype)
            : getAutomaticOutputParameters(flowResource);
    let sobjectParameters = getSObjectParameters(
        automaticOutputParametersOrApexClassProperties
    );

    if (retrieveOptions && sobjectParameters && sobjectParameters.length > 0) {
        sobjectParameters = filterByRetrieveOptions(
            sobjectParameters,
            retrieveOptions
        );
    }
    return sobjectParameters && sobjectParameters.length > 0;
}
