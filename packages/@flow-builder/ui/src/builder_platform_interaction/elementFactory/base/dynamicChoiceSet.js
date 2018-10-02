import { baseResource } from "./baseElement";
import { baseResourceMetadataObject } from "./baseMetadata";
import { createFilterMetadataObject, createFilter } from "./recordFilter";
import { createPicklistChoiceGroupForStore } from "../picklistChoiceGroup";
import { createRecordChoiceGroupForStore } from "../recordChoiceGroup";

export const createDynamicChoiceSet = (element = {}) => {
    const newDynamicChoiceSet = baseResource(element);
    const {
        limit = 0,
        displayField,
        valueField,
        dataType,
        filters = [],
        outputAssignments = [],
        sortOrder
    } = element;

    const translatedFilters = filters.map((filter) => createFilter(filter));
    const translatedOutputAssignments = outputAssignments; // TODO create base out put assignments and use here (Work Item: This one, next CL)
    return Object.assign(newDynamicChoiceSet, {
        limit,
        displayField,
        valueField,
        dataType,
        filters: translatedFilters,
        outputAssignments: translatedOutputAssignments,
        sortOrder
    });
};

export const createDynamicChoiceSetMetadataObject = (element) => {
    const newDynamicChoiceSet = baseResourceMetadataObject(element);
    const {
        limit,
        displayField,
        valueField,
        dataType,
        filters,
        outputAssignments,
        sortOrder
    } = element;

    const filtersMetadataObject = filters.map((filter) => createFilterMetadataObject(filter));
    const outputAssignmentsMetadataObject = outputAssignments; // TODO create base out put assignments and use here (Work Item: This one, next CL)
    Object.assign(newDynamicChoiceSet, {
        limit,
        displayField,
        valueField,
        dataType,
        sortOrder,
        filters: filtersMetadataObject,
        outputAssignments: outputAssignmentsMetadataObject
    });
    return newDynamicChoiceSet;
};

/**
 * This function is called by flowToUiTranslator for convert dynamic choice set metadata into correct shape and element type.
 * It used data type property of dynamic choice set to identify element type
 * @param {Object} element dynamic choice set metadata object
 * @return {Object} new element in shape expected by store
 */
export function dynamicChoiceSetForStore(element) {
    const dataType = element.dataType;
    switch (dataType) {
        case "Picklist":
        case "Multipicklist":
            return createPicklistChoiceGroupForStore(element);
        default:
            return createRecordChoiceGroupForStore(element);
    }
}