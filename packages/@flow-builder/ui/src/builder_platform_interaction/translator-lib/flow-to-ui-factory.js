import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { createAssignmentWithConnectors, createDecisionWithOutcomeReferences, createVariableForStore } from 'builder_platform_interaction-element-factory';

/**
 * Element factory to create new objects for each element type in the shape that the store expects
 *
 * @param {String}  elementType     Element type
 * @param {Object}  element         Metadata element to be used as the base for copying information
 * @return {Object} storeObjects    Element and connector objects in the shape that the store expects for the given metadata element
 */
export const flowToUIFactory = (elementType, element) => {
    let storeObjects = {};

    if (elementType === ELEMENT_TYPE.ASSIGNMENT) {
        storeObjects = createAssignmentWithConnectors(element);
    } else if (elementType === ELEMENT_TYPE.DECISION) {
        storeObjects = createDecisionWithOutcomeReferences(element);
    } else if (elementType === ELEMENT_TYPE.VARIABLE) {
        storeObjects = createVariableForStore(element);
    }

    // TODO Add other element types

    return storeObjects;
};