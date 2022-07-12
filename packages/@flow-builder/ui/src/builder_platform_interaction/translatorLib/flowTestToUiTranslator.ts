import {
    createFlowTestAssertionsUIModel,
    createFlowTestRecordsUIModel,
    FlowTestParameterType,
    getFlowTestScheduledPathValueFromFlowTest,
    getParameters
} from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { swapDevNamesToGuids } from './uidSwapping';

/**
 * Convert FlowTest tooling object to UI data model
 *
 * @param flowTest flow test data from Flow Test tooling object
 * @param flowTriggerType current trigger type of the flow
 * @param convertDebugToTest indicates if the flow test data is from a debug run or an existing test
 * @returns FlowTest tooling object
 */
export function translateFlowTestToUIModel(flowTest, flowTriggerType, convertDebugToTest = false): UI.FlowTestData {
    let testTriggerType;
    let assertionArr;
    let records;
    let runPathValue;
    if (flowTest && flowTest.metadata) {
        const parameterData = getParameters(flowTest.metadata);
        if (convertDebugToTest === false) {
            testTriggerType =
                flowTriggerType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE
                    ? isUpdateTestTriggerType(parameterData)
                        ? FLOW_TRIGGER_SAVE_TYPE.UPDATE
                        : FLOW_TRIGGER_SAVE_TYPE.CREATE
                    : flowTriggerType;
        } else {
            testTriggerType = isUpdateTestTriggerType(parameterData)
                ? FLOW_TRIGGER_SAVE_TYPE.UPDATE
                : FLOW_TRIGGER_SAVE_TYPE.CREATE;
        }
        assertionArr = createFlowTestAssertionsUIModel(flowTest.metadata);
        records = createFlowTestRecordsUIModel(flowTest.metadata, testTriggerType);
        runPathValue = getFlowTestScheduledPathValueFromFlowTest(parameterData);
    }

    swapDevNamesToGuids(Store.getStore().getCurrentState().elements, assertionArr);

    const label = flowTest?.metadata?.label;
    const name = flowTest?.fullName;
    const description = flowTest?.metadata?.description;
    const testInitialRecordData = records?.length >= 1 ? records[0] : undefined;
    const testUpdatedRecordData = records?.length >= 2 ? records[1] : undefined;
    runPathValue = runPathValue ? runPathValue : SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH;
    return {
        label,
        name,
        description,
        runPathValue,
        testTriggerType,
        testInitialRecordData,
        testUpdatedRecordData,
        testAssertions: assertionArr
    };
}

/**
 * Helper function checks if test trigger type is update or not
 *
 * @param parameterData saved test data
 * @returns boolean, true for Update trigger type else false
 */
function isUpdateTestTriggerType(parameterData): boolean {
    return (
        parameterData.some((e) => e.type === FlowTestParameterType.Input) &&
        parameterData.some((e) => e.type === FlowTestParameterType.UpdateRecord)
    );
}
