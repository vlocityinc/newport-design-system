import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';

/**
 * Add property editor mutation for assignment
 *
 * @param {Object} assignment Assignment element to mutate
 */
export const mutateAssignment = assignment => {
    const assignmentItems = assignment.assignmentItems;
    if (assignmentItems) {
        for (const item of assignmentItems) {
            if (item.hasOwnProperty('assignToReference')) {
                item.leftHandSide = item.assignToReference;
                delete item.assignToReference;
            }
            if (item.hasOwnProperty('value')) {
                mutateFEROV(item, item.value);
                delete item.value;
            }
        }
    }
};

/**
 * Remove property editor mutation for assignment
 *
 * @param {Object} assignment Assignment element to de-mutate
 */
export const deMutateAssignment = assignment => {
    const assignmentItems = assignment.assignmentItems;
    if (assignmentItems) {
        for (const item of assignmentItems) {
            if (item.hasOwnProperty('leftHandSide')) {
                item.assignToReference = item.leftHandSide;
                delete item.leftHandSide;
            }
            if (item.hasOwnProperty('rightHandSide')) {
                item.value = {};
                deMutateFEROV(item, item.value);
            }
        }
    }
};
