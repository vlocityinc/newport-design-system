import {
    createListRowItem,
    createExpressionListRowItemWithoutOperator,
    rhsPropertyName,
    rhsDataTypePropertyName
} from "./baseList";
import { createFEROV, createFEROVMetadataObject } from '../ferov';

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
            rhsPropertyName,
            rhsDataTypePropertyName
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
        rhsPropertyName,
        rhsDataTypePropertyName
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
        rhsPropertyName,
        rhsDataTypePropertyName
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
            newAssignment = createFEROV(inputAssignmentsItem.value, rhsPropertyName, rhsDataTypePropertyName);
        }
        Object.assign(newAssignment, {leftHandSide});
        newAssignment = createExpressionListRowItemWithoutOperator(newAssignment);
    } else {
        newAssignment = createExpressionListRowItemWithoutOperator(inputAssignmentsItem);
    }
    return newAssignment;
}