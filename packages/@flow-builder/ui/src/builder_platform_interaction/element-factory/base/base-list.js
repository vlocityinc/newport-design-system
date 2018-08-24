import { generateGuid } from 'builder_platform_interaction-store-lib';

export const rhsProperty = 'rightHandSide';
export const rhsDataTypeProperty = 'rightHandSideDataType';

export function createListRowItem(listRowItem = {}) {
    const { leftHandSide = '', operator = '', rightHandSide = '', rightHandSideDataType = 'string', guid = generateGuid() } = listRowItem;

    return ({
        guid,
        leftHandSide,
        operator,
        rightHandSide,
        rightHandSideDataType
    });
}