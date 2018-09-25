import { generateGuid } from "builder_platform_interaction/storeLib";

export const rhsPropertyName = 'rightHandSide';
export const rhsDataTypePropertyName = 'rightHandSideDataType';
export const rhsGuidPropertyName = 'rightHandSideGuid';

/**
 * This function creates a new list row item object.
 * @param {Object} listRowItem object which is used to create new list row item object. If it is not passed, then default values are used.
 * @returns {Object} new list row item object
 */
export function createListRowItem(listRowItem = {}) {
    const { leftHandSide = '', operator = '', rightHandSide = '', rightHandSideDataType = 'string', rowIndex = generateGuid() } = listRowItem;

    // HACK : Follow up with Process UI Runtime, RHS in expression builder does not seem to get the reference({!foo}) and instead gets just the value (foo)
    let { rightHandSideGuid } = listRowItem;
    rightHandSideGuid = rightHandSideGuid || rightHandSide;

    return ({
        rowIndex,
        leftHandSide,
        operator,
        rightHandSide,
        rightHandSideGuid,
        rightHandSideDataType
    });
}

/**
 * This function creates a new parameter list row item object.
 * @param {Object} listRowItem object which is used to create new parameter list row item object. If it is not passed, then default values are used.
 * @returns {Object} new parameter list row item object
 */
export function createParameterListRowItem(listRowItem = {}) {
    const { name = '', value = '', valueDataType = '', rowIndex = generateGuid() } = listRowItem;

    let { valueGuid } = listRowItem;
    valueGuid = valueGuid || value;

    return ({
        rowIndex,
        name,
        value,
        valueDataType,
        valueGuid
    });
}