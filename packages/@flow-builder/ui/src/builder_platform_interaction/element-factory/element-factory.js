import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { createAssignment } from './assignment.js';

/**
 * Element factory to create new objects for each element type
 *
 * @param {Object} element Element to be used as the base for copying information
 * @return {Object} New element object with all relevant data
 */
export const elementFactory = (element) => {
    let updatedElement = {};

    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        updatedElement = createAssignment(element);
    }

    // TODO Add other element types

    return updatedElement;
};