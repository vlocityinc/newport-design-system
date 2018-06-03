import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

/**
 * Add property editor mutation for assignment
 *
 * @param {Object} assignment Assignment element to mutate
 */
export const mutateAssignment = assignment => {
    // TODO: make this transform the assignment in an immutable way.
    // Will probably have to build a list of new assignment items and set them with updateProperties
    const assignmentItems = assignment.assignmentItems;
    if (assignmentItems) {
        assignmentItems.forEach((item, itemIndex) => {
            item.rowIndex = generateGuid(SUB_ELEMENT_TYPE.ASSIGNMENT_ITEM);

            if (item.hasOwnProperty('assignToReference')) {
                item.leftHandSide = item.assignToReference;
                delete item.assignToReference;
            }
            if (item.hasOwnProperty('value')) {
                assignmentItems[itemIndex] = mutateFEROV(item, 'value', {
                    valueProperty: 'rightHandSide',
                    dataTypeProperty: 'rightHandSideDataType',
                });
            }
        });
    }
};

/**
 * Remove property editor mutation for assignment
 *
 * @param {Object} assignment Assignment element to de-mutate
 */
export const deMutateAssignment = assignment => {
    // TODO make this transform the assignmnet in an immutable way
    const assignmentItems = assignment.assignmentItems;
    if (assignmentItems) {
        assignmentItems.forEach((item, itemIndex) => {
            delete item.rowIndex;

            if (item.hasOwnProperty('leftHandSide')) {
                item.assignToReference = item.leftHandSide;
                delete item.leftHandSide;
            }
            if (item.hasOwnProperty('rightHandSide')) {
                assignmentItems[itemIndex] = deMutateFEROV(item, 'value', {
                    valueProperty: 'rightHandSide',
                    dataTypeProperty: 'rightHandSideDataType',
                });
            }
        });
    }
};
