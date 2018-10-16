import {
    createListRowItem,
    createExpressionListRowItemWithoutOperator,
    RHS_PROPERTY,
    RHS_DATA_TYPE_PROPERTY
} from "./baseList";
import { createFEROV, createFEROVMetadataObject } from '../ferov';
import { CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";

const lhsMetadataPropertyName = 'value';

export function createFilter(filter = {}, objectType) {
    let newFilter;

    if (filter.hasOwnProperty('field')) {
        let leftHandSide = '';
        if (filter.field) {
            leftHandSide = objectType + '.' + filter.field;
        }
        const { operator = ''} = filter;
        const rhsFerovObject = createFEROV(
            filter.value,
            RHS_PROPERTY,
            RHS_DATA_TYPE_PROPERTY
        );
        newFilter = Object.assign(
            {},
            { leftHandSide, operator },
            rhsFerovObject
        );
        newFilter = createListRowItem(newFilter);
    } else {
        newFilter = createListRowItem(filter);
    }

    return newFilter;
}

export function createFilterMetadataObject(filter) {
    if (!filter) {
        throw new Error('record filter is not defined');
    }

    const field = filter.leftHandSide.substring(
        filter.leftHandSide.indexOf('.') + 1
    );
    const operator = filter.operator;
    const value = createFEROVMetadataObject(
        filter,
        RHS_PROPERTY,
        RHS_DATA_TYPE_PROPERTY
    );
    const newFilter = Object.assign({}, { field, operator, value });

    return newFilter;
}


export function createFlowInputFieldAssignmentMetadataObject(inputParameter) {
    if (!inputParameter) {
        throw new Error('record Flow Input Field Assignment is not defined');
    }

    const field = inputParameter.leftHandSide.substring(
        inputParameter.leftHandSide.indexOf('.') + 1
    );
    const value = createFEROVMetadataObject(
        inputParameter,
        RHS_PROPERTY,
        RHS_DATA_TYPE_PROPERTY
    );
    if (value) {
        return { field, value };
    }
    return {field};
}

export function createFlowInputFieldAssignment(inputAssignmentsItem, objectType) {
    let newAssignment = {};

    if (inputAssignmentsItem.hasOwnProperty('field')) {
        const leftHandSide = objectType + '.' + inputAssignmentsItem.field;
        if (inputAssignmentsItem.hasOwnProperty(lhsMetadataPropertyName)) {
            newAssignment = createFEROV(inputAssignmentsItem.value, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        }
        Object.assign(newAssignment, {leftHandSide});
        newAssignment = createExpressionListRowItemWithoutOperator(newAssignment);
    } else {
        newAssignment = createExpressionListRowItemWithoutOperator(inputAssignmentsItem);
    }
    return newAssignment;
}

export const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];