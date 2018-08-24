import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { baseCanvasElement, baseElementsWithConnectors } from './base/base-element';
import { createListRowItem, rhsProperty, rhsDataTypeProperty } from './base/base-list';
import { baseCanvasMetadataObject } from './base/base-metadata';
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createConnectorObjects } from './connector';

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

    const connectors = createConnectorObjects(assignment, newAssignment.guid);

    return baseElementsWithConnectors([newAssignment], connectors);
}

export function createAssignmentItem(assignmentItem = {}) {
    let newAssignmentItem;

    if (assignmentItem.hasOwnProperty('assignToReference')) {
        const leftHandSide = assignmentItem.assignToReference;
        const operator = assignmentItem.operator;
        const rhsFerovObject = createFEROV(assignmentItem.value, rhsProperty, rhsDataTypeProperty);
        newAssignmentItem = Object.assign({}, {leftHandSide, operator}, rhsFerovObject);
        newAssignmentItem = createListRowItem(newAssignmentItem);
    } else {
        newAssignmentItem = createListRowItem(assignmentItem);
    }

    return newAssignmentItem;
}

export function createAssignmentMetadataObject(assignment = {}, config) {
    const newAssignment = baseCanvasMetadataObject(assignment, config);
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
    const assignToReference = assignmentItem.leftHandSide;
    const operator = assignmentItem.operator;
    const value = createFEROVMetadataObject(assignmentItem, rhsProperty, rhsDataTypeProperty);

    const newAssignmentItem = Object.assign({}, {assignToReference, operator, value});

    return newAssignmentItem;
}