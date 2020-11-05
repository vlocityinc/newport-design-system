// @ts-nocheck
import { createSelector } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE, isSystemElement } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE, getFlowDataType } from 'builder_platform_interaction/dataTypeLib';
import {
    getQueryableEntities,
    getCreateableEntities,
    getDeletableEntities,
    getUpdateableEntities
} from 'builder_platform_interaction/sobjectLib';
import { COMPONENT_INSTANCE } from 'builder_platform_interaction/flowExtensionLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import { retrieveResourceComplexTypeFields } from 'builder_platform_interaction/complexTypeLib';
import {
    SOBJECT_OR_SOBJECT_COLLECTION_FILTER,
    sObjectOrSObjectCollectionFilterToIsCollection
} from 'builder_platform_interaction/filterTypeLib';
import { SORT_COMPATIBLE_TYPES } from 'builder_platform_interaction/sortEditorLib';

const elementsSelector = (state) => state.elements;

const isApexTypeElement = (element) => getFlowDataType(element.dataType) === FLOW_DATA_TYPE.APEX.value;

const getFilteredElements = (filterFunction) => {
    return (elements) => {
        return Object.values(elements).filter(filterFunction);
    };
};

const isQueryableSObject = (objectType) => {
    return getQueryableEntities().some((entity) => entity.apiName === objectType);
};

const isCreateableSObject = (objectType) => {
    return getCreateableEntities().some((entity) => entity.apiName === objectType);
};

const isUpdateableSObject = (objectType) => {
    return getUpdateableEntities().some((entity) => entity.apiName === objectType);
};

const isDeleteableSObject = (objectType) => {
    return getDeletableEntities().some((entity) => entity.apiName === objectType);
};

const isSortable = (dataType, isCollection) => {
    return isCollection ? SORT_COMPATIBLE_TYPES.includes(dataType) : dataType === FLOW_DATA_TYPE.APEX.value;
};

const isCollectionFilter = (element, isCollection) => {
    return !!element.isCollection === !!isCollection;
};

const entityNameFilter = (element, entityName) => {
    return element.sobjectType === entityName || element.subtype === entityName;
};

const queryableFilter = (element) => {
    return isQueryableSObject(element.subtype) || isQueryableSObject(element.sobjectType);
};

const creatableFilter = (element) => {
    return isCreateableSObject(element.subtype) || isCreateableSObject(element.sobjectType);
};

const updatableFilter = (element) => {
    return isUpdateableSObject(element.subtype) || isUpdateableSObject(element.sobjectType);
};

const deletableFilter = (element) => {
    return isDeleteableSObject(element.subtype) || isDeleteableSObject(element.sobjectType);
};

/**
 * Filter the elements that can be sortable:
 * - A collection and its data type is in supported sortable types
 * - A apex class variable in the apex defined class
 * - An automatic variables
 * - An action call/subflow outputs (from next release)
 * @param element element
 */
const sortableFilter = (element) => {
    return (
        (!element.elementType ||
            element.elementType === ELEMENT_TYPE.VARIABLE ||
            element.elementType === ELEMENT_TYPE.RECORD_LOOKUP) &&
        element.dataType &&
        isSortable(element.dataType, element.isCollection)
    );
};

const apexClassHasSomePropertyMatching = (apexClass, filter) => {
    return Object.values(apexTypeLib.getPropertiesForClass(apexClass)).some((property) =>
        isApexTypeElement(property)
            ? apexClassHasSomePropertyMatching(property.subtype, (apexProperty) => filter(apexProperty))
            : filter(property)
    );
};

