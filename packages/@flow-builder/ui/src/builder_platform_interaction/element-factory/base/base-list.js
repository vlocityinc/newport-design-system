import { generateGuid } from 'builder_platform_interaction-store-lib';

export const rhsPropertyName = 'rightHandSide';
export const rhsDataTypePropertyName = 'rightHandSideDataType';
export const rhsGuidPropertyName = 'rightHandSideGuid';

/**
 * This function creates a new list row item object.
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createListRowItem(listRowItem = {}) {
    const { leftHandSide = '', operator = '', rightHandSide = '', rightHandSideGuid = '', rightHandSideDataType = 'string', rowIndex = generateGuid() } = listRowItem;

    return ({
        rowIndex,
        leftHandSide,
        operator,
        rightHandSide,
        rightHandSideGuid,
        rightHandSideDataType
    });
}