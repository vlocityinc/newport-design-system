import {
    createListRowItem,
    createExpressionListRowItemWithoutOperator,
    createExpressionListRowItemWithoutOperatorAndRHSDataType,
    RHS_PROPERTY,
    RHS_DATA_TYPE_PROPERTY
} from "./baseList";
import { createFEROV, createFEROVMetadataObject } from '../ferov';
import { CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";

const lhsMetadataPropertyName = 'value';
const outputLhsMetadataPropertyName = 'assignToReference';

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
        if (inputAssignmentsItem[lhsMetadataPropertyName]) {
            newAssignment = createFEROV(inputAssignmentsItem[lhsMetadataPropertyName], RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        }
        Object.assign(newAssignment, {leftHandSide});
        newAssignment = createExpressionListRowItemWithoutOperator(newAssignment);
    } else {
        newAssignment = createExpressionListRowItemWithoutOperator(inputAssignmentsItem);
    }
    return newAssignment;
}

export function createFlowOutputFieldAssignment(outputAssignmentsItem, objectType) {
    let newAssignment = {};

    if (outputAssignmentsItem.hasOwnProperty('field')) {
        const leftHandSide = objectType + '.' + outputAssignmentsItem.field;
        const rightHandSide = outputAssignmentsItem[outputLhsMetadataPropertyName];
        newAssignment = createExpressionListRowItemWithoutOperatorAndRHSDataType({leftHandSide, rightHandSide});
    } else {
        newAssignment = createExpressionListRowItemWithoutOperatorAndRHSDataType(outputAssignmentsItem);
    }
    return newAssignment;
}

export function createFlowOutputFieldAssignmentMetadataObject(outputParameter) {
    if (!outputParameter) {
        throw new Error('record Flow output Field Assignment is not defined');
    }

    const field = outputParameter.leftHandSide.substring(
        outputParameter.leftHandSide.indexOf('.') + 1
    );

    return { field, [outputLhsMetadataPropertyName]: outputParameter.rightHandSide };
}

export const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export const createRecordFilters = (filters, object) => {
    if (filters && filters.length > 0) {
        filters = filters.map(filter => createFilter(filter, object));
    } else {
        const newFilter = createFilter();
        filters = [newFilter];
    }
    return filters;
};