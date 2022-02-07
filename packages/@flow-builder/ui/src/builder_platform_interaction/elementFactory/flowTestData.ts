import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource } from './base/baseElement';

const elementType = ELEMENT_TYPE.FLOW_TEST_EDITOR;

/**
 * @param flowTestData
 */
export function createFlowTestData(flowTestData: UI.FlowTestData) {
    const newFlowTestData = baseResource(flowTestData);
    const { label = '', name = '', description = '', runPathValue = '', testTriggerType = '' } = flowTestData || {};
    const flowTestObject = {
        ...newFlowTestData,
        elementType,
        label,
        name,
        description,
        runPathValue,
        testTriggerType
    };

    return flowTestObject;
}
