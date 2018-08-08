import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { createAssignmentWithConnectors, createDecisionWithOutcomeReferences, createVariableForStore } from 'builder_platform_interaction-element-factory';

/**
 * Element factory to create new objects for each element type in the shape that the store expects
 *
 * @param {String}  elementType     Element type
 * @param {Object}  element         Metadata element to be used as the base for copying information
 * @return {Object} storeElement    New element object in the shape that the store expects
 */
export const flowToUIFactory = (elementType, element) => {
    let storeElement = {};

    if (elementType === ELEMENT_TYPE.ASSIGNMENT) {
        storeElement = createAssignmentWithConnectors(element);
    } else if (elementType === ELEMENT_TYPE.DECISION) {
        storeElement = createDecisionWithOutcomeReferences(element);
    } else if (elementType === ELEMENT_TYPE.VARIABLE) {
        storeElement = createVariableForStore(element);
    }

    // TODO Add other element types

    return storeElement;
};