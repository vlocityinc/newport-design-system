import {ELEMENT_TYPE} from 'builder_platform_interaction-constant';
import {
    mutateAssignment,
    deMutateAssignment
} from './assignmentEditorDataMutation';
import {
    mutateDecision,
    deMutateDecision
} from './decisionEditorDataMutation';

/**
 * Add property editor mutation for a given element
 *
 * @param {Object} element Property editor element to mutate
 * @param {Object} state State of the whole project
 * @return {Object} Element in the shape required by property editor
 */
export const mutateEditorElement = (element, state) => {
    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        mutateAssignment(element);
    } else if (element.elementType === ELEMENT_TYPE.DECISION) {
        mutateDecision(element, state);
    }

    // TODO Add other element types

    return element;
};

/**
 * Remove property editor mutation for a given element.  This may cause additional
 * (children) objects to be modified or deleted as well as the original object.
 *
 * For example: outcomes when a decision is being modified
 *
 * @param {Object} element Property editor element for which mutation is to be removed
 * @param {Object} state State of the whole project
 * @return {Object} Element in the shape required by store
 */
export const removeEditorElementMutation = (element, state) => {
    const elements = [element];
    const deletedElements = [];

    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        deMutateAssignment(element);
    } else if (element.elementType === ELEMENT_TYPE.DECISION) {
        // deMutateDecision returns outcome elements that also need to be updated in the store
        // as well as outcomes that need to be deleted
        const decisionOutcomesModifiedAndDeleted = deMutateDecision(element, state);

        deletedElements.push(...decisionOutcomesModifiedAndDeleted.deleted);
    }

    // TODO Add other element types

    return {
        modified: elements,
        deleted: deletedElements
    };
};
