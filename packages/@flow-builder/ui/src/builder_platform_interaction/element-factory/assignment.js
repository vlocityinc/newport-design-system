import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { baseCanvasElement } from './base/base-element';
import { createListRowItem } from './base/base-list';
import { baseCanvasMetadataObject } from './base/base-metadata';
import { mutateFEROV, deMutateFEROV } from 'builder_platform_interaction-data-mutation-lib';

const elementType = ELEMENT_TYPE.ASSIGNMENT;

export function createAssignment(assignment = {}) {
    const newAssignment = baseCanvasElement(assignment);
    let { assignmentItems } = assignment;
    if (assignmentItems && assignmentItems.length > 0) {
        assignmentItems = assignmentItems.map(assignmentItem => createAssignmentItem(assignmentItem));
    } else {
        const newAssignmentItem = createAssignmentItem();
        assignmentItems = [newAssignmentItem];
    }
    return Object.assign(newAssignment, {
        assignmentItems,
        elementType
    });
}

export function createAssignmentItem(assignmentItem = {}) {
    let newAssignmentItem;

    if (assignmentItem.hasOwnProperty('value')) {
        newAssignmentItem = mutateFEROV(assignmentItem, 'value', {
            valueProperty: 'rightHandSide',
            dataTypeProperty: 'rightHandSideDataType',
        });
        newAssignmentItem.leftHandSide = assignmentItem.assignToReference;
        newAssignmentItem.operator = assignmentItem.operator;
        newAssignmentItem = createListRowItem(newAssignmentItem);
    } else {
        newAssignmentItem = createListRowItem(assignmentItem);
    }

    return newAssignmentItem;
}

export function createAssignmentMetadataObject(assignment = {}) {
    const newAssignment = baseCanvasMetadataObject(assignment);
    let { assignmentItems } = assignment;
    if (assignmentItems && assignmentItems.length > 0) {
        assignmentItems = assignmentItems.map(assignmentItem => createAssignmentItemMetadataObject(assignmentItem));
    } else {
        const newAssignmentItem = createAssignmentItemMetadataObject();
        assignmentItems = [newAssignmentItem];
    }
    return Object.assign(newAssignment, {
        assignmentItems
    });
}

export function createAssignmentItemMetadataObject(assignmentItem = {}) {
    const newAssignmentItem = deMutateFEROV(assignmentItem, 'value', {
        valueProperty: 'rightHandSide',
        dataTypeProperty: 'rightHandSideDataType',
    });
    newAssignmentItem.assignToReference = assignmentItem.leftHandSide;
    newAssignmentItem.operator = assignmentItem.operator;

    return newAssignmentItem;
}