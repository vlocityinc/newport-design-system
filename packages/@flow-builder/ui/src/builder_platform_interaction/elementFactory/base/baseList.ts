// @ts-nocheck
import { ValueWithError } from 'builder_platform_interaction/dataMutationLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getDataTypeKey } from '../ferov';

// @ts-nocheck
/**
 * @enum {string} MERGE_WARNING_TYPE
 */
export enum MERGE_WARNING_TYPE {
    NOT_AVAILABLE = 'notAvailable', // variable is not available in the subflow or parameter is not available in the action or apex plugin
    DATA_TYPE_CHANGED = 'dataTypeChanged',
    ONLY_AVAILABLE_IN_LATEST = 'onlyAvailableInLatest',
    ONLY_AVAILABLE_IN_ACTIVE = 'onlyAvailableInActive',
    DUPLICATE = 'duplicate'
}

export type ParameterListRowItem = {
    rowIndex: UI.Guid;
    name: string | ValueWithError;
    value: string | ValueWithError;
    valueDataType: string;
    warnings?: MERGE_WARNING_TYPE[];
    // When coming from the api
    dataType?: string;
    subtype?: string;
    isCollection?: boolean;
    maxOccurs?: number;
};

/**
 * @param obj
 */
export function isParameterListRowItem(obj: any): obj is ParameterListRowItem {
    return obj && obj.rowIndex !== undefined && obj.valueDataType !== undefined;
}

export const RHS_PROPERTY = 'rightHandSide';
export const RHS_DATA_TYPE_PROPERTY = getDataTypeKey(RHS_PROPERTY);

/**
 * This function creates a new list row item object.
 *
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createListRowItem(listRowItem = {}) {
    const { operator = '' } = listRowItem;
    const listRowItemWithoutOperator = createExpressionListRowItemWithoutOperator(listRowItem);
    const newListRowItem = Object.assign(listRowItemWithoutOperator, {
        operator
    });
    return newListRowItem;
}

/**
 * This function creates a new list row item object without an operator.
 *
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createExpressionListRowItemWithoutOperator(listRowItem = {}) {
    const {
        leftHandSide = '',
        leftHandSideDataType,
        rightHandSide = '',
        rightHandSideDataType = '',
        rowIndex = generateGuid()
    } = listRowItem;

    return {
        rowIndex,
        leftHandSide,
        leftHandSideDataType,
        rightHandSide,
        rightHandSideDataType
    };
}

/**
 * This function creates a new list row item object without an operator and without the rightHandSideDataType.
 *
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createExpressionListRowItemWithoutOperatorAndRHSDataType(listRowItem = {}) {
    const { leftHandSide = '', leftHandSideDataType, rightHandSide = '', rowIndex = generateGuid() } = listRowItem;

    return {
        rowIndex,
        leftHandSide,
        leftHandSideDataType,
        rightHandSide
    };
}

/**
 * This function creates a new parameter list row item object.
 *
 * @param {Object} listRowItem object which is used to create new parameter list row item object. If it is not passed, then default values are used.
 * @returns {Object} new parameter list row item object
 */
export function createParameterListRowItem(listRowItem = {}): ParameterListRowItem {
    const {
        name = '',
        value = '',
        valueDataType = '',
        subtype = '',
        rowIndex = generateGuid(),
        isCollection = false
    } = listRowItem;

    return {
        rowIndex,
        name,
        value,
        valueDataType,
        subtype,
        isCollection
    };
}
