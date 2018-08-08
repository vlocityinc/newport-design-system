import { generateGuid } from 'builder_platform_interaction-store-lib';

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