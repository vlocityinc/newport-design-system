// @ts-nocheck
import { createExpressionListRowItemWithoutOperatorAndRHSDataType } from './baseList';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

/**
 * Factory function for creating output assignment used in record lookup and recordChoiceSet
 *
 * @param {Object} outputAssignment
 * @param {string} sObject - eg: Account
 */
export const createOutputAssignment = (outputAssignment = {}, sObject) => {
    let newOutputAssignment = {};
    if (outputAssignment.hasOwnProperty('field') && outputAssignment.hasOwnProperty('assignToReference')) {
        const leftHandSide = sObject + '.' + outputAssignment.field;
        const rightHandSide = outputAssignment.assignToReference;
        // we add leftHandSideDataType to make sure that leftHandSide ('Account.Name') is not transformed to a guid if a variable has the same name as the entity
        newOutputAssignment = createExpressionListRowItemWithoutOperatorAndRHSDataType({
            leftHandSide,
            leftHandSideDataType: FLOW_DATA_TYPE.STRING.value,
            rightHandSide
        });
    } else {
        newOutputAssignment = createExpressionListRowItemWithoutOperatorAndRHSDataType(outputAssignment);
    }
    return newOutputAssignment;
};
/**
 * Factory function for creating output assignment metadata object used in record lookup and recordChoiceSet
 *
 * @param {Object} outputAssignment
 * @param {string} sObject
 */
export const createOutputAssignmentMetadataObject = (outputAssignment) => {
    if (!outputAssignment) {
        throw new Error('outputAssignment is required to create the outputAssignmentMetadataObject');
    }
    const field = outputAssignment.leftHandSide.substring(outputAssignment.leftHandSide.indexOf('.') + 1);
    const assignToReference = outputAssignment.rightHandSide;
    return {
        field,
        assignToReference
    };
};
