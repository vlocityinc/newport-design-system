import { baseResource } from "./baseElement";
import { baseResourceMetadataObject } from "./baseMetadata";
import { createFilterMetadataObject, createFilter } from "./recordFilter";

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