import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getDataTypeKey } from '../ferov';

export const RHS_PROPERTY = 'rightHandSide';
export const RHS_DATA_TYPE_PROPERTY = getDataTypeKey(RHS_PROPERTY);

/**
 * This function creates a new list row item object.
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createListRowItem(listRowItem = {}) {
    const { operator = '' } = listRowItem;
    const listRowItemWithoutOperator = createExpressionListRowItemWithoutOperator(listRowItem);
    const newListRowItem = Object.assign(listRowItemWithoutOperator, { operator });
    return newListRowItem;
}

/**
 * This function creates a new list row item object without an operator.
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createExpressionListRowItemWithoutOperator(listRowItem = {}) {
    const { leftHandSide = '', rightHandSide = '', rightHandSideDataType = '', rowIndex = generateGuid() } = listRowItem;

    return {
        rowIndex,
        leftHandSide,
        rightHandSide,
        rightHandSideDataType
    };
}

/**
 * This function creates a new parameter list row item object.
 * @param {Object} listRowItem object which is used to create new parameter list row item object. If it is not passed, then default values are used.
 * @returns {Object} new parameter list row item object
 */
export function createParameterListRowItem(listRowItem = {}) {
    const { name = '', value = '', valueDataType = '', rowIndex = generateGuid() } = listRowItem;

    return ({
        rowIndex,
        name,
        value,
        valueDataType,
    });
}