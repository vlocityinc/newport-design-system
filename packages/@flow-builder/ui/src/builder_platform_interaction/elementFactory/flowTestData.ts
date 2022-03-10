import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import { ELEMENT_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';
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
 * Create flow test parameters object from UI
 *
 * @param uiModel data in UI
 * @returns flow test parameters for flow test metadata object
 */
export function createFlowTestParametersMetadataObject(uiModel: UI.FlowTestData): Metadata.FlowTestParameter[] {
    const testParameterArr: Metadata.FlowTestParameter[] = [];
    addParameters(uiModel.testInitialRecordData, FlowTestParameterType.Input, testParameterArr);
    if (
        uiModel.testTriggerType === FLOW_TRIGGER_SAVE_TYPE.UPDATE &&
        Object.keys(uiModel.testUpdatedRecordData).length > 0
    ) {
        addParameters(uiModel.testUpdatedRecordData, FlowTestParameterType.UpdateRecord, testParameterArr);
    }
    return testParameterArr;
}

/**
 * Add record to parameter attribute of flow test object
 *
 * @param record represents sobject to be added
 * @param parameterType input or update_record type
 * @param testParameterArray array containing records
 */
function addParameters(
    record: object,
    parameterType: FlowTestParameterType,
    testParameterArray: Metadata.FlowTestParameter[]
) {
    const recordParameter: Metadata.FlowTestParameter = {
        leftValueReference: '$Record',
        value: {
            sobjectValue: JSON.stringify(record)
        },
        type: parameterType
    };
    testParameterArray.push(recordParameter);
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

/**
 * Create flow test initial and update records UI model from metadata object
 *
 * @param flowTestMetadata test data from metadata object
 * @param testTriggerType trigger type for the test
 * @returns array of records (contains atleast initial record and updated record, if update trigger type)
 */
export function createFlowTestRecordsUIModel(
    flowTestMetadata: Metadata.FlowTestMetadata,
    testTriggerType: string
): object[] {
    const records = [];
    const parameterArr: Metadata.FlowTestParameter[] = flowTestMetadata.testPoints.find(
        (n) => n.elementApiName === FlowTestPointValidator.Start
    )!.parameters;
    addParametersToUI(parameterArr, FlowTestParameterType.Input, records);
    if (testTriggerType === FLOW_TRIGGER_SAVE_TYPE.UPDATE) {
        addParametersToUI(parameterArr, FlowTestParameterType.UpdateRecord, records);
    }
    return records;
}

/**
 * Helper function to create array of records
 *
 * @param parameterArr parameters array from metadata object
 * @param parameterType type of parameter from FlowTestParameterType enum
 * @param records array of records
 * @returns updated array of records
 */
function addParametersToUI(
    parameterArr: Metadata.FlowTestParameter[],
    parameterType: FlowTestParameterType,
    records: object[]
): object[] {
    const parameterValue = parameterArr.find((i) => i.type === parameterType)!.value;
    // @ts-ignore
    records.push(JSON.parse(parameterValue.sobjectValue));
    return records;
}
