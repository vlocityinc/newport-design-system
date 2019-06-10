import {
    createDynamicChoiceSet,
    createDynamicChoiceSetMetadataObject
} from './base/dynamicChoiceSet';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseElementsArrayToMap } from './base/baseElement';
import {
    createOutputAssignment,
    createOutputAssignmentMetadataObject
} from './base/outputAssignments';
import {
    createFilterMetadataObject,
    createFilter
} from './base/baseRecordElement';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
/**
 * Record choice set factory function
 * @param {Object} element - record choice set element
 * @returns {Object} recordChoiceSet
 */
export const createRecordChoiceSet = (element = {}) => {
    const recordChoiceSetElement = createDynamicChoiceSet(element);
    const {
        object = null,
        objectIndex = generateGuid(),
        sortField = null,
        outputAssignments = []
    } = element;
    const translatedOutputAssignments = outputAssignments.map(
        outputAssignment => createOutputAssignment(outputAssignment, object)
    );
    let { filters } = element;
    if (filters && filters.length > 0) {
        filters = filters.map(filter => createFilter(filter, object));
    } else {
        const newFilter = createFilter();
        filters = [newFilter];
    }
    const filterType = filters[0].leftHandSide
        ? RECORD_FILTER_CRITERIA.ALL
        : RECORD_FILTER_CRITERIA.NONE;

    Object.assign(recordChoiceSetElement, {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        object,
        objectIndex,
        sortField,
        filterType,
        filters,
        outputAssignments: translatedOutputAssignments
    });

    return recordChoiceSetElement;
};
/**
 * @param {Object} element - recordChoiceSet element.
 * @returns {Object} recordChoiceSet object in a {guid : [choice]} format
 */
export const createRecordChoiceSetForStore = element => {
    if (!element) {
        throw new Error(
            'Element is required to create record choice set element for store'
        );
    }
    const recordChoiceSetElement = createRecordChoiceSet(element);
    return baseElementsArrayToMap([recordChoiceSetElement]);
};
/**
 * Factory function for creating recordChoiceSet element's metadata object
 * @param {Object} element recordChoiceSet object
 * @returns {Object} recordChoiceMetadata object
 */
export const createRecordChoiceSetMetadataObject = element => {
    if (!element) {
        throw new Error(
            'Element is required to create dynamic choice set meta data object'
        );
    }
    const baseDynamicChoiceMetadataObject = createDynamicChoiceSetMetadataObject(
        element
    );
    const { object, sortField, outputAssignments, filterType } = element;
    let { filters } = element;
    if (filterType === RECORD_FILTER_CRITERIA.NONE) {
        filters = [];
    } else {
        filters = filters.map(filter => createFilterMetadataObject(filter));
    }
    const outputAssignmentsMetadataObject = outputAssignments.map(
        outputAssignment =>
            createOutputAssignmentMetadataObject(outputAssignment)
    );
    const recordChoiceSetMetadataObject = Object.assign(
        baseDynamicChoiceMetadataObject,
        {
            object,
            sortField,
            outputAssignments: outputAssignmentsMetadataObject,
            filters
        }
    );

    return recordChoiceSetMetadataObject;
};
