// @ts-nocheck
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { baseElementsArrayToMap } from './base/baseElement';
import { createFilter, createFilterMetadataObject } from './base/baseRecordElement';
import { createDynamicChoiceSet, createDynamicChoiceSetMetadataObject } from './base/dynamicChoiceSet';
import { createOutputAssignment, createOutputAssignmentMetadataObject } from './base/outputAssignments';

/**
 * Record choice set factory function
 *
 * @param {Object} element - record choice set element
 * @returns {Object} recordChoiceSet
 */
export const createRecordChoiceSet = (element = {}) => {
    const recordChoiceSetElement = createDynamicChoiceSet(element);
    const { object = null, sortField = null, outputAssignments = [] } = element;
    let { filterLogic = CONDITION_LOGIC.AND } = element;
    const objectIndex = generateGuid();
    const translatedOutputAssignments = outputAssignments.map((outputAssignment) =>
        createOutputAssignment(outputAssignment, object)
    );
    let { filters } = element;
    if (filters && filters.length > 0) {
        filters = filters.map((filter) => createFilter(filter, object));
    } else {
        const newFilter = createFilter();
        filters = [newFilter];
    }

    // For the existing element if no filters has been set we need to assign No Conditions to the filterLogic.
    if (object && object !== '' && !filters[0].leftHandSide && filterLogic === CONDITION_LOGIC.AND) {
        filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
    }

    Object.assign(recordChoiceSetElement, {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
        object,
        objectIndex,
        sortField,
        filterLogic,
        filters,
        outputAssignments: translatedOutputAssignments
    });

    return recordChoiceSetElement;
};
/**
 * @param {Object} element - recordChoiceSet element.
 * @returns {Object} recordChoiceSet object in a {guid : [choice]} format
 */
export const createRecordChoiceSetForStore = (element) => {
    if (!element) {
        throw new Error('Element is required to create record choice set element for store');
    }
    const recordChoiceSetElement = createRecordChoiceSet(element);
    return baseElementsArrayToMap([recordChoiceSetElement]);
};
/**
 * Factory function for creating recordChoiceSet element's metadata object
 *
 * @param {Object} element recordChoiceSet object
 * @returns {Object} recordChoiceMetadata object
 */
export const createRecordChoiceSetMetadataObject = (element) => {
    if (!element) {
        throw new Error('Element is required to create dynamic choice set meta data object');
    }
    const baseDynamicChoiceMetadataObject = createDynamicChoiceSetMetadataObject(element);
    const { object, sortField, outputAssignments, filterLogic } = element;
    let { filters } = element;
    if (filterLogic === CONDITION_LOGIC.NO_CONDITIONS) {
        filters = [];
    } else {
        filters = filters.map((filter) => createFilterMetadataObject(filter));
    }
    const outputAssignmentsMetadataObject = outputAssignments.map((outputAssignment) =>
        createOutputAssignmentMetadataObject(outputAssignment)
    );

    return Object.assign(baseDynamicChoiceMetadataObject, {
        object,
        sortField,
        outputAssignments: outputAssignmentsMetadataObject,
        filterLogic: filterLogic === CONDITION_LOGIC.NO_CONDITIONS ? undefined : filterLogic,
        filters
    });
};
