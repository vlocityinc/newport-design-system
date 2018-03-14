import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import {
    mutateAssignment,
    deMutateAssignment
} from './assignmentEditorDataMutation';

/**
 * Add property editor mutation for a given element
 *
 * @param {Object} element Property editor element to mutate
 * @return {Object} Element in the shape required by property editor
 */
export const mutateEditorElement = element => {
    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        mutateAssignment(element);
    }

    // TODO Add other element types

    return element;
};

/**
 * Remove property editor mutation for a given element
 *
 * @param {Object} element Property editor element for which mutation is to be removed
 * @return {Object} Element in the shape required by store
 */
export const removeEditorElementMutation = element => {
    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        deMutateAssignment(element);
    }

    // TODO Add other element types

    return element;
};
