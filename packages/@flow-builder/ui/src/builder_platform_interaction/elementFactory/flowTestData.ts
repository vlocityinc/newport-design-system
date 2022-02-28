import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseResource } from './base/baseElement';
import { RHS_DATA_TYPE_PROPERTY, RHS_PROPERTY } from './base/baseList';
import { createFEROV, createFEROVMetadataObject } from './ferov';

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
 * Create object for flow test data
 *
 * @param flowTestData UI model for the flow test data
 * @returns flow test object
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
        testInitialRecordData = {},
        testUpdatedRecordData = {}
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
        testInitialRecordData,
        testUpdatedRecordData
    };

    return flowTestObject;
}

/**
 * Helper function to create a new FlowTestAssertion object with an empty expression
 * and no message
 *
 * @returns UI.ExpressionFilter
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

/**
 * Create flow test assertions UI model from metadata object
 *
 * @param flowTestMetadata test data from metadata object
 * @returns UI model for assertions
 */
export function createFlowTestAssertionsUIModel(flowTestMetadata: Metadata.FlowTestMetadata): UI.FlowTestAssertion[] {
    const testAssertionUIModel: UI.FlowTestAssertion[] = [];
    const assertArr: Metadata.FlowTestAssertion[] = flowTestMetadata.testPoints.find(
        (n) => n.elementApiName === FlowTestPointValidator.Finish
    )!.assertions;
    assertArr?.forEach((assert) => {
        assert.conditions.forEach((condition) => {
            const leftHandSide = condition.leftValueReference;
            const operator = condition.operator;
            const rhsFerovObject = createFEROV(condition.rightValue, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
            const uiExp = createListRowItem({ ...{ leftHandSide, operator }, ...rhsFerovObject });
            const testAssert: UI.FlowTestAssertion = { expression: uiExp, message: assert.errorMessage };
            testAssertionUIModel.push(testAssert);
        });
    });
    return testAssertionUIModel;
}