const filterByRetrieveOptions = (elements, retrieveOptions) => {
    if (!elements) {
        return elements;
    }
    let filteredElements = Object.values(elements);
    const allowTraversal = retrieveOptions.allowTraversal === undefined ? true : retrieveOptions.allowTraversal;
    const sObjectCollectionCriterion =
        retrieveOptions.sobjectCollectionCriterion || SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT;
    const isCollectionOptions = retrieveOptions.isCollection
        ? retrieveOptions.isCollection
        : sObjectOrSObjectCollectionFilterToIsCollection(sObjectCollectionCriterion);
    if (isCollectionOptions !== undefined) {
        // elements should either all be collections, or all not be collections, based on isCollection setting
        filteredElements = filteredElements.filter(
            (element) =>
                isCollectionFilter(element, isCollectionOptions) ||
                (isCollectionOptions &&
                    allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass || element.subtype, (apexProperty) =>
                        isCollectionFilter(apexProperty, isCollectionOptions)
                    ))
        );
    }
    if (retrieveOptions.entityName) {
        filteredElements = filteredElements.filter(
            (element) =>
                entityNameFilter(element, retrieveOptions.entityName) ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass, (apexProperty) =>
                        entityNameFilter(apexProperty, retrieveOptions.entityName)
                    ))
        );
    } else if (retrieveOptions.dataType) {
        filteredElements = filteredElements.filter(
            (element) =>
                element.dataType === retrieveOptions.dataType ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(
                        element.apexClass,
                        (apexProperty) =>
                            apexProperty.type === retrieveOptions.dataType ||
                            apexProperty.dataType === retrieveOptions.dataType
                    ))
        );
    }

    if (retrieveOptions.elementType) {
        filteredElements = filteredElements.filter((element) => element.elementType === retrieveOptions.elementType);
    }

    if (retrieveOptions.queryable) {
        filteredElements = filteredElements.filter(
            (element) =>
                queryableFilter(element) ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass, (apexProperty) =>
                        queryableFilter(apexProperty)
                    ))
        );
    }
    if (retrieveOptions.createable) {
        filteredElements = filteredElements.filter(
            (element) =>
                creatableFilter(element) ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass, (apexProperty) =>
                        creatableFilter(apexProperty)
                    ))
        );
    }
    if (retrieveOptions.updateable) {
        filteredElements = filteredElements.filter(
            (element) =>
                updatableFilter(element) ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass, (apexProperty) =>
                        updatableFilter(apexProperty)
                    ))
        );
    }
    if (retrieveOptions.deleteable) {
        filteredElements = filteredElements.filter(
            (element) =>
                deletableFilter(element) ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass, (apexProperty) =>
                        deletableFilter(apexProperty)
                    ))
        );
    }
    if (retrieveOptions.sortable) {
        filteredElements = filteredElements.filter(
            (element) =>
                sortableFilter(element) ||
                (allowTraversal &&
                    isApexTypeElement(element) &&
                    apexClassHasSomePropertyMatching(element.apexClass, (apexProperty) => sortableFilter(apexProperty)))
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
export const getSObjectOrSObjectCollectionByEntityElements = (elements, retrieveOptions = { isCollection: false }) => {
    let allElements = getFilteredElements((element) => element.dataType === FLOW_DATA_TYPE.SOBJECT.value)(elements);

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
export const getCanContainSObjectElements = (elements, retrieveOptions) => {
    const filteredElements = getSObjectOrSObjectCollectionByEntityElements(elements, retrieveOptions);
    const sobjectAllElements = getFilteredElements(
        (element) => !element.isCollection && isFlowResourceWithSObjectField(element, retrieveOptions)
    )(elements);

    if (sobjectAllElements && sobjectAllElements.length > 0) {
        filteredElements.push(...sobjectAllElements);
    }
    return filteredElements;
};

/**
 * Checks if a single element is or can contain Sobject element
 * @param {Object} an element
 * @param {Object} a set of additional requirements on the SObject (e.g. isCollection, createable/queryable/deleteable/queryable, ...)
 */
const canElementContainSObject = (element, retrieveOptions) => {
    const filterOnCanContainSObjectElement = getCanContainSObjectElements({ element }, retrieveOptions);
    return filterOnCanContainSObjectElement && filterOnCanContainSObjectElement.length > 0;
};

const isFlowResourceWithConfig = (flowResource, config) => {
    const filteredParams = filterByRetrieveOptions(retrieveResourceComplexTypeFields(flowResource), config);
    return filteredParams && filteredParams.length > 0;
};

const getCanContainElements = (elements, retrieveOptions) => {
    const filteredElements = filterByRetrieveOptions(elements, retrieveOptions);
    const filteredByParameters = retrieveOptions.allowTraversal
        ? getFilteredElements((element) =>
              filteredElements && filteredElements.includes(element)
                  ? undefined
                  : !element.isCollection && isFlowResourceWithConfig(element, retrieveOptions)
          )(elements)
        : undefined;
    if (filteredElements && filteredByParameters && filteredByParameters.length > 0) {
        filteredElements.push(...filteredByParameters);
    }
    return filteredElements;
};

/**
 * Checks if a single element is or can contain an element corresponding to the retrieve options
 * @param {Object} an element
 * @param {Object} a requirements on the element (e.g. isCollection, dataType, createable/queryable/deleteable/queryable, ...)
 */
export const canElementContain = (element, retrieveOptions) => {
    if (retrieveOptions && (retrieveOptions.dataType === FLOW_DATA_TYPE.SOBJECT.value || retrieveOptions.entityName)) {
        return canElementContainSObject(element, retrieveOptions);
    }
    const filtered = getCanContainElements({ element }, retrieveOptions);
    return filtered && filtered.length > 0;
};

/**
 * Selects: SObject, SObject collection, elements which outputs contain SObject, apex variable with SObject field
 * @param {RetrieveOptions} retrieveOptions options such as whether we want only deletable/queryable etc... SObject
 */
const isOrCanContainsObjectOrSObjectCollectionSelector = (retrieveOptions) => {
    return createSelector([elementsSelector], (elements) => getCanContainSObjectElements(elements, retrieveOptions));
};

/**
 * Selects: Elements, Elements collection, elements which outputs contain elements, apex variable with element field that corresponds to the options
 * @param {RetrieveOptions} retrieveOptions options such as whether we want only deletable/queryable etc... elements, elements of a given data type etc...
 */
export const isOrCanContainSelector = (retrieveOptions: {
    isCollection?: boolean;
    dataType: string;
    sObjectCollectionCriterion: any;
    entityName: string;
    allowTraversal?: boolean;
    elementType: string;
}) => {
    const clonedOptions = { ...retrieveOptions };
    clonedOptions.allowTraversal = retrieveOptions.allowTraversal === undefined ? true : retrieveOptions.allowTraversal;
    if (clonedOptions.dataType === FLOW_DATA_TYPE.SOBJECT.value || clonedOptions.entityName) {
        return clonedOptions.allowTraversal === undefined || clonedOptions.allowTraversal
            ? isOrCanContainsObjectOrSObjectCollectionSelector(clonedOptions)
            : createSelector([elementsSelector], (elements) =>
                  getSObjectOrSObjectCollectionByEntityElements(elements, clonedOptions)
              );
    }
    return createSelector([elementsSelector], (elements) => getCanContainElements(elements, clonedOptions));
};

/**
 * @typedef {Object} RetrieveOptions
 *
 * @property {SOBJECT_OR_SOBJECT_COLLECTION_FILTER} sobjectCollectionCriterion - One of SOBJECT, SOBJECT_COLLECTION, SOBJECT_OR_SOBJECT_COLLECTION
 * @property {Boolean} isCollection - true to retrieve only sObject collection variables. It's ignored if there is allSObjectsAndSObjectCollections property.
 * @property {String} dataType - filter by data type.
 * @property {String} elementType - filter by element type.
 * @property {String} entityName - filter by entity name.
 * @property {Boolean} queryable - true to retrieve only queryable sObject
 * @property {Boolean} createable - true to retrieve only createable sObject
 * @property {Boolean} updateable - true to retrieve only updateable sObject
 * @property {Boolean} deleteable - true to retrieve only deleteable sObject
 */

export const filteredElementsSelector = (filter) => createSelector([elementsSelector], getFilteredElements(filter));

const choiceTypes = [ELEMENT_TYPE.CHOICE, ELEMENT_TYPE.RECORD_CHOICE_SET, ELEMENT_TYPE.PICKLIST_CHOICE_SET];
const textCompatibleTypes = [FLOW_DATA_TYPE.PICKLIST.value, FLOW_DATA_TYPE.MULTI_PICKLIST.value];

export const choiceSelector = (dataType) =>
    filteredElementsSelector(
        (element) =>
            choiceTypes.includes(element.elementType) &&
            (!dataType ||
                dataType === element.dataType ||
                (dataType === FLOW_DATA_TYPE.STRING.value && textCompatibleTypes.includes(element.dataType)))
    );

// Only variables and automatic output from GetRecord/Actions/Create elements are writable.
// Lightning components screen fields in automatic handling mode and Actions in automatic handling mode have writable fields.
export const writableElementsSelector = filteredElementsSelector(
    ({ elementType, dataType, object, isSystemGeneratedOutput, storeOutputAutomatically }) =>
        elementType === ELEMENT_TYPE.VARIABLE ||
        (elementType === ELEMENT_TYPE.START_ELEMENT && !!object) ||
        dataType === FLOW_DATA_TYPE.SOBJECT.value ||
        dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value ||
        dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value ||
        dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value ||
        (elementType === ELEMENT_TYPE.RECORD_CREATE && dataType === FLOW_DATA_TYPE.STRING.value) ||
        (elementType === ELEMENT_TYPE.LOOP && storeOutputAutomatically) ||
        isSystemGeneratedOutput === true
);

export const readableElementsSelector = filteredElementsSelector(
    (element) => !isSystemElement(element.elementType) || !!element.object
);

export const apexScalarVariablesSelector = filteredElementsSelector(
    (element) =>
        element.elementType === ELEMENT_TYPE.VARIABLE &&
        element.dataType === FLOW_DATA_TYPE.APEX.value &&
        !element.isCollection
);

export const componentInstanceScreenFieldsSelector = filteredElementsSelector(
    (element) => element.elementType === ELEMENT_TYPE.SCREEN_FIELD && element.fieldType === COMPONENT_INSTANCE
);

export const byElementTypeElementsSelector = (...elementType) =>
    filteredElementsSelector((element) => elementType.includes(element.elementType));

const hasSObjectProperties = (apexClassProperties) => {
    return apexClassProperties
        ? Object.values(apexClassProperties).some(
              (apexClassProperty) => getFlowDataType(apexClassProperty.dataType) === FLOW_DATA_TYPE.SOBJECT.value
          )
        : false;
};

const getSObjectOrContainsSObjectParameters = (parameters) => {
    return parameters
        ? Object.values(parameters).filter(
              (parameter) =>
                  parameter &&
                  (getFlowDataType(parameter.dataType) === FLOW_DATA_TYPE.SOBJECT.value ||
                      (isApexTypeElement(parameter) &&
                          (hasSObjectProperties(apexTypeLib.getPropertiesForClass(parameter.apexClass)) ||
                              hasSObjectProperties(apexTypeLib.getPropertiesForClass(parameter.subtype)))))
          )
        : [];
};

function isFlowResourceWithSObjectField(flowResource, retrieveOptions = {}) {
    const automaticOutputParametersOrApexClassProperties =
        flowResource.dataType === FLOW_DATA_TYPE.APEX.value
            ? apexTypeLib.getPropertiesForClass(flowResource.subtype)
            : retrieveResourceComplexTypeFields(flowResource);
    let sobjectParameters = getSObjectOrContainsSObjectParameters(automaticOutputParametersOrApexClassProperties);

    if (retrieveOptions && sobjectParameters && sobjectParameters.length > 0) {
        sobjectParameters = filterByRetrieveOptions(sobjectParameters, retrieveOptions);
    }
    return sobjectParameters && sobjectParameters.length > 0;
}
