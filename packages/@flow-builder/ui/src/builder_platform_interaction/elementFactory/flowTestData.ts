import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource } from './base/baseElement';
import { RHS_DATA_TYPE_PROPERTY, RHS_PROPERTY } from './base/baseList';
import { createFEROVMetadataObject } from './ferov';

export enum FlowTestParameterType {
    Input = 'INPUT',
    UpdateRecord = 'UPDATE_RECORD'
}

export enum FlowTestPointValidator {
    Start = 'START',
    Finish = 'FINISH'
}

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
        testAssertions = [],
        testInitialRecordData = {}
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
        testAssertions,
        testInitialRecordData
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

/**
 * Create flow test assertions metadata object from UI
 *
 * @param uiModel data in UI
 * @returns test assertions for flow test metadata object
 */
export function createFlowTestAssertionsMetadataObject(uiModel: UI.FlowTestData) {
    const testAssertions: Metadata.FlowTestAssertion[] = [];
    const testAsserts = uiModel.testAssertions;
    testAsserts.forEach((testAssert) => {
        const testCondition = {
            leftValueReference: testAssert.expression.leftHandSide,
            operator: testAssert.expression.operator,
            rightValue: createFEROVMetadataObject(testAssert.expression, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY)
        };
        const testConditionArr: Metadata.FlowTestCondition[] = [];
        testConditionArr.push(testCondition);
        testAssertions.push({
            conditions: testConditionArr,
            errorMessage: testAssert.message
        });
    });
    return testAssertions;
}
