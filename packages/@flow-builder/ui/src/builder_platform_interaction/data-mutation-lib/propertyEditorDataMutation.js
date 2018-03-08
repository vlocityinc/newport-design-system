import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import { pick } from './objectMutation';
import {
    mutateAssignment,
    deMutateAssignment
} from './assignmentEditorDataMutation';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';

/**
 * Add property editor mutation for a given element
 *
 * @param {Object} element Property editor element to mutate
 * @return {Object} Element in the shape required by property editor
 */
export const mutateEditorElement = element => {
    element = pick(
        element,
        getConfigForElementType(element.elementType, 'propertyEditorFields')
    );

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
