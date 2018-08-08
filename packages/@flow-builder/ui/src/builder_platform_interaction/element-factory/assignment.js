import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { baseCanvasElement, baseElementsWithConnectors } from './base/base-element';
import { createListRowItem } from './base/base-list';
import { baseCanvasMetadataObject } from './base/base-metadata';
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createConnectorObjects } from 'builder_platform_interaction-connector-utils';

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
    const assignmentObject = Object.assign(newAssignment, {
        assignmentItems,
        elementType
    });

    return assignmentObject;
}

export function createAssignmentWithConnectors(assignment = {}) {
    const newAssignment = createAssignment(assignment);

    const connectors = createConnectorObjects(assignment);

    return baseElementsWithConnectors([newAssignment], connectors);
}

export function createAssignmentItem(assignmentItem = {}) {
    let newAssignmentItem;

    if (assignmentItem.hasOwnProperty('assignToReference')) {
        newAssignmentItem = createFEROV(assignmentItem, 'value', {
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
    const newAssignmentItem = createFEROVMetadataObject(assignmentItem, 'value', {
        valueProperty: 'rightHandSide',
        dataTypeProperty: 'rightHandSideDataType',
    });
    const assignToReference = assignmentItem.leftHandSide;
    const operator = assignmentItem.operator;

    return Object.assign(newAssignmentItem, {
        assignToReference,
        operator
    });
}