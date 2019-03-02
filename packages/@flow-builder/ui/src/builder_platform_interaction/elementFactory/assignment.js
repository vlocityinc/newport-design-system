import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseCanvasElement, duplicateCanvasElement, baseCanvasElementsArrayToMap } from "./base/baseElement";
import { createListRowItem, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY } from "./base/baseList";
import { baseCanvasElementMetadataObject } from "./base/baseMetadata";
import { createFEROV, createFEROVMetadataObject } from './ferov';
import { createConnectorObjects } from './connector';

const elementType = ELEMENT_TYPE.ASSIGNMENT;
const maxConnections = 1;

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
        maxConnections,
        elementType
    });

    return assignmentObject;
}

export function createDuplicateAssignment(assignment = {}, newGuid, newName) {
    const newAssignment = createAssignment(assignment);
    const duplicateAssignment = duplicateCanvasElement(newAssignment, newGuid, newName);

    return duplicateAssignment;
}

export function createAssignmentWithConnectors(assignment = {}) {
    const newAssignment = createAssignment(assignment);
    const connectors = createConnectorObjects(assignment, newAssignment.guid);
    const connectorCount = connectors ? connectors.length : 0;

    const assignmentObject = Object.assign(newAssignment, { connectorCount });

    return baseCanvasElementsArrayToMap([assignmentObject], connectors);
}

export function createAssignmentItem(assignmentItem = {}) {
    let newAssignmentItem;

    if (assignmentItem.hasOwnProperty('assignToReference')) {
        const leftHandSide = assignmentItem.assignToReference;
        const operator = assignmentItem.operator;
        const rhsFerovObject = createFEROV(assignmentItem.value, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        newAssignmentItem = Object.assign({}, {leftHandSide, operator}, rhsFerovObject);
        newAssignmentItem = createListRowItem(newAssignmentItem);
    } else {
        newAssignmentItem = createListRowItem(assignmentItem);
    }

    return newAssignmentItem;
}

export function createAssignmentMetadataObject(assignment, config = {}) {
    if (!assignment) {
        throw new Error('assignment is not defined');
    }

    const newAssignment = baseCanvasElementMetadataObject(assignment, config);
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

export function createAssignmentItemMetadataObject(assignmentItem) {
    if (!assignmentItem) {
        throw new Error('assignmentItem is not defined');
    }

    const assignToReference = assignmentItem.leftHandSide;
    const operator = assignmentItem.operator;
    const value = createFEROVMetadataObject(assignmentItem, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);

    const newAssignmentItem = Object.assign({}, {assignToReference, operator, value});

    return newAssignmentItem;
}