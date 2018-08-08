import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { createAssignmentMetadataObject, createDecisionMetadataObject, createVariableMetadataObject } from 'builder_platform_interaction-element-factory';

/**
 * Element factory to create new objects for each element type in the shape that the store expects
 * @param {Object} element       Metadata element to be used as the base for copying information
 * @param {Object} config        Config for element creation
 * @return {Object}              New element object in the shape that the store expects
 */
export const uiToFlowFactory = (element) => {
    let metadataObject = {};

    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        metadataObject = createAssignmentMetadataObject(element);
    } else if (element.elementType === ELEMENT_TYPE.DECISION) {
        metadataObject = createDecisionMetadataObject(element);
    } else if (element.elementType === ELEMENT_TYPE.VARIABLE) {
        metadataObject = createVariableMetadataObject(element);
    }

    // TODO Add other element types

    return metadataObject;
};