// @ts-nocheck
import {
    createListRowItem,
    createExpressionListRowItemWithoutOperator,
    createExpressionListRowItemWithoutOperatorAndRHSDataType,
    RHS_PROPERTY,
    RHS_DATA_TYPE_PROPERTY
} from './baseList';
import { createFEROV, createFEROVMetadataObject, getDataTypeKey } from '../ferov';
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const lhsMetadataPropertyName = 'value';
const outputLhsMetadataPropertyName = 'assignToReference';

/**
 * @param filter
 * @param objectType
 */
export function createFilter(filter = {}, objectType) {
    let newFilter;

    if (filter.hasOwnProperty('field')) {
        let leftHandSide = '';
        if (filter.field) {
            leftHandSide = objectType + '.' + filter.field;
        }
        const { operator = '' } = filter;
        const rhsFerovObject = createFEROV(filter.value, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        // we add leftHandSideDataType to make sure that leftHandSide ('Account.Name') is not transformed to a guid if a variable has the same name as the entity
        newFilter = Object.assign(
            {},
            { leftHandSide, leftHandSideDataType: FLOW_DATA_TYPE.STRING.value, operator },
            rhsFerovObject
        );
        newFilter = createListRowItem(newFilter);
    } else {
        newFilter = createListRowItem(filter);
    }

    return newFilter;
}

/**
 * @param filter
 */
export function createFilterMetadataObject(filter) {
    if (!filter) {
        throw new Error('record filter is not defined');
    }

    const field = filter.leftHandSide.substring(filter.leftHandSide.indexOf('.') + 1);
    const operator = filter.operator;
    const value = createFEROVMetadataObject(filter, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
    const newFilter = Object.assign({}, { field, operator, value });

    return newFilter;
}

/**
 * @param inputParameter
 */
export function createFlowInputFieldAssignmentMetadataObject(inputParameter) {
    if (!inputParameter) {
        throw new Error('record Flow Input Field Assignment is not defined');
    }

    const field = inputParameter.leftHandSide.substring(inputParameter.leftHandSide.indexOf('.') + 1);
    const value = createFEROVMetadataObject(inputParameter, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
    if (value) {
        return { field, value };
    }
    return { field };
}

/**
 * @param inputAssignmentsItem
 * @param objectType
 */
export function createFlowInputFieldAssignment(inputAssignmentsItem, objectType) {
    let newAssignment = {};

    if (inputAssignmentsItem.hasOwnProperty('field')) {
        const leftHandSide = objectType + '.' + inputAssignmentsItem.field;
        if (inputAssignmentsItem[lhsMetadataPropertyName]) {
            newAssignment = createFEROV(
                inputAssignmentsItem[lhsMetadataPropertyName],
                RHS_PROPERTY,
                RHS_DATA_TYPE_PROPERTY
            );
        }
        // we add leftHandSideDataType to make sure that leftHandSide ('Account.Name') is not transformed to a guid if a variable has the same name as the entity
        const leftHandSideDataTypeKey = getDataTypeKey('leftHandSide');
        Object.assign(newAssignment, { leftHandSide, [leftHandSideDataTypeKey]: FLOW_DATA_TYPE.STRING.value });
        newAssignment = createExpressionListRowItemWithoutOperator(newAssignment);
    } else {
        newAssignment = createExpressionListRowItemWithoutOperator(inputAssignmentsItem);
    }
    return newAssignment;
}

/**
 * @param outputAssignmentsItem
 * @param objectType
 */
export function createFlowOutputFieldAssignment(outputAssignmentsItem, objectType) {
    let newAssignment = {};

    if (outputAssignmentsItem.hasOwnProperty('field')) {
        const leftHandSide = objectType + '.' + outputAssignmentsItem.field;
        const rightHandSide = outputAssignmentsItem[outputLhsMetadataPropertyName];
        // we add leftHandSideDataType to make sure that leftHandSide ('Account.Name') is not transformed to a guid if a variable has the same name as the entity
        newAssignment = createExpressionListRowItemWithoutOperatorAndRHSDataType({
            leftHandSide,
            leftHandSideDataType: FLOW_DATA_TYPE.STRING.value,
            rightHandSide
        });
    } else {
        newAssignment = createExpressionListRowItemWithoutOperatorAndRHSDataType(outputAssignmentsItem);
    }
    return newAssignment;
}

/**
 * @param outputParameter
 */
export function createFlowOutputFieldAssignmentMetadataObject(outputParameter) {
    if (!outputParameter) {
        throw new Error('record Flow output Field Assignment is not defined');
    }

    const field = outputParameter.leftHandSide.substring(outputParameter.leftHandSide.indexOf('.') + 1);

    return {
        field,
        [outputLhsMetadataPropertyName]: outputParameter.rightHandSide
    };
}

/**
 * @param {Object[]} assignments - input or output Assignments.
 * @returns {Object[] || []} [] if the assignments array contains only one empty assignment.
 */
export function createEmptyAssignmentMetadata(assignments) {
    if (assignments.length === 1 && assignments[0].field === '') {
        return [];
    }
    return assignments;
}

export const getDefaultAvailableConnections = () => [
    {
        type: CONNECTOR_TYPE.REGULAR
    },
    {
        type: CONNECTOR_TYPE.FAULT
    }
];

export const createRecordFilters = (filters, object, defaultFilters = [createFilter()]) => {
    return filters && filters.length > 0 ? filters.map((filter) => createFilter(filter, object)) : defaultFilters;
};
