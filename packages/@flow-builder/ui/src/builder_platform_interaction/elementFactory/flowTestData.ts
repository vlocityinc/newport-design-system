import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource } from './base/baseElement';

const elementType = ELEMENT_TYPE.FLOW_TEST_EDITOR;

/**
 * @param flowTestData
 */
export function createFlowTestData(flowTestData: UI.FlowTestData) {
    const newFlowTestData = baseResource(flowTestData);
    const {
        label = '',
        name = '',
        description = '',
        runPathValue = '',
        testTriggerType = '',
        testAssertions = []
    } = flowTestData || {};
    if (testAssertions.length < 1) {
        testAssertions.push(createEmptyTestAssertion());
    }
    const flowTestObject = {
        ...newFlowTestData,
        elementType,
        label,
        name,
        description,
        runPathValue,
        testTriggerType,
        testAssertions
    };

    return flowTestObject;
}

/**
 * Helper function to create a new FlowTestAssertion object with an empty expression
 * and no message
 */
export function createEmptyTestAssertion(): UI.FlowTestAssertion {
    return { expression: createListRowItem() };
}
